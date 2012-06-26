/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * TERMS OF REPRODUCTION USE
 *
 * 1. Provide a link back to the original repository (this repository), as
 * 		in, https://github.com/ConnerGDavis/Plugbot, that is well-visible
 * 		wherever the source is being reproduced.  For example, should you 
 * 		display it on a website, you should provide a link above/below that
 *		which the users use, titled something such as "ORIGINAL AUTHOR".  
 *
 * 2. Retain these three comments:  the GNU GPL license statement, this comment,
 * 		and that below it, that details the author and purpose.
 *
 * Thanks for playing fair!  You'll fare better than WOLVES, that's for sure.
 */
 
/**
 * NOTE:  I use a Java-esque style of comments.  I don't use any docs.  
 * I just do it because it makes it easier for me to read.
 * 
 * @author Conner Davis ([VIP] ♫Łŏġïç®)
 * @version 0.2.0a
 */


/**
 * The core is an unintuitive representation of all the "core" features of
 * plug.bot: those that make plug.bot work.  It also includes the primary 
 * entry point which then calls all of the core functionality.
 */
function Core()
{
	
	/**
	 * Whether or not the Auto-WOOT! functionality is
	 * enabled.
	 */
	this.autowootEnabled = true;
	/**
	 * Whether or not to enable the auto-queueing functionality.
	 */
	this.autoqueueEnabled = true;
	
}

Core.prototype.IsAutowootEnabled = function() { return this.autowootEnabled; }
Core.prototype.IsAutoqueueEnabled = function() { return this.autoqueueEnabled; }
Core.prototype.SetAutowootEnabled = function() { this.autowootEnabled = !this.autowootEnabled; }
Core.prototype.SetAutoqueueEnabled = function() { this.autoqueueEnabled = !this.autoqueueEnabled; }

/**
 * Bind relevant plug.dj API listeners.
 */
Core.prototype.BindListeners = function()
{
	/*
	 * Listen for whenever the DJ is changed (the last DJ's song ended)
	 * so we can cycle.
	 */
	API.addEventListener(API.DJ_ADVANCE, NewDjCallback);
}

/**
 * Hit the auto-queue and auto-woot buttons upon startup.
 */
Core.prototype.PushInitButtons = function()
{
	$("#button-vote-positive").click();
	$("#button-dj-waitlist-join").click();
}

/**
 * Respond to the API's DJ_ADVANCE listener call by 
 * doing anything that should be done whenever there's
 * a new DJ playing.
 */
function NewDjCallback() 
{
	if (c.IsAutowootEnabled()) 
	{
		$("#button-vote-positive").click();
		
		console.log("NEW DJ CALLBACK: Autowoot -- COMPLETED");
	}
	
	if (c.IsAutoqueueEnabled() && ($("#button-dj-waitlist-join").css("display") === "block")) 
	{
		$("#button-dj-waitlist-join").click();
		
		console.log("NEW DJ CALLBACK: Autoqueue -- COMPLETED");
	}
}


/**
 * Boris Yeltsin is the famous EDM Basement bot created by
 * UnearthedTRU7H that is provided some extra functionality
 * by Plug.bot.
 */
function Boris()
{

	/**
	 * As Boris welcomes new users, we stash them into an
	 * array for all users we already know were here before.
	 * We do this so we can say "Welcome back" versus "Welcome"
	 * to those users.
	 */	
	var knownUsers = new Array();
	
	/**
	 * Various random messages that Boris can send to Sebastian.
	 */
	var randomMessages = new Array(
		"How are you doing today, Sebastian?",
		"I am good as well.  Logic is sexy."
	);
	
}

Boris.prototype.GetKnownUsers = function() { return this.knownUsers; }

/**
 * Initialise all of Sebastian's functionality.
 */
Boris.prototype.Init = function()
{
	/*
	 * Welcome all new users to the room.
	 */
	API.addEventListener(API.USER_JOIN, BorisWelcomeCallback);
	
	/*
	 * Start the random message timer.  Since Boris is the one
	 * that initiates all the conversations between himself and
	 * Sebastian, he has to start it.
	 */
	window.setInterval(function() {
		API.sendChat("@Sebastian " + (this.randomMessages[Math.floor(Math.random() * randomMessages.length)]));
	}, (1000 * 60 * 60) * (Math.floor(Math.random() * 24)));
}

/**
 * We'll call this method whenever a user joins, so Boris
 * can welcome them!
 * 
 * @param user
 * 				The user that just joined.
 */
function BorisWelcomeCallback(user)
{
	console.log('Boris should welcome ' + user.username);
	
	API.sendChat("Welcome " + ($.inArray(user, b.GetKnownUsers()) ? "back" : "") + 
		" to " + $("#current-room-value").text() + ", " + user.username + "!");
}

///////////////////////////////////////////////////////////////////////////////

/*
 * Let's add the CSS stylesheet so that's over with.
 */
var css = document.createElement("link");
	css.setAttribute('rel', 'stylesheet');
	css.setAttribute('type', 'text/css');
	css.setAttribute('id', 'plugbot-css');
	css.setAttribute('href', (API.getSelf().username == "[VIP][PLUG.BOT] Łŏģıč®") ? 'http://localhost/plugbot/plugbot.css' : 'null');
document.body.appendChild(css);

/*
 * Init the core.
 */
var c = new Core;
	c.BindListeners();
	c.PushInitButtons();
	
	
/*
 * Init Boris's functionality if we're Boris.
 */
if (API.getSelf().username == "BorisYeltsin[BOT]")
{
	var b = new Boris;
		b.Init();
	
	console.log('Boris Yeltsin bot functionality initialised.');
}
