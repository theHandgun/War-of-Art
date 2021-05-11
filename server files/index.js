var fs = require('fs');
var http = require('http');
var app = http.createServer();
var io = require('socket.io')(app);

app.listen(process.env.PORT || 3000, function()
	{
		console.log("Server started.")
	});

let gameState = "LOBBY";
let roundTimeRemaining;
let roundTimer;


let connectedUsers = [];

let curGuessWord

let drawingPersonL;
let drawingPersonR;


io.on("connection", function(socket){

	socket.on("attemptJoin", function(data){
		TryAcceptUser(socket.id, data.nick)
	})

	socket.on("disconnect", function(){
		console.log("User disconnected: " + socket.id)

		if(gameState == "ROUND"){
			if(socket.id == drawingPersonR.id || socket.id == drawingPersonL.id){
				io.emit("cancel-round", "Çizim yapan oyunculardan biri veya ikisi oyunu terk etti. Yeni raunt başlıyor..")
				gameState = "LOBBY"
			}
		}

		connectedUsers = connectedUsers.filter(usr => usr.id != socket.id)
		io.emit("refreshUsers", getUserList())
	})

	socket.on("start-game-request", function(){
		AttemptStartGame(socket)
	})

	socket.on("guess-word", function(data){
		if(gameState == "ROUND"){
			if(socket.id != drawingPersonR.id && socket.id != drawingPersonL.id){
				if(data == curGuessWord){
					connectedUsers.filter(usr => usr.id == socket.id)[0].points += 10
					io.emit("refreshUsers", getUserList())
					socket.emit("guessed-correct")
					// TODO: Check if the user guessed correct already.
				}
			}
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

		io.emit("paint-response", {xPos: data.xPos, yPos: data.yPos, endX: data.endX, endY: data.endY, canvas: paintSide})
	})

});

function ToLobby(){
	console.log("To lobby we go")
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

	if(rndL == rndR && rndL != 0){
		rndR -= 1
	}
	
	if(rndL == rndR && rndL == 0){
		rndR += 1
	}

	drawingPersonL = connectedUsers[rndL]
	drawingPersonR = connectedUsers[rndR]

	gameState = "ROUND"

	curGuessWord = "araba"
	io.emit("newRound", {drawerL: drawingPersonL.nick, drawerR: drawingPersonR.nick})

	io.to(drawingPersonR.id).emit("selected-painter", "araba")
	io.to(drawingPersonL.id).emit("selected-painter", "araba")

	roundTimeRemaining = 30

	roundTimer = setInterval(
		function(){
		  	if(roundTimeRemaining <= 0){
		  		console.log("Time out.")
		    	roundTimeRemaining = 30
		    	io.emit("time-up")
		    	gameState = "EPIL-ROUND"
		    	setInterval(ToLobby, 5000)
		    	clearInterval(roundTimer);
		  	}

		  	roundTimeRemaining -= 1
		  	io.emit("new-time", roundTimeRemaining)
		}, 1000);

}

function TryAcceptUser(sessionID, nickname){


	if(gameState != "LOBBY"){
		io.to(sessionID).emit("rejected", "Oyun halen sürüyor, daha sonra tekrar dene.")
		return;
	}

	if(nickname != null && nickname.length > 0 && nickname.length < 12)
	{
		connectedUsers.push(new User(sessionID, nickname, 0))

		io.to(sessionID).emit("accepted", {id: sessionID, gameState: "LOBBY", isHost: connectedUsers.length == 1})
		io.emit("refreshUsers", getUserList())


		console.log("User accepted: " + sessionID)
	}
	else{
		io.to(sessionID).emit("rejected", "Geçersiz kullanıcı adı!")
	}
}

function getUserList(){
	let usrList = []
	for(var i = 0; i < connectedUsers.length; i++){
		usrList.push({nick: connectedUsers[i].nick, points: connectedUsers[i].points})
	}
	return usrList
}

class User {
  constructor(id, nick, points) {
    this.id = id;
    this.nick = nick;
    this.points = points;
  }
}