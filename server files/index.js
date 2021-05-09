var fs = require('fs');
var http = require('http');
var app = http.createServer();
var io = require('socket.io')(app);

app.listen(process.env.PORT || 3000, function()
	{
		console.log("Server started.")
	});

let connectedUsers = []
let gameState = "LOBBY";

let drawingPersons = [];


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
		io.emit("paint-response", {xPos: data.xPos, yPos: data.yPos, endX: data.endX, endY: data.endY, canvas: "R", scaleFrom: "M" })
		socket.emit("paint-response", {xPos: data.xPos, yPos: data.yPos, endX: data.endX, endY: data.endY, canvas: "M"})
	})

});

function TryAcceptUser(sessionID, nickname){


	if(gameState != "LOBBY"){
		io.to(sessionID).emit("rejected", "Oyun halen sürüyor, daha sonra tekrar dene.")
		return;
	}

	if(nickname != null && nickname.length > 0 && nickname.length < 12)
	{
		connectedUsers.push(new User(sessionID, nickname, 0))
		io.to(sessionID).emit("accepted", {users: getUserList(), id: sessionID})
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