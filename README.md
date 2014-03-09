# Dota2 Anki Deck

This deck was created to help new and seasons played remember all the heroes, and their abilities.

## How to use this deck

First install [Anki](http://ankisrs.net/), a [spaced repetition](http://en.wikipedia.org/wiki/Spaced_repetition) flash card software.

Then import this deck from the Ankiweb page:

[https://ankiweb.net/shared/info/1901179648](https://ankiweb.net/shared/info/1901179648)

## Cards Types

Here are the types of cards you will find in this deck:

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

### Ability Name &amp; Icon &rarr; How the ability works

<table class="noteprev">
<tbody><tr>
<td><b>Front</b></td>
<td width="100%%">[Video] How does the ability <img src="example/Earthshaker_ability_1.png" /> <b>Fissure</b> from <b>Earthshaker <img src="example/Earthshaker.png" /></b> work?</tr>
<tr>
<td><b>Back</b></td>
<td width="100%%"><a href="http://www.youtube.com/watch?v=vTbNwc5Tqwc" alt="Video of Fissure from Earthshaker"><img src="http://img.youtube.com/vi/vTbNwc5Tqwc/mqdefault.jpg" /><br>Click to watch video</a><br><p>Slams the ground with a mighty totem, fissuring the earth while stunning and damaging enemy units in a line.  Creates an impassable ridge of stone.</p><br /><table><tbody><tr valign="top" align="left"><td width="50%"><b>Mana Cost:</b> 125/140/155/170<br /><b>Cooldown:</b> 15<br /></td><td><b>ABILITY:</b> Unit Target, Point Target<br /><b>AFFECTS:</b> Enemy Units<br /><b>DAMAGE:</b> Magical<br /><b>DAMAGE:</b> 125 / 175 / 225 / 275<br /><b>FISSURE DURATION:</b> 8<br /><b>STUN DURATION:</b> 1 / 1.25 / 1.5 / 1.75<br /></td></tr></tbody></table></td>
</tr>
<tr>
<td><b>Tags</b></td>
<td width="100%%"></td>
</tr>
</tbody></table>

## Future Cards

For a brainstorm of future cards to add goto [TODO.md](TODO.md)

## Build the Deck

To build the deck you must have [Node.js v0.10.x](http://nodejs.org/) and [youtube-dl](http://rg3.github.io/youtube-dl/).  If you're using Mac &amp; have the [brew.sh](Homebrew package manager), run:

```
brew install nodejs youtube-dl
```

Then clone the repo and run:

```javascript
npm install
node scrape.js
```