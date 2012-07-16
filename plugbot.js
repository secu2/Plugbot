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
 * @author Conner Davis ([VIP] ♫Łŏġïç®) & Harrison Schneidman ([VIDJ] EXƎ)
 * @version 0.2.0a
 */

// Triggers
var autowoot = true;
var autoqueue = false;
var hideVideo = false;
var userList = true;

// Testing shit
var stream = false;

// DJ Battles
var points = 0;
var highScore = 0;

// API listeners
function initAPIListeners() 
{
	API.addEventListener(API.DJ_ADVANCE, djAdvanced);
	API.addEventListener(API.VOTE_UPDATE, function(obj) {
		if (userList)
			populateUserlist();
	});
	API.addEventListener(API.USER_JOIN, function(user) {
		if (userList)
			populateUserlist();
		if (isBoris())
			API.sendChat("Welcome to " + $("#current-room-value").text() + ", " + user.username + "!");
	});
	API.addEventListener(API.USER_LEAVE, function(user) {
		if (userList)
			populateUserlist();
	})
}

// Display UI
function displayUI()
{
	$('#plugbot-ui').remove();
	$('#playback').css('z-index', '8'); // hack to make the buttons usable

	$('#playback').append('<div id="plugbot-ui"></div>');
		$("#plugbot-ui").animate({"height": "64px"}, {duration: "slow" });
		$('#plugbot-ui').append(
			'<img src="http://i.imgur.com/fWb8n.png" id="plugbot-btn-woot" alt="auto-hwheat!" />' +
			'<img src="http://i.imgur.com/W5ncS.png" id="plugbot-btn-queue" alt="auto-queue!" />' + 
			'<img src="http://i.imgur.com/jbJDe.png" id="plugbot-btn-hidevideo" alt="hide the video!" />' +
			'<img src="http://i.imgur.com/IGcMP.png" id="plugbot-btn-userlist" alt="user list with woots and mehs as green and red!" />'
		);

	$('body').append('<div id="plugbot-userlist"></div>');
}

// Some on-click listeners for the UI buttons
function initUIListeners()
{	
	$("#plugbot-btn-userlist").on("click", function() {
		userList = !userList;
		$(this).attr("src", userList ? 'http://i.imgur.com/IGcMP.png' : 'http://i.imgur.com/pAFJS.png');
		$("#plugbot-userlist").css("visibility", userList ? ("visible") : ("hidden"));
		if (!userList) {
			$("#plugbot-userlist").empty();
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


function djAdvanced(obj) 
{
	if (autowoot) 
		$("#button-vote-positive").click();

	if ($("#button-dj-waitlist-join").css("display") === "block" && autoqueue)
		$("#button-dj-waitlist-join").click();

	$("#yt-frame").css("height", "271px");
	$('#plugbot-btn-hidevideo').attr('src', 'http://i.imgur.com/jbJDe.png');
	hideVideo = false;
	
	points = 0;
	highScore = 0;
	
	if (userList)
		populateUserlist();
		
	if (stream)
		$("#yt-frame").remove();
}

function populateUserlist() 
{
	points = 0;
	var userNames = new Array();
	
	for (var i = 0; i < API.getUsers().length; i++) 
	{
		userNames[i] = API.getUsers()[i];
	}
	
	$('#plugbot-userlist').empty();
	
	for (var i = 0; i < userNames.length; i++)
	{
		var user = userNames[i];
		refreshList(user.username, user.vote)
	}
	
	if (points > highScore)
		highScore = points;
	
	//$('#plugbot-userlist').append('<p>High Score: ' + highScore + '</p>');
	$('body').append('<div id="plugbot-userlist"></div>');
}

function refreshList(username, vote) 
{
	var colour;
	var currentDj = false;
	var moderator = false;
	var img;
	
	for (var i = 0; i < API.getModerators().length; i++) {
		if (API.getModerators()[i].username == username) {
			moderator = true;
		}
	}
	
	switch (vote) 
	{
		case 1:
			colour = "3FFF00";
			points++;
			if (moderator)
				img = "http://i.imgur.com/T5G4f.png";
			break;
		case 0:
			colour = "FFFFFF";
			if (moderator) 
				img = "http://i.imgur.com/sRsU0.png";
			break;
		case -1:
			colour = "ED1C24";
			if (moderator)
				img = "http://i.imgur.com/JPA1Q.png";
			break;
	}
	
	if (API.getDJs()[0].username == username) {
		currentDj = true;
		colour = "42A5DC";
		if (moderator)
			img = "http://i.imgur.com/CsK3d.png";
	}
	
	if (img == undefined && moderator)
		img = "http://i.imgur.com/sRsU0.png";
		
	$('#plugbot-userlist').append(
		(moderator ? '<img src="' + img + '" align="left" style="margin-left:4px" alt="Moderator" />' : '') 
		+ '<p style="' + (moderator ? 'text-indent:4px !important;font-weight:bold;' : '') 
		+ 'color:#' + colour + ';' + (currentDj ? 'font-weight:bold;font-size:15px' : '') + '"' 
		+ (currentDj ? ('title="' + username + ' is the current DJ!"') : '') + '>' 
		+ username + '</p>'
	);
}

function isSebastian() { return API.getSelf().username == "Sebastian[BOT]"; }
function isBoris() { return API.getSelf().username == "BorisYeltsin[BOT]"; }


// On init

$('head').prepend('<link href="http://wlsandd.net78.net/plugbot/plugbot.css" rel="stylesheet" type="text/css" />');

$("#button-vote-positive").click();

$("#plugbot-userlist").empty();
initAPIListeners();
populateUserlist();
displayUI();
initUIListeners();

if (isBoris())
{
	window.setInterval(function() {
		API.sendChat("Please remember to view our rules at http://goo.gl/cM7j0");
	}, (1000 * 60 * 30));
}

// TESTING ONLY 
API.addEventListener(API.CHAT, function(data) {
	if (data.message == "/stream") {
		stream = !stream;
		
		if (stream) {
			$("#yt-frame").remove();
			$("#scplayer").remove();
			
			
			console.log('Stream enabled');
		} else {
			$("#stream-frame").empty();
			$("#button-refresh").click();
			
			console.log('Stream disabled');
		}
	}
});
