# Plug.bot #

A collection of extensions to the growing online DJing website, <a href="plug.dj">plug.dj</a>.  The source code is written in JavaScript utilising the Plug.dj API anywhere possible.  Easily embeddable as a bookmark in your favourite browser.  Initially inspired by TechGuard's AutoWoot script from back in April '12.  



### Features List ###

+ Auto-woot  :  Automatically WOOT! each song as it is played
+ Auto-queue/auto-DJ  :  Automatically re-append yourself to the DJ Waitlist once you've been moved back to the crowd
+ User list  :  A dynamic list of every user in the room, colour-coded based on their current vote.  Green = Woot, Red = Meh, White = No vote  Special usergroups are denoted by the icon you'd normally see in the chat
+ Button UI  :  Allows you to easily configure your Plug.bot experience;  enable or disable each of its features at the click of a button.  Red = Off, Green = On
+ Hide video  :  Allows you to hide videos from your view
+ Custom username FX  :  Now allows you to change some user's names in the chatbox to a different colour
+ Open-source code  :  All Plug.bot code is available in this repo, no cost, no secrecy



### Installation ###

<table style="border: none;">

  <tbody>
  
    <tr style="border:none;">
	
      <td style="vertical-align: middle; padding-top: 10px; border: none;">
	  
        <a href="javascript:(function(){ window.open('http://www.test.com/'); })();">test</a>
		
      </td>
	  
      <td style="vertical-align: middle; text-align: left; border: none;">
	  
        ← Drag this to your bookmark bar.
		
      </td>
	  
    </tr>
	
  </tbody>
  
</table>


### Author ###

+ <strong>Conner Davis &lt;connergdavis@gmail.com&gt;</strong> <em>a.k.a. Logic</em>



### Copyright Notice ###

Plug.bot is licensed under the GNU General Public License, or GPL.  Essentially, all I require of you if you want to redistribute Plug.bot's source code, is that you retain the three first comments in the files composing Plug.bot:  firstly, the GNU GPL statement.  Secondly, the statement I make myself about usage.  And thirdly, the author and purposes comment that show who originally made the content -- me.  So long as you abide by that rule and provide a link back to this repository, you are free to redistribute it as you want!  Thanks for playing fair ^.^



### Problems? Bugs? Questions about life? ###

connergdavis@gmail.com

Try to keep the subject relevant, please.  



### Version History ###

<strong>0.1a // Released 6/6/2012</strong>:
<ol>
<li>Autowoot introduced</li>
<li>Basic HTML UI</li>
<li>Auto-queue WIP</li>
</ol>



<strong>0.2a // Released 29/6/2012</strong>:
<ol>
<li>Sebastian welcomes users as they join the room</li>
<li>Introduced Woot/Meh Ratios List</li>
</ol>



<strong>0.3a // Released 6/7/2012</strong>:
<ol>
<li>Woot/Meh Ratios nerfed, replaced with Userlist that properly updates and doesn't have ANY problems</li>
<li>Clean UI with pictures instead of HTML text</li>
<li>Boris replaces Sebastian for welcome messages</li>
</ol>



<strong>0.33a // Released 12/7/2012</strong>:
<ol>
<li>Userlist now recognises moderators and changes some styles for them.  First off, they are enbolden.  They also have the star next to their name, coloured to their vote.</li>
<li>Patched a problem with moderators being the current DJ and the star being white.</li>
<li>Patched the userlist still populating even when disabled.  Thanks for the heads-up.</li>
</ol>



<strong>0.4a // Released 19/7/2012</strong>:
<ol>
<li>Userlist has been re-styled!  It now looks much sleeker</li>
<li>Above the userlist is your current spot in the DJ waitlist, if you are in it.  This should make it easier to check instead of having to click the button and look for yourself</li>
<li>Removed external CSS dependency, fixes a lot of consistency problems</li>
<li>Boris now welcomes users while using the /me command to make it more obvious.</li>
</ol>



<strong>0.5a // Released 01/8/2012</strong>:
<ol>
<li>Userlist font is smaller due to more users being in rooms.</li>
<li>Hide video now lasts until you disable it, rather than resetting each time a new song comes around</li>
<li>Moved the UI to be beside the chat for more space for buttons</li>
<li>Buttons are now HTML-generated instead of pictures</li>
<li>Custom username FX now allows you to highlight specific people with custom colours</li>
</ol>



<strong>1.0 // Released 23/11/2012</strong>:
<ol>
<li>Support's Plug.dj's newest release, Pepper!  Mostly rank changes</li>
<li>Revamped userlist code, should be faster and 100% stable at this point.</li>
<li>Userlist now allows you to @mention users by clicking their name.. can @mention multiple users as well</li>
<li>The official release of Plug.bot; it is now "stable"!  Whatever that means!  More updates soon, everyone, thanks for sticking around :)  OVER 1,000 users strong!</li>
</ol>
