/*
 * Author: Conner Davis (Logic®)
 * Purpose: Bookmarklet entry point
 */

// Enable autoqueue?
var autoqueue = true;

// Enable autowoot? (Default is true)
var autowoot = true;

// Enable the woot/meh ratio sidebar?
var enableSidebar = false;

 
/*
 * Since we're cool, we use jQuery for the UI.
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
	});
	
	/*
	 * Listen for when someone Woots/Mehs so we can add them to the
	 * optional sidebar.
	 */
	/*if (enableSidebar) {
		$(document).ready(function() {
			if ($("#plugbot-sidebar").length)
				$("#plugbot-sidebar").remove();
			$("body").prepend('<div id="plugbot-sidebar"></div>');
			$("#plugbot-sidebar").css("width", "349px").css("height", "768px").css("position", "absolute").css("opacity", "0.9100000262260437").css("background-color", "#0A0A0A");
			
			$("#plugbot-sidebar").prepend("<h1 style=\"text-align:center;font-family:'arial';\">Meh/Woot List</h3>");
			$("#plugbot-sidebar").append('<hr style="border-bottom:1px dotted #fff;width:75%" /><br />');
			
			$("#plugbot-sidebar").append('<div id="woots"><h2 style="color:#3FFF00;text-align:center">WOOTS</h3><br /><br /></div>');
			$("#woots").css("float", "left").css("width", "140px").css("margin-left", "16px").css("color", "#3FFF00");
			$("#plugbot-sidebar").append('<div id="mehs"><h2 style="color:#ED1C24;text-align:center">MEHS</h2><br />');
			$("#mehs").css("color", "#ED1C24").css("margin-left", "160px").css("text-align", "center");
			
			$("#woots, #mehs").css("font-family", "'arial'").css("font-size", "12px");
		});
		API.addEventListener(API.VOTE_UPDATE, function(obj) {
			if (obj.vote == 1) {
				if (("#woots").not(":contains('" + obj.user.username + "')"))
					$("#woots").append(obj.user.username + "<br />");
			} else {
				if (("#mehs").not(":contains('" + obj.user.username + "')"))
					$("#mehs").append(obj.user.username + "<br />");
			}
		});
	}*/
}


// Call init functions

if ($('#current-room-value:contains("Dubstep Den")').length > 0) {
	document.getElementById('button-vote-negative').click();
	API.sendChat("#BasementTakeOver");
	alert("Oh, what's that?  You like Dubstep Den? #EDMBasementTakeOver");
} else {
	displayGUI();
	initListeners();
	document.getElementById('button-vote-positive').click();
	document.getElementById('button-dj-waitlist-join').click();
}