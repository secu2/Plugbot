/*
 * Author: Conner Davis (Logic®)
 * Purpose: Bookmarklet entry point
 */

// Enable autoqueue?
var autoqueue;

// Enable autowoot? (Default is true)
var autowoot = true;

// Enable automatic idle chat messages?
var idleMessages = false;

// Random messages to display
var messages = new Array();
	messages[0] = "I am using Plug.bot by Logic®.  Check it out at http://bit.ly/Kbi18U";
	messages[1] = "NoizeRebel is currently in the lead for most points in EDM Basement, at over 26k!";
	messages[2] = "EDM Basement is often recognised as the most popular room on Plug.dj!"
	messages[3] = "The rules of EDM Basement are important.  Read them!!";
 
 
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
		$("#plugbot-gui").append('<span id="idlechat-btn">IDLE MESSAGES</span>');
		$("#plugbot-gui span").css("font", "bold 12px arial").css("text-align", "center").css("margin-left", "32px").css("color", "#3FFF00").css("cursor", "pointer");
		if (!autoqueue) 
			$("#autoqueue-btn").css("color", "#ED1C24");
		$("#autowoot-btn").css("margin-left", "0px");
		
		$("#automeh-btn").css("color", "#ED1C24");
		$("#automesg-btn").css("color", "#ED1C24");
		$("#idlechat-btn").css("color", "#ED1C24");
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
	$("#idlechat-btn").on('click', function() {
		idleMessages = !idleMessages;
		if (!idleMessages) {
			$(this).css("color", "#ED1C24");
			API.sendChat("I just disabled automatic idle messages on Plug.bot!  :(");
			window.clearInterval(idleMessagesInterval);
		} else {
			$(this).css("color", "#3FFF00");
			API.sendChat("I just enabled automatic idle messages on Plug.bot!  I'm awesome!");
			window.setInterval(idleMessagesInterval);
		}
	});
}


/*
 * Enable or disable auto-queueing.  
 *
 * Auto-queueing is the process where whenever the user
 * has finished playing a song and are removed from the
 * DJ queue, they are immediately re-added.
 */
function determineAutoqueue() {
	var input = prompt("Would you like to enable auto-queueing?", "Yes/No  (not case sensitive)").toLowerCase();
	if (input == "yes") 	
		autoqueue = true;
	else if (input == "no")
		autoqueue = false;
	else 					
		alert("You didn't validly tell me whether you want to enable auto-queueing or not... please run the script again..");
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
	API.addEventListener(API.DJ_ADVANCE, function( obj ) {
		if (autoqueue)
			document.getElementById('button-dj-waitlist-join').click();
		if (autowoot)
			document.getElementById('button-vote-positive').click();
	});
}


// Call init functions

/*
 * Determine if they want to enable auto-queue or not. 
 * This may or may not be removed eventually.
 */
determineAutoqueue();

/*
 * Display the UI that allows users to edit settings.
 * This is just a small bar with icons that glow on/off.
 */
displayGUI();

/*
 * Click the Autowoot button as a start, if they want it.
 * Same with the Wait List Join button.
 */
if (autowoot)
	document.getElementById('button-vote-positive').click();
if (autoqueue)
	document.getElementById('button-dj-waitlist-join').click();
	
/*
 * Init any listeners bound to the API.
 */
initListeners();

/*
 * Start the idle chat messaging loop.
 */
var idleMessagesInterval = window.setInterval(function() {
	API.sendChat(messages[Math.floor(Math.random()*messages.length)]);
}, 3600000 /* 1 hour */);

if (!idleMessages)
	window.clearInterval(idleMessagesInterval);