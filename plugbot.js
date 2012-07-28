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
 
/**
 * NOTE:  This is all procedural as hell because prototypes and any 
 * 			OOP techniques in Javascript are stupid and confusing.
 * 
 * @author 	Conner Davis ([VIP] ♫Łŏġïç®) 
 * 			Harrison Schneidman ([VIDJ] EXƎ)
 */

/**
 * Whether the user has currently enabled auto-woot. 
 */
var autowoot = true;
/**
 * Whether the user has currently enabled auto-queueing. 
 */
var autoqueue = false;
/**
 * Whether or not the user has enabled hiding this video. 
 */
var hideVideo = false;
/**
 * Whether or not the user has enabled the userlist. 
 */
var userList = true;

// TODO:  DJ battle-related.
var points = 0;
var highScore = 0;

/**
 * Initialise all of the Plug.dj API listeners which we use
 * to asynchronously intercept specific events and the data
 * attached with them. 
 */
function initAPIListeners() 
{
	/**
	 * This listens in for whenever a new DJ starts playing. 
	 */
	API.addEventListener(API.DJ_ADVANCE, djAdvanced);

	/**
	 * This listens for whenever a user in the room either WOOT!s
	 * or Mehs the current song. 
	 */
	API.addEventListener(API.VOTE_UPDATE, function(obj) {
		if (userList)
			populateUserlist();
	});

	/**
	 * Whenever a user joins, this listener is called. 
	 */
	API.addEventListener(API.USER_JOIN, function(user) {
		if (userList)
			populateUserlist();
		if (isBoris())
			API.sendChat("\/me Welcome to " + $("#current-room-value").text() + ", " + user.username + "!");
	});

	/**
	 * Called upon a user exiting the room. 
	 */
	API.addEventListener(API.USER_LEAVE, function(user) {
		if (userList)
			populateUserlist();
	})
}

/**
 * Renders all of the Plug.bot "UI" that is visible beneath the video
 * player. 
 */
function displayUI()
{
	/*
	 * Be sure to remove any old instance of the UI, in case the user
	 * reloads the script without refreshing the page (updating.)
	 */
	$('#plugbot-ui').remove();

	/*
	 * This is a necessary hack (of sorts) that allows the UI to actually
	 * be visible and interactive.
	 */
	$('#playback').css('z-index', '8'); 

	/*
	 * Generate the HTML code for the UI.
	 */
	$('#playback').append('<div id="plugbot-ui"></div>');
		$("#plugbot-ui").animate({"height": "64px"}, {duration: "slow" });
		$('#plugbot-ui').append(
			'<img src="http://i.imgur.com/fWb8n.png" id="plugbot-btn-woot" alt="auto-hwheat!" />' +
			'<img src="http://i.imgur.com/W5ncS.png" id="plugbot-btn-queue" alt="auto-queue!" />' + 
			'<img src="http://i.imgur.com/jbJDe.png" id="plugbot-btn-hidevideo" alt="hide the video!" />' +
			'<img src="http://i.imgur.com/IGcMP.png" id="plugbot-btn-userlist" alt="user list with woots and mehs as green and red!" />'
		);
}

/**
 * For every button on the Plug.bot UI, we have listeners backing them
 * that are built to intercept the user's clicking each button.  Based 
 * on the button that they clicked, we can execute some logic that will
 * in some way affect their experience. 
 */
function initUIListeners()
{	
	$("#plugbot-btn-userlist").on("click", function() {
		userList = !userList;
		$(this).attr("src", userList ? 'http://i.imgur.com/IGcMP.png' : 'http://i.imgur.com/pAFJS.png');
		$("#plugbot-userlist").css("visibility", userList ? ("visible") : ("hidden"));
		if (!userList) {
			$("#plugbot-userlist").empty();
		} else {
			populateUserlist();
		}
		console.log('Userlist is now ' + (userList ? 'enabled' : 'disabled'));
	});

	$("#plugbot-btn-woot").on("click", function() {
		autowoot = !autowoot;
		$(this).attr("src", autowoot ? 'http://i.imgur.com/fWb8n.png' : 'http://i.imgur.com/uyUtA.png');
		if (autowoot)
			$("#button-vote-positive").click();
		console.log('Auto-woot is now ' + (autowoot ? 'enabled' : 'disabled'));
	});

	$("#plugbot-btn-hidevideo").on("click", function() {
		hideVideo = !hideVideo;
		$(this).attr("src", hideVideo ? 'http://i.imgur.com/lwpfH.png' : 'http://i.imgur.com/jbJDe.png');
		$("#yt-frame").animate({"height": (hideVideo ? "0px" : "271px")}, {duration: "fast"});
	});

	$("#plugbot-btn-queue").on("click", function() {
		autoqueue = !autoqueue;
		$(this).attr("src", autoqueue ? 'http://i.imgur.com/IxK27.png' : 'http://i.imgur.com/W5ncS.png');
		$("#button-dj-waitlist-" + (autoqueue ? "join" : "leave")).click();
		console.log('Auto-queue is now ' + (autoqueue ? 'enabled' : 'disabled'));
	});
}

/**
 * Called whenever a new DJ begins playing in the room.
 *  
 * @param {Object} obj
 * 				This contains the user (current DJ)'s data.
 */
function djAdvanced(obj) 
{
	/*
	 * If auto-woot is enabled, WOOT! the song.
	 */
	if (autowoot) 
		$("#button-vote-positive").click();

	/*
	 * If auto-queueing has been enabled, and they have just recently
	 * left the waitlist, join them back.
	 */
	if ($("#button-dj-waitlist-join").css("display") === "block" && autoqueue)
		$("#button-dj-waitlist-join").click();

	/*
	 * Reset all hide video-related matters.
	 */
	$("#yt-frame").css("height", "271px");
	$('#plugbot-btn-hidevideo').attr('src', 'http://i.imgur.com/jbJDe.png');
	hideVideo = false;

	// TODO: DJ battle-related
	points = 0;
	highScore = 0;

	/*
	 * If the userlist is enabled, re-populate it.
	 */
	if (userList)
		populateUserlist();
}

/**
 * Generates every user in the room and their current vote as 
 * colour-coded text.  Also, moderators get the star next to
 * their name. 
 */
function populateUserlist() 
{
	/*
	 * Destroy the old userlist DIV and replace it with a fresh
	 * empty one to work with.
	 */
	$("#plugbot-userlist").remove();
	$('body').append('<div id="plugbot-userlist"></div>');

	/*
	 * If the user is in the waitlist, show them their current spot.
	 */
	if ($('#button-dj-waitlist-leave').css('display') === 'block' && ($.inArray(API.getDJs(), API.getSelf()) == -1)) {
		var spot = $('#button-dj-waitlist-view').attr('title').split('(')[1];
			spot = spot.substring(0, spot.indexOf(')'));
		$('#plugbot-userlist').append('<h1 id="plugbot-queuespot"><span style="font-variant:small-caps">Waitlist:</span> ' + spot + '</h3><br />');
	}

	// TODO:  DJ battle-related
	points = 0;

	/*
	 * An array of all of the room's users.
	 */
	var users = new Array();

	/*
	 * Populate the users array with the next user
	 * in the room (this is stored alphabetically.)
	 */
	for (user in API.getUsers())
	{
		users.push(API.getUsers()[user]);
	}

	/*
	 * For every user, call the #appendUser(username, vote) method
	 * which will display their username with any colour coding that
	 * they match.
	 */
	for (user in users) 
	{
		var user = users[user];
		appendUser(user.username, user.vote)
	}

	// TODO: DJ battle-related
	if (points > highScore)
		highScore = points;
}


/**
 * Appends another user's username to the userlist.
 *  
 * @param {Object} username
 * 				The username of this user.
 * @param {Object} vote
 * 				Their current 'vote', which may be:
 * 					-1 	: Meh
 *					0	: 'undecided' (hasn't voted yet)
 * 					1	: WOOT!
 */
function appendUser(username, vote) 
{
	/*
	 * Some variables that we'll either be setting as true/false
	 * (some conditionals that do major changes to their look in the userlist)
	 * or setting a value to.
	 */
	var colour;
	var currentDj = false;
	var moderator = false;
	var img;

	/*
	 * Loop through the room's moderators to detect a match
	 * for this user, in which case we'll prepend the mod
	 * star to their name.
	 */
	for (var i = 0; i < API.getModerators().length; i++) 
	{
		if (API.getModerators()[i].username == username) 
		{
			moderator = true;
		}
	}

	/*
	 * Based on their vote, apply the colour coding.
	 */
	switch (vote) 
	{
		case 1:		// WOOT!
			colour = "3FFF00";
			points++;
			if (moderator)
				img = "http://i.imgur.com/T5G4f.png";
			break;
		case 0:		// Undecided
			colour = "FFFFFF";
			if (moderator) 
				img = "http://i.imgur.com/sRsU0.png";
			break;
		case -1:	// Meh
			colour = "ED1C24";
			if (moderator)
				img = "http://i.imgur.com/JPA1Q.png";
			break;
	}

	/*
	 * If they're the current DJ, apply some more special
	 * changes.
	 */
	if (API.getDJs()[0].username == username) {
		currentDj = true;
		colour = "42A5DC";
		if (moderator)
			img = "http://i.imgur.com/CsK3d.png";
	}

	/*
	 * Sometimes undecided mod star breaks.  This fixes that.
	 */
	if (img == undefined && moderator)
		img = "http://i.imgur.com/sRsU0.png";

	/*
	 * Apply the HTML code to the page that actually displays them
	 * inside the userlist.
	 */
	$('#plugbot-userlist').append(
		(moderator ? '<img src="' + img + '" align="left" style="margin-left:6px;" alt="Moderator" />' : '') 
		+ '<p style="' + (moderator ? 'text-indent:6px !important;font-weight:bold;' : '') 
		+ 'color:#' + colour + ';' + (currentDj ? 'font-weight:bold;font-size:15px' : '') + '"' 
		+ (currentDj ? ('title="' + username + ' is the current DJ!"') : '') + '>' 
		+ username + '</p>'
	);
}


/**
 * If you are Boris, you are awesome.
 * 
 * (The greeting bot) 
 */
function isBoris() 
{ 
	return API.getSelf().username == "BorisYeltsin[BOT]"; 
}


///////////////////////////////////////////////////////////
////////// EVERYTHING FROM HERE ON OUT IS INIT ////////////
///////////////////////////////////////////////////////////

/*
 * Clear the old code so we can properly update everything.
 */
$('#plugbot-css').remove();
$('#plugbot-js').remove();

/*
 * Write the CSS rules that are used for components of the 
 * Plug.bot UI.
 */
$('body').prepend('<style type="text/css" id="plugbot-css">' 
	+ '#plugbot-ui { position: absolute; top: 276px; left: 2.5%; }'
	+ '#plugbot-ui img { display: inline; cursor: pointer; margin-left: -2px; }'
    + '#plugbot-userlist { border: 6px solid rgba(10, 10, 10, 0.8); border-left: 0 !important; background-color: #000000; padding: 8px 0px 20px 0px; width: 12%; }'
    + '#plugbot-userlist p { margin: 0; padding-top: 2px; text-indent: 24px; }'
    + '#plugbot-userlist p:first-child { padding-top: 0px !important; }'
    + '#plugbot-queuespot { color: #42A5DC; text-align: left; font-size: 1.5em; margin-left: 8px }');

/*
 * Hit the woot button, since auto-woot is enabled by default.
 */
$("#button-vote-positive").click();

/*
 * Call all init-related functions to start the software up.
 */
initAPIListeners();
populateUserlist();
displayUI();
initUIListeners();

/*
 * If this is Boris bot, then start the timed rules notice.
 */
if (isBoris())
{
	var messages = new Array(
		"Hey, I just came here... and this is crazy. But this place is awsome, so join us maybe? http://www.facebook.com/groups/311826685551703/",
		"If you enjoy EDM, and enjoy this room, please join us on facebook. http://www.facebook.com/groups/311826685551703/",
		"If you like our community, Join us! We have a steam group and a facebook! (*cough* and we also have a teamspeak server *cough*) http://www.facebook.com/groups/311826685551703/",
		"Follow us on Twitter! https://twitter.com/TheEDMBasement  @TheEDMBasement",
		"Join our TeamSpeak 3 server some time!  dfw01.mainvoice.net:7110"
	);
	var lastMessage = "";

	window.setInterval(function() {
		var nextMessage = messages[Math.floor(Math.random() * messages.length)];

		if (nextMessage == lastMessage) {
			while ((nextMessage = messages[Math.floor(Math.random() * messages.length)]) == lastMessage) ;
		}

		lastMessage = nextMessage;
		API.sendChat("\/me " + lastMessage);
	}, (1000 * 60 * 20));
}