var fs = require('fs');
var readline = require("readline")
var http = require('http');
var app = http.createServer();
var io = require('socket.io')(app);

app.listen(process.env.PORT || 3000, function()
	{
		console.log("Server started.")
	});


// Round timers.
let roundTimeRemaining;
let roundTimer;
//---

// Drawers
let drawingPersonL;
let drawingPersonR;
//---

// Reading words from json into a variable.
var wordData = fs.readFileSync('words.json');
let possibleWords = JSON.parse(wordData);
// ---

let gameState = "LOBBY";
let connectedUsers = [];
let curGuessWord



io.on("connection", function(socket){

	socket.on("attemptJoin", function(data){
		TryAcceptUser(socket.id, data.nick, data.portrait)
	})

	socket.on("disconnect", function(){
		console.log("User disconnected: " + socket.id)

		if(gameState == "ROUND"){
			if(socket.id == drawingPersonR.id || socket.id == drawingPersonL.id){
				io.emit("cancel-round", "Çizim yapan oyunculardan biri veya ikisi oyunu terk etti. Yeni raunt başlıyor..")
				gameState = "LOBBY"
			}
		}
		if(connectedUsers[0]){
			if(connectedUsers[0].id == socket.id && connectedUsers.length != 1){
				io.emit("new-host", {nick: connectedUsers[1].nick})
			}
		}

		connectedUsers = connectedUsers.filter(usr => usr.id != socket.id)


		io.emit("refresh-users", getUserList())
	})

	socket.on("start-game-request", function(){
		AttemptStartGame(socket)
	})

	socket.on("guess-word", function(data){
		if(gameState == "ROUND"){
			if(socket.id != drawingPersonR.id && socket.id != drawingPersonL.id){
				var userName = connectedUsers.filter(usr => usr.id == socket.id)[0].nick
				if(data == curGuessWord){
					emitText(userName + " kelimeyi buldu!")
					connectedUsers.filter(usr => usr.id == socket.id)[0].points += 10
					io.emit("refresh-users", getUserList())
					socket.emit("guessed-correct")
					// TODO: Check if the user guessed correct already.
				}
				else{
					emitText(data, userName)
				}
			}
		}
	})

	socket.on("vote", function(data){
		if(data == "R"){
			connectedUsers.filter(usr => usr.id == socket.id)[0].lastVote = "R"
		}
		else if(data == "L"){
			connectedUsers.filter(usr => usr.id == socket.id)[0].lastVote = "L"
		}
	})
	

	socket.on("paint", function(data){

		if(gameState != "ROUND")
			return

		var paintSide;

		if(socket.id == drawingPersonR.id)
		{
			paintSide = "R"
		}
		else if(socket.id == drawingPersonL.id){
			paintSide = "L"
		}
		else{
			return;
		}
		io.emit("paint-response", {xPos: data.xPos, yPos: data.yPos, endX: data.endX, endY: data.endY, canvas: paintSide, color: data.color})
	})

});

function ToLobby(){
	gameState = "LOBBY"
	io.emit("to-lobby")
}

function AttemptStartGame(socket){
	if(connectedUsers[0].id == socket.id){
		if(connectedUsers.length >= 3){
			StartRound();
		}
		else{
			socket.emit("rejected", "Yetersiz oyuncu sayısı!")
		}
	}
}

function StartRound(){
	var rndL = Math.floor(Math.random() * connectedUsers.length)
	var rndR = Math.floor(Math.random() * connectedUsers.length)
	var rndWord = Math.floor(Math.random() * possibleWords.length)

	if(rndL == rndR && rndL != 0){
		rndR -= 1
	}
	
	if(rndL == rndR && rndL == 0){
		rndR += 1
	}

	drawingPersonL = connectedUsers[rndL]
	drawingPersonR = connectedUsers[rndR]
	curGuessWord = possibleWords[rndWord]

	gameState = "ROUND"

	io.emit("new-round", {drawerL: drawingPersonL.nick, drawerR: drawingPersonR.nick})

	io.to(drawingPersonR.id).emit("selected-painter", curGuessWord)
	io.to(drawingPersonL.id).emit("selected-painter", curGuessWord)

	roundTimeRemaining = 30

	roundTimer = setInterval(
		function(){
		  	if(roundTimeRemaining <= 0){
		    	
		    	EndOfPainting()
		    	clearInterval(roundTimer);
		    	return
		  	}

		  	if(gameState != "ROUND"){
		  		clearInterval(roundTimer)
		  		return
		  	}

		  	roundTimeRemaining -= 1
		  	io.emit("new-time", roundTimeRemaining)
		}, 1000);

}

function EndOfPainting(){
	io.emit("time-up")
	gameState = "EPIL-ROUND"

	var voteTimer = setInterval(
		function() 
		{

			var RVoters = connectedUsers.filter(usr => usr.lastVote == "R")
			var LVoters = connectedUsers.filter(usr => usr.lastVote == "L")

			drawingPersonR.points += RVoters.length*10
			drawingPersonL.points += LVoters.length*10

			io.emit("refresh-users", getUserList())
			io.emit("vote-results", {R: RVoters, L:LVoters})

			var lobbyTimer = setInterval(function() {ToLobby(); clearInterval(lobbyTimer);}, 5000)
		
		   	clearInterval(voteTimer)
		}, 5000)
}

function TryAcceptUser(sessionID, nickname, portraitIndex){


	if(gameState != "LOBBY"){
		io.to(sessionID).emit("rejected", "Oyun halen sürüyor, daha sonra tekrar dene.")
		return;
	}

	if(nickname != null && nickname.length > 0 && nickname.length < 12)
	{
		connectedUsers.push(new User(sessionID, nickname, 0, portraitIndex))

		var userList = getUserList()
		io.to(sessionID).emit("accepted", {id: sessionID, gameState: "LOBBY", isHost: connectedUsers.length == 1, players: userList})
		io.emit("refresh-users", getUserList())


		console.log("User accepted: " + sessionID)
	}
	else{
		io.to(sessionID).emit("rejected", "Geçersiz kullanıcı adı!")
	}
}

function getUserList(){
	let usrList = []
	for(var i = 0; i < connectedUsers.length; i++){
		usrList.push({nick: connectedUsers[i].nick, points: connectedUsers[i].points, portrait: connectedUsers[i].portrait})
	}
	return usrList
}

function emitText(message, sender){

	io.emit("chat-text", {	
		type: (sender == null) ? "SYSTEM":null,
		message: message,
		sender: sender
	})

	console.log()
}

class User {
  constructor(id, nick, points, portraitIndex) {
    this.id = id;
    this.nick = nick;
    this.points = points;
    this.portrait = portraitIndex
  }
}