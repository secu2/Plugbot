/*
 * Author: Conner Davis (Logic®)
 * Purpose: Bookmarklet entry point
 */

var autoqueue;
var autowoot = true;
 
 
/*
 * Since we're cool, we use a jQuery rollout for our GUI.
 * Also, because I was running out of space by using it in 
 * the audience container.
 */
function displayGUI() {
	/* 
	 * Generate the Plug.bot settings GUI.
	 */
	$("body").prepend("<div id=\"plugbot-gui\"></div>");
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
determineAutoqueue();
document.getElementById('button-vote-positive').click();
if (autoqueue)
	document.getElementById('button-dj-waitlist-join').click();
initListeners();