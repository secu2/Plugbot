# Plug.bot #

A collection of tools and extended features for Plug.dj, a free live DJing service.  Inspired by TechGuard's Autowoot.  All code is written in Javascript, mostly based off of the Plug.dj API which can be seen here:  http://blog.plug.dj/p/api-documentation.html


### Features List ###

+ Auto-woot  :  Automatically WOOT! each song as it is played
+ Auto-queueing  :  Automatically re-append yourself to the DJ Waitlist whenever you play a song
+ User list *NEW!  :  Lists all of the users currently in the room, and highlights them white if they're undecided, green if they're wooting, and red if they're mehing
+ Button UI  :  Allows you to easily configure your Plug.bot experience;  enable or disable each of its features at the click of a button!
+ Hide video *NEW!  :  Lets you cover up the video player in case what's playing is NSFW or for any other reason you choose to hide it.  Resets every time a new song is played
+ Open-source code  :  All code of plugbot.js and plugbot.css are available in this repo, no cost, no secrecy


### Installation ###

<b> Select the following text and drag it to your bookmarks bar:</b>

	javascript: (function () { var jsCode = document.createElement('script'); jsCode.setAttribute('id', 'plugbot-js'); jsCode.setAttribute('src', 'https://raw.github.com/connergdavis/Plugbot/master/plugbot.js'); document.body.appendChild(jsCode); }());

Alternatively, you can go<a href="http://pastebin.com/x8Xak4zU"> to this site </a>and copy the code you see into a new bookmark.  Just Copy and Paste the code into the URL/Location of your bookmark.



### Authors ###

+ <strong>Conner Davis &lt;connergdavis@gmail.com&gt;</strong>
+ <strong>Harrison Schneidman &lt;hschneidman@gmail.com&gt;</strong>


### Copyright Notice ###

Plug.bot is licensed under the GNU General Public License, or GPL.  Essentially, all I require of you if you want to redistribute Plug.bot's source code, is that you retain the three first comments in the files composing Plug.bot:  firstly, the GNU GPL statement.  Secondly, the statement I make myself about usage.  And thirdly, the author and purposes comment that show who originally made the content -- me.  So long as you abide by that rule and provide a link back to this repository, you are free to redistribute it as you want!  Thanks for playing fair ^.^


### Problems? Bugs? Questions? ###

connergdavis@gmail.com

Try to keep the subject relevant, or else I won't see it and think it's related to Plug.bot.


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