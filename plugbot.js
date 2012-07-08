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
 * @author Conner Davis ([VIP] ♫Łŏġïç®) & Harrison Schneidman ([VIDJ] EXƎ)
 * @version 0.2.0a
 */

// Triggers
var autowoot = true;
var autoqueue = true;
var hideVideo = false;
var userList = true;
var points = 0;
var highScore = 0;

// API listeners
function initAPIListeners() 
{
	API.addEventListener(API.DJ_ADVANCE, djAdvanced);
	API.addEventListener(API.VOTE_UPDATE, function(obj) {
		populateUserlist();
	});
	API.addEventListener(API.USER_JOIN, function(user) {
		populateUserlist();
	});
	API.addEventListener(API.USER_LEAVE, function(user) {
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
			'<img src="http://i.imgur.com/IxK27.png" id="plugbot-btn-queue" alt="auto-queue!" />' + 
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
		if (hideVideo) 
			$("#yt-frame").animate({"height": "0px"}, {duration: "fast"});
		else 
			$("#yt-frame").animate({"height": "271px"}, {duration: "fast"});
	});

	$("#plugbot-btn-queue").on("click", function() {
		autoqueue = !autoqueue;
		$(this).attr("src", autoqueue ? 'http://i.imgur.com/IxK27.png' : 'http://i.imgur.com/W5ncS.png');
		if (autoqueue)
			$("#button-dj-waitlist-join").click();
		else 
			$("#button-dj-waitlist-leave").click();

		console.log('Auto-queue is now ' + (autoqueue ? 'enabled' : 'disabled'));
	});

}
function newSong()
{
	points = 0;
	highScore = 0;
	populateUserlist();
}
function djAdvanced(obj) 
{
	if (autowoot) 
		$("#button-vote-positive").click();

	if ($("#button-dj-waitlist-join").css("display") === "block" && autoqueue)
		$("#button-dj-waitlist-join").click();

	$("#yt-frame").css("height", "271px");
	$("#plugbot-btn-hidevideo").attr("src", ROOT_DIR + 'hidevideo.png');
	hideVideo = !hideVideo;
	$(this).attr("src", hideVideo ? 'http://i.imgur.com/lwpfH.png' : 'http://i.imgur.com/jbJDe.png');
	if (hideVideo) 
		$("#yt-frame").animate({"height": "0px"}, {duration: "fast"});
	else 
		$("#yt-frame").animate({"height": "271px"}, {duration: "fast"});
	
	newSong();
}

function populateUserlist() 
{
	points = 0;
	var userNames = new Array()
	for (var i = 0; i < API.getUsers().length; i++) 
	{
		userNames[i] = API.getUsers()[i];
	}
	//userNames.sort();
	$('#plugbot-userlist').empty();
	for (var i = 0; i < userNames.length; i++)
	{
		var user = userNames[i];
		refreshList(user.username, user.vote)
	}
	if(points > highScore)
	{
		highScore = points;
	}
	//$('#plugbot-userlist').append('<p>High Score: ' + highScore + '</p>');
	$('body').append('<div id="plugbot-userlist"></div>');
}

function refreshList(username, vote) 
{
	console.log(vote);


	var colour;
	switch (vote) 
	{
		case 1:
			colour = "3FFF00";
			points++;
			break;
		case 0:
			colour = "FFFFFF";
			break;
		case -1:
			colour = "ED1C24";
			break;
	}
	$('#plugbot-userlist').append('<p style="color:#' + colour + ';">' + username + '</p>');
}

function isSebastian() { return API.getSelf().username == "Sebastian[BOT]"; }
function isBoris() { return API.getSelf().username == "BorisYeltsin[BOT]"; }


// On init

$('head').prepend('<link href="http://wlsandd.net78.net/plugbot/plugbot.css" rel="stylesheet" type="text/css" />');

$("#button-vote-positive").click();
$("#button-dj-waitlist-join").click();

$("#plugbot-userlist").empty();
initAPIListeners();
populateUserlist();
displayUI();
initUIListeners();