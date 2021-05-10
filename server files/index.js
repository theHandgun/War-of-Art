var fs = require('fs');
var http = require('http');
var app = http.createServer();
var io = require('socket.io')(app);

app.listen(process.env.PORT || 3000, function()
	{
		console.log("Server started.")
	});

let gameState = "LOBBY";
let connectedUsers = [];
let drawingPersonL;
let drawingPersonR;


io.on("connection", function(socket){

	socket.on("attemptJoin", function(data){
		TryAcceptUser(socket.id, data.nick)
	})

	socket.on("disconnect", function(){
		console.log("User disconnected: " + socket.id)
		connectedUsers = connectedUsers.filter(usr => usr.id != socket.id)
		io.emit("refreshUsers", getUserList())
	})

	socket.on("paint", function(data){

		if(gameState != "ROUND")
			return

		var paintSide;

		if(socket.id == drawingPersonR)
		{
			paintSide = "R"
		}
		else if(socket.id == drawingPersonL){
			paintSide = "L"
		}
		else{
			return;
		}

		io.emit("paint-response", {xPos: data.xPos, yPos: data.yPos, endX: data.endX, endY: data.endY, canvas: paintSide})
	})

});

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

	if(rndL == rndR){
		rndR -= 1
	}

	drawingPersonL = connectedUsers[rndL]
	drawingPersonR = connectedUsers[rndR]

	gameState = "ROUND"

	io.to(drawingPersonR.id).emit("selected-painter", "araba")
	io.to(drawingPersonL.id).emit("selected-painter", "araba")

	io.emit("newRound", {drawerL: connectedUsers[rndL].nick, drawerR: connectedUsers[rndR].nick})
}

function TryAcceptUser(sessionID, nickname){


	if(gameState != "LOBBY"){
		io.to(sessionID).emit("rejected", "Oyun halen sürüyor, daha sonra tekrar dene.")
		return;
	}

	if(nickname != null && nickname.length > 0 && nickname.length < 12)
	{
		connectedUsers.push(new User(sessionID, nickname, 0))
		var isHost = connectedUsers.length == 1

		io.to(sessionID).emit("accepted", {id: sessionID, gameState: gameState, isHost: isHost})
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