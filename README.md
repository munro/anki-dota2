# Dota2 Anki Deck

This deck was created to help new and seasoned played remember all the heroes, abilities, and items.

## How to use this deck

First install [Anki](http://ankisrs.net/), a [spaced repetition](http://en.wikipedia.org/wiki/Spaced_repetition) flash card software.

Then import this deck from the Ankiweb page:

[https://ankiweb.net/shared/info/1019972773](https://ankiweb.net/shared/info/1019972773) (does not exist anymore)

## Hero & Ability Cards

### Hero icon &rarr; Hero name

<table class="noteprev">
<tbody><tr>
<td><b>Front</b></td>
<td width="100%%">Who is this hero? <img src="example/Earthshaker.png" /></td>
</tr>
<tr>
<td><b>Back</b></td>
<td width="100%%"><b>Earthshaker</b></td>
</tr>
</tbody></table>

### Ability Name &amp; Icon &rarr; How the ability works

<table class="noteprev">
<tbody><tr>
<td><b>Front</b></td>
<td width="100%%">[Video] How does the ability <img src="example/Earthshaker_ability_1.png" /> <b>Fissure</b> from <b>Earthshaker <img src="example/Earthshaker.png" /></b> work?</tr>
<tr>
<td><b>Back</b></td>
<td width="100%%"><a href="http://www.youtube.com/watch?v=vTbNwc5Tqwc" alt="Video of Fissure from Earthshaker"><img src="http://img.youtube.com/vi/vTbNwc5Tqwc/mqdefault.jpg" /><br>Click to watch video</a><br><p>Slams the ground with a mighty totem, fissuring the earth while stunning and damaging enemy units in a line.  Creates an impassable ridge of stone.</p><br /><table><tbody><tr valign="top" align="left"><td width="50%"><b>Mana Cost:</b> 125/140/155/170<br /><b>Cooldown:</b> 15<br /></td><td><b>ABILITY:</b> Unit Target, Point Target<br /><b>AFFECTS:</b> Enemy Units<br /><b>DAMAGE:</b> Magical<br /><b>DAMAGE:</b> 125 / 175 / 225 / 275<br /><b>FISSURE DURATION:</b> 8<br /><b>STUN DURATION:</b> 1 / 1.25 / 1.5 / 1.75<br /></td></tr></tbody></table></td>
</tr>
</tbody></table>

### Hero &rarr; Ability names &amp; icons

<table class="noteprev">
<tbody><tr>
<td><b>Front</b></td>
<td width="100%%">What are the abilities of <b>Earthshaker <img src="example/Earthshaker.png" /></b>?</tr>
<tr>
<td><b>Back</b></td>
<td width="100%%"><img src="example/Earthshaker_ability_1.png" /> <b>Fissure</b><br /><br /><img src="example/Earthshaker_ability_2.png" /> <b>Enchant Totem</b><br /><br /><img src="example/Earthshaker_ability_3.png" /> <b>Aftershock</b><br /><br /><img src="example/Earthshaker_ability_4.png" /> <b>Echo Slam</b><br /><br /></td>
</tr>
</tbody></table>

## Item Cards

### Item icon &rarr; Item name &amp; how it works

<table class="noteprev">
<tbody><tr>
<td><b>Front</b></td>
<td width="100%%">What is this item? <img src="example/hyperstone_lg.png" /></tr>
<tr>
<td><b>Back</b></td>
<td width="100%%">Gold: 6000<br /><br /><i>Doesn't stack with other sources of Evasion.</i><br />+ <span class="attribVal">30</span> <span class="attribValText">Agility</span><br /><br />+ <span class="attribVal">30</span> <span class="attribValText">Damage</span><br /><br />+ <span class="attribVal">35%</span> <span class="attribValText">Evasion</span><br /><br />+ <span class="attribVal">30</span> <span class="attribValText">Attack Speed</span></td></tr></tbody></table></td>
</tr>
</tbody></table>

## Item Composition

This deck is useful for understanding what your opponent is building.  But in reality, you just wanna be pro at the [Shop Keeper Quiz](http://www.dota2.com/quiz).

### Item name &amp; icon &rarr; Item composition

<table class="noteprev">
<tbody><tr>
<td><b>Front</b></td>
<td width="100%%">What are the components of <b>Black King Bar <img src="example/black_king_bar_lg.png" /></b>?</tr>
<tr>
<td><b>Back</b></td>
<td width="100%%"><img src="example/ogre_axe_lg.png" /> <b>Ogre Club</b> 3975 gold<br /><br /><img src="example/mithril_hammer_lg.png" /> <b>Mithril Hammer</b> 3975 gold<br /><br /><b>+ 1375 gold recipe</b></td></tr></tbody></table></td>
</tr>
</tbody></table>

## Future Cards

For a brainstorm of future cards to add goto [TODO.md](TODO.md)

## Build the Deck

To build the deck you must have [Node.js](http://nodejs.org/) and [youtube-dl](http://rg3.github.io/youtube-dl/).

First download or clone the repo in e.g. `anki-dota2`.

If you're using Mac &amp; have the [Homebrew package manager](http://brew.sh/), run:

```
brew install nodejs youtube-dl
```

Alternatively, on Windows you can download installers from links above and copy `youtube-dl.exe`
to the `anki-dota2` directory.

Then go the cloned repo folder `anki-dota2` and create a `media` directory.

Then run:

```javascript
npm install
node scrape.js
```

Import `anki_dota2_heroes_deck.csv`, `anki_dota2_item_components_deck.csv` and `anki_dota2_items_deck.csv` in [Anki](http://ankisrs.net/). Copy the content of the `anki-dota2/media` directory in the Anki `media` directory (e.g. `C:\Users\<user>\AppData\Roaming\Anki2\User 1\collection.media`).
