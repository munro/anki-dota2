/*jslint node: true, nomen: true, unparam: true, vars: true */

'use strict';

var _ = require('lodash');

function lineBreakToBR(str) {
    return str.replace(/\r?\n\r?/g, '<br>');
}

var DOTA2_HERO_URL = 'http://www.dota2.com/heroes/';

var CARD_HERO_FRONT_TPL = _.compose(lineBreakToBR, _.template(
    'Who is this hero <img src="<%= hero.image %>">?'
)), CARD_HERO_BACK_TPL = _.compose(lineBreakToBR, _.template(
    '<b><%= hero.name %></b>'
));

var CARD_HERO_ABILITIES_FRONT_TPL = _.compose(lineBreakToBR, _.template(
    'What are the abilities of <b><%= hero.name %> <img src="<%= hero.image %>"></b>?'
)), CARD_HERO_ABILITIES_BACK_TPL = _.compose(lineBreakToBR, _.template(
    '<% _.forEach(hero.abilities, function (ability) { %>' +
        '<img src="<%= ability.image %>"> <b><%= ability.name %></b><br>\n' +
        '<% }); %>'
));

var CARD_HERO_ABILITY_FRONT_TPL = _.compose(lineBreakToBR, _.template(
    '[Video] How does the ability <img src="<%= ability.image %>"> <b><%= ability.name %></b> from <b><%= hero.name %> <img src="<%= hero.image %>"></b> work? '
)), CARD_HERO_ABILITY_BACK_TPL = _.compose(lineBreakToBR, _.template(
    '[sound:<%= ability.video %>]' +
        '<p><%= ability.description %></p><br>' +
        '<table><tr valign="top" align="left">' +
        '<td width="50%"><% _.forEach(ability.mana, function (attribute) { %>' +
        '<b><%= attribute.name %></b> <%= attribute.value %><br>' +
        '<% }); %></td>' +
        '<td><% _.forEach(ability.attributes, function (attribute) { %>' +
        '<b><%= attribute.name %></b> <%= attribute.value %><br>' +
        '<% }); %></td>' +
        '</tr></table>'
));

var url = require('url'),
    path = require('path'),
    async = require('async'),
    csv = require('ya-csv'),
    P = require('bluebird'),
    fs = P.promisifyAll(require('fs')),
    request = P.promisifyAll(require('request')),
    child_process = P.promisifyAll(require('child_process')),
    $ = require('cheerio');

/**
 * Converts YouTube video URL to a filename.
 *
 * @param {String} youtube_url 
 * @return {String} Filename
 */
function youtubeUrlToFile(youtube_url) {
    var url_parts = url.parse(youtube_url),
        local_file = path.basename(url_parts.pathname) + '.mp4';
    return local_file;
}

/**
 * Pipes stream from one to another, and returns a promise
 *
 * @param {ReadableStream} from
 * @param {WriteableStream} to
 * @return {Promise}
 */
function promisePiper(from, to) {
    var defer = P.defer();

    from.pipe(to);

    to.on('finish', function () {
        defer.resolve();
    });

    from.on('error', function (err) {
        defer.reject(err);
    });

    to.on('error', function (err) {
        defer.reject(err);
    });

    return defer.promise;
}

/**
 * Image downloader
 *
 * @method ImageDownloader.pushAsync
 * @param {Object} task
 * @param {String} task.url URL to image
 * @param {String} task.filename Filename to save image to
 * @param {Number} [task.attempts] Number attempts to download hero
 * @return {Promise} promise
 */
var ImageDownloader = P.promisifyAll(async.queue(function (task, callback) {
    fs.existsAsync(task.filename).then(function () {
        return P.resolve(false);
    }, function () {
        return P.resolve(true);
    }).then(function (exists) {
        if (exists) {
            return;
        }
        console.log('Downloading ' + task.url + ' -> ' + task.filename);
        return promisePiper(request.get(task.url), fs.createWriteStream(task.filename + '.part')).then(function () {
            return fs.renameAsync(task.filename + '.part', task.filename);
        });
    }).then(function () {
        callback();
    }, function (err) {
        task.attempts = (task.attempts || 0) + 1;
        console.error('[Error] Could not download image ' + task.filename + ', retrying attempt ' + task.attempts);
        console.error(err.stack);
        return callback(false, ImageDownloader.pushAsync(task));
    });
}, 10)); // concurrency

/**
 * YouTube downloader
 *
 * @method YoutubeDownloader.pushAsync
 * @param {Object} task
 * @param {String} task.url URL to download YouTube video
 * @param {Number} [task.attempts] Number attempts to download hero
 * @return {Promise} promise
 */
var YoutubeDownloader = P.promisifyAll(async.queue(function (task, callback) {
    var local_file = (task.prefix || '') + youtubeUrlToFile(task.url);

    fs.existsAsync(local_file).then(function () {
        return P.resolve(false);
    }, function () {
        return P.resolve(true);
    }).then(function (exists) {
        if (exists) {
            return;
        }
        console.log('Downloading ' + task.url + ' -> ' + local_file);
        return child_process.execFileAsync('youtube-dl', ['-f', '135', '-o', local_file, task.url]);
    }).then(function () {
        callback();
    }, function (err) {
        task.attempts = (task.attempts || 0) + 1;
        console.error('[Error] Could not download YouTube video ' + local_file + ', retrying attempt ' + task.attempts);
        console.error(err.stack);
        callback(false, YoutubeDownloader.pushAsync(task));
    });
}, 3)); // concurrency

/**
 * Dota2 Hero Downloader
 *
 * @method HeroDownloader.pushAsync
 * @param {Object} task
 * @param {String} task.url URL to download hero
 * @param {Number} [task.attempts] Number attempts to download hero
 * @return {Promise} promise
 * @return {String} promise.name Hero name
 * @return {String} promise.abilities[].name Ability name
 * @return {String} promise.abilities[].image Ability image
 * @return {String} promise.abilities[].description Ability description
 * @return {String} promise.abilities[].attributes[].name Attribute name
 * @return {String} promise.abilities[].attributes[].value Attribute value
 * @return {String} promise.abilities[].mana[].name Mana attribute name
 * @return {String} promise.abilities[].mana[].value Mana attribute value
 * @return {Promise} promise.downloads Promise containing all the downloading media files
 */
var HeroDownloader = P.promisifyAll(async.queue(function (task, callback) {
    request.getAsync(task.url).spread(function (res, body) {
        var $body = $(body),
            name = $body.find('#centerColContent h1').text(),
            downloads = [];

        var abilities = $body.find('.abilitiesInsetBoxContent').map(function (i, elem) {
            var $elem = $(elem);

            var ability = {
                name: $elem.find('.abilityHeaderRowDescription h2').text(),
                image: name + '_ability_' + (i + 1) + '.png',
                description: $elem.find('.abilityHeaderRowDescription p').text(),
                attributes: $elem.find('.abilityFooterBoxLeft span, .abilityFooterBoxRight span').map(function (i, elem) {
                    return [{
                        name: elem.prev.data.replace(/\r\n/g, '').trim(),
                        value: $(elem).text()
                    }];
                }).toArray(),
                mana: $elem.find('.manaCoolKey').map(function (i, elem) {
                    return [{
                        name: $(elem).text(),
                        value: elem.next.data.replace(/\r\n/g, '').trim()
                    }];
                }).toArray(),
                downloads: []
            };

            ability.downloads.push(ImageDownloader.pushAsync({
                url: $elem.find('.overviewAbilityImg').attr('src'),
                filename: 'media/' + name + '_ability_' + (i + 1) + '.png'
            }));

            if ($elem.find('.abilityVideoContainer iframe').attr('src')) {
                ability.downloads.push(YoutubeDownloader.pushAsync({
                    url: $elem.find('.abilityVideoContainer iframe').attr('src'),
                    prefix: 'media/'
                }));
                ability.video = youtubeUrlToFile($elem.find('.abilityVideoContainer iframe').attr('src'));
            }

            return ability;
        }).toArray();

        downloads.push(ImageDownloader.pushAsync({
            url: $body.find('#heroTopPortraitIMG').attr('src'),
            filename: 'media/' + name + '.png'
        }));

        abilities.forEach(function (ability) {
            downloads = downloads.concat(ability.downloads);
            delete ability.downloads;
        });

        callback(false, {
            name: name,
            image: name + '.png',
            abilities: abilities,
            downloads: P.all(downloads)
        });
    }).error(function (err) {
        task.attempts = (task.attempts || 0) + 1;
        console.error('[Error] Could not download hero ' + task.url + ', retrying attempt ' + task.attempts);
        console.error(err.stack);
        return HeroDownloader.pushAsync(task);
    }).done();
}, 10)); // concurrency

/**
 * Kick off downloading all the heroes!
 */
request.getAsync(DOTA2_HERO_URL).spread(function (res, body) {
    var $body = $(body),
        hero_urls = _.toArray($body.find('a.heroPickerIconLink').map(function () {
            return $(this).attr('href');
        }));

    // hero_urls = hero_urls.slice(0, 2);

    P.map(hero_urls, function (url) {
        return HeroDownloader.pushAsync({
            url: url
        }).then(function (hero) {
            return hero.downloads.then(function () {
                delete hero.downloads;
                return hero;
            });
        });
    }).then(function (heroes) {
        var csv_writer = csv.createCsvFileWriter('anki_dota2_deck.csv');

        heroes.forEach(function (hero) {
            csv_writer.writeRecord([CARD_HERO_FRONT_TPL({hero: hero}), CARD_HERO_BACK_TPL({hero: hero})]);

            csv_writer.writeRecord([
                CARD_HERO_ABILITIES_FRONT_TPL({hero: hero}),
                CARD_HERO_ABILITIES_BACK_TPL({hero: hero})
            ]);

            hero.abilities.forEach(function (ability) {
                csv_writer.writeRecord([
                    CARD_HERO_ABILITY_FRONT_TPL({hero: hero, ability: ability}),
                    CARD_HERO_ABILITY_BACK_TPL({hero: hero, ability: ability})
                ]);
            });
        });

        // console.log(data);
    }).done();
}).done();
