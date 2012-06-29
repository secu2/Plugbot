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
 * NOTE:  This is all procedural as hell because prototypes and any 
 * 			OOP techniques in Javascript are stupid and confusing.
 * 
 * @author Conner Davis ([VIP] ♫Łŏġïç®)
 * @version 0.2.0a
 */

// Triggers
var autowoot = true;
var autoqueue = true;
var counters = true;
var hideVideo = false;

var showingWoots = true;
var showingMehs = true;
var showingUndecided = true;

var woots = new Array();
var mehs = new Array();

var ROOT_DIR = "http://wlsandd.net78.net/plugbot/";

// Last played info
var lastPlayed = null;

// API listeners
function initAPIListeners() 
{
	API.addEventListener(API.DJ_ADVANCE, djAdvanced);
	if (isBoris())
	{
		console.log('Activated Boris');
		
		API.addEventListener(API.USER_JOIN, function(user) {
			API.sendChat("Welcome to " + $("#current-room-value").text() + ", " + user.username + "!");
		});
	}
	
	API.addEventListener(API.VOTE_UPDATE, voteIntercepted);
}

// Display UI
function displayUI()
{
	$('#plugbot-ui').remove();
	$('#playback').css('z-index', '8'); // hack to make the buttons usable
	
	$('#playback').append('<div id="plugbot-ui"></div>');
		$("#plugbot-ui").animate({"height": "64px"}, {duration: "slow" });
		$('#plugbot-ui').append(
			'<img src="' + ROOT_DIR + 'autohwheat_active.png" id="plugbot-btn-woot" alt="auto-hwheat!" />' +
			'<img src="' + ROOT_DIR + 'autoqueue_active.png" id="plugbot-btn-queue" alt="auto-queue!" />' + 
			'<img src="' + ROOT_DIR + 'hidevideo.png" id="plugbot-btn-hidevideo" alt="hide the video!" />' +
			'<img src="' + ROOT_DIR + 'counters_active.png" id="plugbot-btn-counters" alt="woot/meh counters!" />'
		);
}

// Display woot and meh counters
function displayCounters()
{
	$("#plugbot-counters").remove();
	
	$('body').append('<div id="plugbot-counters"><div id="woots"><span id="woots-activate">woots »</span><br /></div><div id="mehs"><span id="mehs-activate">mehs »</span><br /></div></div>');
}

// Some on-click listeners for the UI buttons
function initUIListeners()
{
	$("#plugbot-btn-woot").on("click", function() {
		autowoot = !autowoot;
		$(this).attr("src", ROOT_DIR + 'autohwheat' + (autowoot ? '_active' : '') + '.png');
		if (autowoot)
			$("#button-vote-positive").click();
		
		console.log('Auto-woot is now ' + (autowoot ? 'enabled' : 'disabled'));
	});
	
	$("#plugbot-btn-hidevideo").on("click", function() {
		hideVideo = !hideVideo;
		$(this).attr("src", ROOT_DIR + 'hidevideo' + (hideVideo ? '_active' : '') + '.png');
		if (hideVideo) {
			$("#yt-frame").animate({"height": "0px"}, {duration: "fast"});
		} else {
			$("#yt-frame").animate({"height": "271px"}, {duration: "fast"});
		}
	});
	
	$("#plugbot-btn-queue").on("click", function() {
		autoqueue = !autoqueue;
		$(this).attr("src", ROOT_DIR + 'autoqueue' + (autoqueue ? '_active' : '') + '.png');
		if (autoqueue)
			$("#button-dj-waitlist-join").click();
		else 
			$("#button-dj-waitlist-leave").click();
		
		console.log('Auto-queue is now ' + (autoqueue ? 'enabled' : 'disabled'));
	});
	
	$("#plugbot-btn-counters").on("click", function() {
		counters = !counters;
		$(this).attr("src", ROOT_DIR + 'counters' + (counters ? '_active' : '') + '.png');
		if (counters)
			$("#plugbot-counters").css("visibility", "visible");
		else
			$("#plugbot-counters").css("visibility", "hidden");
		
		console.log('Woot/Meh counters are now ' + (counters ? 'enabled' : 'disabled'));
	});

	$("#woots-activate").on("click", function() {
		showingWoots = !showingWoots;
		console.log('Showing woot list? ' + showingWoots);
		
		if (showingWoots && woots.length > 0) 
		{
			for (var i = 0; i < woots.length; i++) 
			{
				$("#woots").append("<p>" + woots[i] + "</p>");
			}
		}
		else 
		{
			$("#woots").find("*").not("#woots-activate").remove();
			$("#woots").append("<br />");
		}
	});
	
	$("#mehs-activate").on("click", function() {
		showingMehs = !showingMehs;
		console.log('Showing meh list? ' + showingMehs);
		
		if (showingMehs && mehs.length > 0)
		{
			for (var i = 0; i < mehs.length; i++)
			{ 
				$("#mehs").append("<p>" + mehs[i] + "</p>");	
			}
		}
		else
		{
			$("#mehs").find("*").not("#mehs-activate").remove();
			$("#mehs").append("<br />");
		}
	});
}

// Call back when there's a new Dj
function djAdvanced(obj) 
{
	$("#button-vote-positive").click();
	
	if ($("#button-dj-waitlist-join").css("display") === "block")
		$("#button-dj-waitlist-join").click();
	
	$("#yt-frame").css("height", "271px");
	$("#plugbot-btn-hidevideo").attr("src", ROOT_DIR + 'hidevideo.png');
	
	resetCounters();
}

// Call back when a vote is intercepted
function voteIntercepted(obj)
{
	var vote = obj.vote;
	switch (vote) 
	{ 
		case 1: // Woot
			if (woots[woots.length - 1] != obj.user.username) 
			{
				if ($.inArray(obj.user.username, mehs) != -1) 
				{
					mehs = jQuery.grep(mehs, function(value) {
						return value != obj.user.username;
					});
					$("#mehs p").remove(":contains('" + obj.user.username + "')");
				}
				woots.push(obj.user.username);
				$("#woots").append("<p>" + obj.user.username + "</p>");
				console.log('Woot appended: ' + obj.user.username);
			}
			break;
		default: // Meh	
			if (mehs[mehs.length - 1] != obj.user.username) 
			{
				if ($.inArray(obj.user.username, woots) != -1) 
				{
					woots = jQuery.grep(woots, function(value) {
						return value != obj.user.username;
					});
					$("#woots p").remove(":contains('" + obj.user.username + "')");
				}
				mehs.push(obj.user.username);
				$("#mehs").append("<p>" + obj.user.username + "</p>");
				console.log('Meh appended: ' + obj.user.username);
			}
			break;
	}
}

// Reset all woot/meh counters
function resetCounters() 
{
	woots.length = 0;
	$("#woots").find("*").not("#woots-activate").remove();
	
	mehs.length = 0;
	$("#mehs").find("*").not("#mehs-activate").remove();
}

function isSebastian() { return API.getSelf().username == "Sebastian[BOT]"; }
function isBoris() { return API.getSelf().username == "BorisYeltsin[BOT]"; }


// On init

alert("PLUG.BOT HAS UPDATED!  Please visit https://github.com/ConnerGDavis/Plugbot to change your bookmark!  Last change, I promise!!");

$('head').prepend('<link href="' + ROOT_DIR + 'plugbot.css" rel="stylesheet" type="text/css" />');

$("#button-vote-positive").click();
$("#button-dj-waitlist-join").click();

displayUI();
displayCounters();
initUIListeners();
initAPIListeners();
