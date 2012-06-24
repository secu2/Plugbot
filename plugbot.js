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
 
/*
 * Author: Conner Davis ([VIP] ♫Łŏġïç®)
 */

// Core features: enable them? true = yes
var enableAutoqueue = true;
var enableAutowoot = true;
var enableSidebar = true;


/*
 * Since the Google App Engine sucks, the Plug API encounters duplicate calls
 * when dealing with most listeners.  Because of this, Plug.bot would normally
 * print out each person's username twice, instead of once, in the sidebar.  
 * To deal with this, we save an object to memory that keeps the value of the
 * previous username, to compare against the next usernames coming, so that
 * if the duplicate call is detected, we can avoid it.
 */
var lastWoot;
var lastMeh;

/*
 * Since Sebastian tells us what song was recently played, we have to save it
 * in memory until the next update so we can print it out when the song is
 * completed.
 */
var lastPlayed;

/*
 * Single Google App Engine is shit, we have to register the last user to
 * join, too.
 */
var lastUserJoin;

/*
 * Count of woots/mehs so we can print that as well as the percentage.
 */
var woots = new Array();
var mehs  = new Array();


// When acted on with invertButton(), we need to know the type of button we're dealing with, this defines them
var ButtonType = {
	'Autowoot' : 0,
	'Autoqueue' : 1,
	'Sidebar' : 2
};


// All of the bots, superusers, and myself, that have special permissions (extra stuff, or testing)

 
/*
 * Display the "GUI", or "Graphical User Interface",
 * that end-users will use in order to access the 
 * functionality of Plug.bot.
 */
function renderUI() {
	/* 
	 * Generate the Plug.bot settings GUI.
	 */
	$(document).ready(function() {
		if ($("#plugbot-gui").length) {
			/*
			 * If the UI was already there, we need to remove the previous
			 * version so the user can have a fresh, new version loaded.
			 * 
			 * They tend to stack if you don't do this.  Just ask UnearthedTRU7H!
			 */
			$("#plugbot-gui").remove();
		}
			
		/*
		 * We need to add a custom rule here to the normal Plug.dj UI
		 * because if we don't, then our buttons aren't clickable.  It's due
		 * to x-indexing being popular on Plug.dj's UI, and we have to make them
		 * all just right.
		 */
		$("#playback").css("z-index", "49");
		
		/*
		 * Now, create the Plug.bot UI div container and add all the buttons to it.
		 */
		$("#playback-container").after('<div id="plugbot-gui"></div>');
		$("#plugbot-gui").
			prepend('<br /><span id="autowoot-btn" style="margin-left:0">AUTOWOOT</span>').
			append('<span id="autoqueue-btn">AUTOQUEUE</span>').
			append('<span id="sidebar-btn">SIDEBAR</span>').
			append('<br /><br /><a id="plugbot-learnmore" href="https://github.com/ConnerGDavis/Plugbot" target="_blank">learn more about plug.bot</a>');
		
		if (enableSidebar) {
			/*
			 * Since the sidebar is enabled, we also need to render that
			 * portion of the UI as well.
			 */
			if ($("#plugbot-sidebar").length) {
				/*
				 * Again, make sure that it hasn't already been render, and if it 
				 * has, then we need to remove the old version so it can be fresh.
				 */
				$("#plugbot-sidebar").remove();
			}
				
			/*
			 * Add this portion of the UI to the body tag, since we're positioning
			 * it absolutely and nesting it anywhere else is illogical.
			 */
			$("body").prepend('<div id="plugbot-sidebar"></div>');
			$("#plugbot-sidebar").prepend('<div id="plugbot-woots"><h3 id="plugbot-woots-count"></h3></div>').append('<div id="plugbot-mehs"><h3 id="plugbot-mehs-count"></h3></div>');
		}
	});
	
}


/*
 * Initialise the core listeners.  These listeners
 * are the key functionality of Plug.bot, and allow 
 * us to execute code when a certain event occurs.
 */
function initListeners() {
	/*
	 * Listen for whenever the user clicks the auto-woot
	 * button of the UI. 
	 */
	$("#autowoot-btn").on("click", function() {
		invertButton(ButtonType.Autowoot);
	});
	
	/*
	 * Listen for whenever the user clicks the auto-queue
	 * button of the UI. 
	 */
	$("#autoqueue-btn").on("click", function() {
		invertButton(ButtonType.Autoqueue);
	});
	
	/*
	 * Listen for when the user clicks the sidebar 
	 * button of the UI.
	 */
	$("#sidebar-btn").on("click", function() {
		invertButton(ButtonType.Sidebar);
	})
	
	/*
	 * This listener provides us the ability to state a custom
	 * callback whenever a DJ advances.
	 */
	API.addEventListener(API.DJ_ADVANCE, function(obj) {
		/*
		 * If auto-queueing is enabled, click the DJ waitlist
		 * join button.
		 */
		if (enableAutoqueue) {
			document.getElementById('button-dj-waitlist-join').click();
		}
			
		/*
		 * If auto-woot is enabled, click the vote-woot button.
		 */
		if (enableAutowoot) {
			document.getElementById('button-vote-positive').click();
		}
			
		/*
		 * If the sidebar is enabled, empty the woot and meh sidebar
		 * count.
		 */
		if (enableSidebar) {
			$("#plugbot-woots, #plugbot-mehs").empty();
			
			/*
			 * Reset the woot and meh counters.
			 */
			woots.length = 0;
			mehs.length = 0;
			
			/*
			 * Now, re-append the woot/meh counters and percentages.
			 */
			$('#plugbot-woots').append('<h3 id="plugbot-woots-count"></h3>');
			$('#plugbot-mehs').append('<h3 id="plugbot-mehs-count"></h3>');
		}
		
		/*
		 * Let's make Boris hit on Sebastian
		 */
		if (isBoris()) {
			API.sendChat("@Sebastian[BOT] Hey babe ;)");
		}
	});
	
	if (enableSidebar) {
		/*
	 	 * If the user wants the woot/meh count on the sidebar, 
	 	 * then we need to initialise the VOTE_UPDATE listener so 
	 	 * whenever someone in the room WOOT!s or MEHs a track,
	 	 * we can add their name to the list of WOOT!s or MEHs, 
	 	 * respectively.
	 	 */
		API.addEventListener(API.VOTE_UPDATE, sidebarCallback);
		
		API.addEventListener(API.USER_JOIN, function(user) {
			if (isSebastian()) {
				/*
	 	 		 * Sebastian bot needs to know when users join so we can
	 	 		 * greet them to the room.
	 	 		 */
	 			if (user.username != lastUserJoin) {
					API.sendChat("Welcome back to " + $("#current-room-value").text() + ", " + user.username + "!");
					lastUserJoin = user.username;
				}
			}
	 		
	 		/*
	 		 * Otherwise, they still need to be aware of when
	 		 * someone joins, so we can update the sidebar
	 		 * counters.
	 		 */
	 		updateCounters();
		});
	}
	
	if (isSebastian()) {
		API.addEventListener(API.USER_LEAVE, function(user) {
			API.sendChat("We'll see you later, " + user.username + "! :(");
		});
	}
}


/*
 * Callback method that handles a VOTE_UPDATE listener
 * telling us a user just voted Woot or Meh, so in the
 * case that the user has the sidebar enabled, we need
 * to update it.
 * 
 * @param obj
 * 				The status code of the vote
 */
function sidebarCallback(obj) {
	switch (obj.vote) {
		case 1: // WOOT!
			if (lastWoot != obj.user.username) {
				/*
				 * Avoid the duplicate call.
				 */
				$("#plugbot-woots").append('<span>' + obj.user.username + '</span><br />');
				
				/*
				 * Set their username as the most recent woot.
				 */
				lastWoot = obj.user.username;
				
				/*
				 * Increase the number of woots, then update the
				 * percentage and count out of total users for woots.
				 */
				wootCount++;
				updateCounters();
			}
			break;
		case -1: // Meh
			if (lastMeh != obj.user.username) {
				$("#plugbot-mehs").append('<span>' + obj.user.username + '</span><br />');
			
				lastMeh = obj.user.username;
				
				mehCount++;
				updateCounters();
			}
			break;
	}
}


/*
 * By 'inverting', we switch the colour of the text
 * to its opposite (green = active, red = inactive)
 * and invert the variable's value to whatever it wasn't.
 */
function invertButton(t) {
	switch (t) 
	{
		case ButtonType.Autowoot: // WOOT!
			enableAutowoot = !enableAutowoot;
			
			$("#autowoot-btn").css("color", "#" + (enableAutowoot ? "3FFF00" : "ED1C24"));
			/*
			 * If they are enabling auto-woot, hit the woot button for them.
			 */
			if (enableAutowoot) {
				$("#button-vote-positive").click();
			}
			break;
		case ButtonType.Autoqueue: // Meh
			enableAutoqueue = !enableAutoqueue;
			
			$("#autoqueue-btn").css("color", "#" + (enableAutoqueue ? "3FFF00" : "ED1C24"));
			if (enableAutoqueue) {
				/*
			 	 * If they are enabling auto-queue, join the waitlist for them.
			 	 */
				$("#button-dj-waitlist-join").click();
			} else {
				/*
				 * If not, hit the leave button.
				 */
				$("#button-dj-waitlist-leave").click();
			}
			break;
		case ButtonType.Sidebar:
			enableSidebar = !enableSidebar;
			
			$("#sidebar-btn").css("color", "#" + (enableSidebar ? "3FFF00" : "ED1C24"));
			if (enableSidebar) {
				/*
				 * They enabled the sidebar, so make it visible again.
				 */
				$("#plugbot-sidebar").css("opacity", "0.9100000262260437");
			} else {
				/*
				 * They disabled the sidebar, so make it invisible.
				 */
				$("#plugbot-sidebar").css("opacity", "0.0");
			}
			break;
	}
}


/*
 * Update the sidebar counters (#/total).
 */
function updateCounters() {
	var innerfix = '/' + API.getUsers().length + '&nbsp;&nbsp;';
	$('#plugbot-mehs-count').html(mehCount + innerfix + calcPercentage("meh"));
	$('#plugbot-woots-count').html(wootCount + innerfix + calcPercentage("woot"));
}


/*
 * Calculate the percentage (100 / total users * woot/meh count)
 * of people who are wooting or mehing.
 * 
 * @param type
 * 				May be woot or meh.  String type. 
 */ 
function calcPercentage(type) {
	try {
		if (type == "woot") 
			return (((100 / API.getUsers().length) * wootCount) + "").substring(0, 4) + "%";
		else if (type == "meh") 
			return (((100 / API.getUsers().length) * mehCount) + "").substring(0, 4) + "%";
		else
			throw "InvalidType";
	} catch (ex) {
		if (ex == "InvalidType") 
			alert("Could not calculate woot or meh percentage; the type passed to calcPercentage() was invalid!");
	}
}


/*
 * Determine if the current user is Sebastian!
 */
function isSebastian() {
	return API.getSelf().username == "Sebastian[BOT]";
}

/*
 * Determine if the current user is Boris!
 */
function isBoris() {
	return API.getSelf().username == "Boris[BOT]";
}

// INITIALISATION

/*
 * Thank our honest users from Dubstep Den.
 */
if ($('#current-room-value:contains("Dubstep Den")').length) {
	alert("Thank you for using Plug.bot and not WOLVES' stolen code of mine.  If you see Xhila autowoot anywhere, tell those using it to use this instead -- this is the better version, not the one I wrote a month ago that he stole!");
}

/*
 * 'Render' the UI by generating all the HTML structure for the UI.
 * This is where our CSS stylesheet comes in handy.
 */
renderUI();

/*
 * Initialise all the Plug.dj API listener functions that give us
 * the ability to intercept an event and provide a callback function
 * to handle it.
 */
initListeners();

/*
 * Click each of the woot and waitlist buttons.
 */
document.getElementById('button-vote-positive').click();
document.getElementById('button-dj-waitlist-join').click();

/*
 * If we're Sebastian, we will randomly send a message to the
 * room and remind them to view the rules.
 */
if (isSebastian()) {
	setTimeout(function() {
		API.sendChat("Please remember to view the EDM Basement rules! http://bit.ly/O3ENRa");
	}, (1000 * 60 * 30));
}
