/*
 * Author: Conner Davis (Logic®)
 * Purpose: Bookmarklet entry point
 */

// Enable autoqueue?
var autoqueue;

// Enable autowoot? (Default is true)
var autowoot = true;

// Random phrases.  Idk
var phrases = new Array(3);
	phrases[0] = "I really enjoy fingering my asshole while simultaneously fapping to Plug.bot on EDM Basement.";
	phrases[1] = "There are 10 kinds of people.  Those who know binary, and those who don't.";
	phrases[2] = "That moment when you think I typed 'that awkward moment' when I really didn't.";
 
 
/*
 * Since we're cool, we use a jQuery rollout for our GUI.
 * Also, because I was running out of space by using it in 
 * the audience container.
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
		
		$("#plugbot-gui").css("width", "348px").css("height", "48px").css("background-color", "#0A0A0A").css("opacity", "0.9100000262260437").css("border-top", "1px dotted #292929").css("-webkit-border-radius", "0 0 8px 8px").css("-moz-border-radius", "0 0 8px 8px").css("margin", "0 auto").css("z-index", "50");
		
		$("#plugbot-gui").prepend('<br /><span id="autowoot-btn">AUTOWOOT</span>');
		$("#plugbot-gui").append('<span id="automeh-btn">AUTOMEH</span>');
		$("#plugbot-gui").append('<span id="autoqueue-btn">AUTOQUEUE</span>');
		$("#plugbot-gui span").css("font", "bold 12px arial").css("text-align", "center").css("margin-left", "32px").css("color", "#3FFF00").css("cursor", "pointer");
		if (!autoqueue) 
			$("#autoqueue-btn").css("color", "#ED1C24");
		$("#plugbot-gui span:first-child").css("margin-left", "0px !important");
		
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

window.setInterval(function() {
	document.getElementById("chat-input-field").value = phrases[Math.floor(Math.random()*phrases.length)]
}, 600000);