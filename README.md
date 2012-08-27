# Plug.bot #

A collection of extensions to the growing online DJing website, <a href="plug.dj">plug.dj</a>.  The source code is written in JavaScript utilising the Plug.dj API anywhere possible.  Easily embeddable as a bookmark in your favourite browser.  Initially inspired by TechGuard's AutoWoot script from back in April '12.  



### Features List ###

+ Auto-woot  :  Automatically WOOT! each song as it is played
+ Auto-queueing  :  Automatically re-append yourself to the DJ Waitlist once you've been moved back to the crowd
+ User list  :  A dynamic list of every user in the room, colour-coded based on their current vote.  Green = Woot, Red = Meh, White = No vote  Special usergroups are denoted by the icon you'd normally see in the chat
+ Button UI  :  Allows you to easily configure your Plug.bot experience;  enable or disable each of its features at the click of a button.  Red = Off, Green = On
+ Hide video  :  Allows you to hide videos from your view
+ Custom username FX *NEW*  :  Now allows you to change some user's names in the chatbox to a different colour
+ Open-source code  :  All Plug.bot code is available in this repo, no cost, no secrecy



### Installation ###

If you get stuck or just can't be bothered to use your brain (I know that feel), do yourself a favour and watch <a href="http://youtu.be/Xr93msMOQ-E">EXƎ's awesome sauce video</a>.

<b>Create a new bookmark in your favourite browser and copy/paste this to the 'URL/Location' of the bookmark (<i>or even better just select all the text and drag it there</i>)</b>

	javascript: (function () { var jsCode = document.createElement('script'); jsCode.setAttribute('id', 'plugbot-js'); jsCode.setAttribute('src', 'https://raw.github.com/connergdavis/Plugbot/master/plugbot.js'); document.body.appendChild(jsCode); }());

Alternatively, you can go<a href="http://pastebin.com/x8Xak4zU"> to this site </a>and copy the code you see into a new bookmark.  Just Copy and Paste the code into the URL/Location of your bookmark.



### Authors ###

+ <strong>Conner Davis &lt;connergdavis@gmail.com&gt;</strong> <em>a.k.a. [VIP] Logic</em>
+ <strong>Harrison Schneidman &lt;hschneidman@gmail.com&gt;</strong> <em>a.k.a. EXƎ</em>



### Copyright Notice ###

Plug.bot is licensed under the GNU General Public License, or GPL.  Essentially, all I require of you if you want to redistribute Plug.bot's source code, is that you retain the three first comments in the files composing Plug.bot:  firstly, the GNU GPL statement.  Secondly, the statement I make myself about usage.  And thirdly, the author and purposes comment that show who originally made the content -- me.  So long as you abide by that rule and provide a link back to this repository, you are free to redistribute it as you want!  Thanks for playing fair ^.^



### Privacy Notice (it's not bad!) ###

Since I feel like you should definitely know about this regardless of how insignificant it is, here goes.  I'm currently logging those who use Plug.bot's Plug.dj usernames to a database.  Why? 
So I know who's using Plug.bot.  In the vicinity of JavaScript bookmarklets, there isn't much room for using an HTML traffic monitoring injector thingymajig, and this felt to be the simplest way
to do it.  

So, here's what you should know:  if you are concerned about this, <strong>don't be</strong>.  Frankly, this is doing what any user on Plug.dj could do, and it's not harmful to you in any way. 
Literally, the only thing that it keeps is your username, and the only purpose I have for it is to see who's using Plug.bot.  If you want to see the PHP code that does this, you can see it 
<a href="http://pastebin.com/79sBxYSR">here</a>.  The script is completely the same as it is hosted aside from my chopping out the MySQL database details for obvious reasons.  

So yeah, don't be worried, it's simply for (vanity?) reference purposes and so I have an idea of how my user base looks.  If there's more of you, I'll be more inclined to push new updates :D



### Problems? Bugs? Questions about life? ###

connergdavis@gmail.com

Try to keep the subject relevant, please.  



### Version History ###

<strong>0.1a (Released 6/6/2012)</strong>:
<ol>
<li>Autowoot introduced</li>
<li>Basic HTML UI</li>
<li>Auto-queue WIP</li>
</ol>



<strong>0.2a (Released 29/6/2012)</strong>:
<ol>
<li>Sebastian welcomes users as they join the room</li>
<li>Introduced Woot/Meh Ratios List</li>
</ol>



<strong>0.3a (Released 6/7/2012)</strong>:
<ol>
<li>Woot/Meh Ratios nerfed, replaced with Userlist that properly updates and doesn't have ANY problems</li>
<li>Clean UI with pictures instead of HTML text</li>
<li>Boris replaces Sebastian for welcome messages</li>
</ol>



<strong>0.33a (Released 12/7/2012)</strong>:
<ol>
<li>Userlist now recognises moderators and changes some styles for them.  First off, they are enbolden.  They also have the star next to their name, coloured to their vote.</li>
<li>Patched a problem with moderators being the current DJ and the star being white.</li>
<li>Patched the userlist still populating even when disabled.  Thanks for the heads-up.</li>
</ol>



<strong>0.4a (Released 19/7/2012)</strong>:
<ol>
<li>Userlist has been re-styled!  It now looks much sleeker</li>
<li>Above the userlist is your current spot in the DJ waitlist, if you are in it.  This should make it easier to check instead of having to click the button and look for yourself</li>
<li>Removed external CSS dependency, fixes a lot of consistency problems</li>
<li>Boris now welcomes users while using the /me command to make it more obvious.</li>
</ol>



<strong>0.5a (Released 01/8/2012)</strong>:
<ol>
<li>Userlist font is smaller due to more users being in rooms.</li>
<li>Hide video now lasts until you disable it, rather than resetting each time a new song comes around</li>
<li>Moved the UI to be beside the chat for more space for buttons</li>
<li>Buttons are now HTML-generated instead of pictures</li>
<li>Custom username FX now allows you to highlight specific people with custom colours</li>
</ol>
