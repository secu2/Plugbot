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
 */
 
/*
 * Author: Conner Davis (Logic®)
 * Purpose: Bookmarklet entry point
 */

// Enable autoqueue?
var autoqueue = true;

// Enable autowoot? (Default is true)
var autowoot = true;

// Enable the woot/meh ratio sidebar?
var enableSidebar = true;

 
/*
 * Display the "GUI", or "Graphical User Interface",
 * that end-users will use in order to access the functionality
 * of Plug.bot.
 */
function displayGUI() {
	/* 
	 * Generate the Plug.bot settings GUI.
	 */
	$(document).ready(function() {
		if ($("#plugbot-gui").length) 
			$("#plugbot-gui").remove();
		$("#playback").css("z-index", "49");
		$("#playback-container").after('<div id="plugbot-gui"></div>');
		
		$("#plugbot-gui").css("width", "494px").css("height", "48px").css("background-color", "#0A0A0A").css("opacity", "0.9100000262260437").css("border-top", "1px dotted #292929").css("-webkit-border-radius", "0 0 8px 8px").css("-moz-border-radius", "0 0 8px 8px").css("margin", "0 auto").css("z-index", "50").css("text-align", "center");
		
		$("#plugbot-gui").prepend('<br /><span id="autowoot-btn">AUTOWOOT</span>');
		$("#plugbot-gui").append('<span id="automeh-btn" style="color:#ED1C24">AUTOMEH</span>');
		$("#plugbot-gui").append('<span id="autoqueue-btn">AUTOQUEUE</span>');
		$("#plugbot-gui span").css("font", "bold 12px arial").css("text-align", "center").css("margin-left", "32px").css("color", "#3FFF00").css("cursor", "pointer");
		
		$("#autowoot-btn").css("margin-left", "0px");
		$("#automeh-btn").css("color", "#ED1C24");
	});
	$("#autowoot-btn").on('click', function() {
		autowoot = !autowoot;
		if (!autowoot) {
			$(this).css("color", "#ED1C24");
		} else {
			$(this).css("color", "#3FFF00");
			document.getElementById('button-vote-positive').click();
		}
	});
	$("#autoqueue-btn").on('click', function() {
		autoqueue = !autoqueue;
		if (!autoqueue) {
			$(this).css("color", "#ED1C24");
			document.getElementById('button-dj-waitlist-leave').click();
		} else {
			$(this).css("color", "#3FFF00");
			document.getElementById('button-dj-waitlist-join').click();
		}
	});
	$("#automeh-btn").on('click', function() {
		alert("You actually fucking thought I'd add this? The Game.");
	});
	
	// Watermark..
	$(document).ready(function() {
		if ($("#plugbot-watermark").length) 
			$("#plugbot-watermark").remove();
		$("body").prepend('<div id="plugbot-watermark"></div>');
		$("#plugbot-watermark").css('width', '348px').css('height', '48px').css('left', '360px').css('top', '281px').css('position', 'absolute').css('background-color', '#0A0A0A').css('opacity', '0.9').css('text-align', 'center').css('padding', '6px 0px 6px 0px').css('color', '#fff').css('font-size', '12px').css('font-family', 'arial').css('font-weight', 'bold').css('z-index', '100');
		$("#plugbot-watermark").append('Plug.bot is freeware licensed under the<br /> GNU GPL by 251Studios:<br />See more at <a href="http://bit.ly/NOqPUv" target="_new">http://bit.ly/NOqPUv</a>.');
	});
}


/*
 * Initialise the core listeners.  These listeners
 * are the key functionality of Plug.bot, and allow 
 * us to execute code when a certain event occurs.
 */
function initListeners() {
	/*
	 * Listen for when a new DJ starts playing, then Woot.
	 * 
	 * Also, if auto-queue is enabled, then click the Join button.
	 */
	API.addEventListener(API.DJ_ADVANCE, function(obj) {
		if (autoqueue)
			document.getElementById('button-dj-waitlist-join').click();
		if (autowoot)
			document.getElementById('button-vote-positive').click();
		$("#plugbot-woots, #plugbot-mehs").empty();
	});
	
	/*
	 * Listen for when someone Woots/Mehs so we can add them to the
	 * optional sidebar.
	 */
	if (enableSidebar) {
		$(document).ready(function() {
			if ($("#plugbot-sidebar").length)
				$("#plugbot-sidebar").remove();
			$("body").prepend('<div id="plugbot-sidebar"></div>');
			$("#plugbot-sidebar").css("width", "360px").css("height", "768px").css("position", "absolute").css("opacity", "0.9100000262260437").css("background-color", "#0A0A0A");
			
			$("#plugbot-sidebar").prepend('<div id="plugbot-woots"></div>').append('<div id="plugbot-mehs"></div>');
			
			$("#plugbot-woots").css('height', '70%').css('width', '100%').css('color', '#3FFF00').css('font-size', '12px').css('text-align', 'center').css('font-weight', 'bold').css('padding-top', '16px');
			$("#plugbot-mehs").css('height', '30%').css('width', '100%').css('color', '#ED1C24').css('font-size', '12px').css('text-align', 'center').css('font-weight', 'bold');
		});
		API.addEventListener(API.VOTE_UPDATE, function(obj) {
			if (obj.vote == 1) { // Woot
				if ($("#plugbot-mehs:contains('" + obj.user.username + "')").length) {
					$("#" + obj.user.username).remove();
				}
			
				if ($("#plugbot-woots:contains('" + obj.user.username + "')").length) {
					// Do nothing
				} else {
					$("#plugbot-woots").append("<span id='" + obj.user.username + "'>" + obj.user.username + "</span>").append('<br />');
				}
			} else { // Meh
				if ($("#plugbot-woots:contains('" + obj.user.username + "')").length) {
					$("#" + obj.user.username).remove();
				}
			
				if ($("#plugbot-mehs:contains('" + obj.user.username + "')").length) {
					// Do nothing
				} else {
					$("#plugbot-mehs").append("<span id='" + obj.user.username + "'>"+obj.user.username+"</span>").append('<br />');
				}
			}
		});
	}
}


// Call init functions

displayGUI();
initListeners();
document.getElementById('button-vote-positive').click();
document.getElementById('button-dj-waitlist-join').click();