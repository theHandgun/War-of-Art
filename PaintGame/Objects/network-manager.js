class NetworkManager{
	constructor(io, game, paintManager){
		this.io = io
		this.registerResponses(io, game)
		this.paintManager = paintManager
	}

	registerResponses(io, game){
		var self = this

		io.on("refresh-users", function(data){
        	game.users = data
        	game.UpdateUserList()
        })

        io.on("new-host", function(data){
        	if(data.nick == game.registry.get("nick")){
        		game.isHost = true

        		if(game.gameState == "LOBBY"){
        			game.PrepareSceneForLobby()
        		}
        	}
        	else{
        		game.isHost = false
        		game.hostB.setVisible(false)
        	}
        })

        io.on("starting-soon", function(data){
        	game.PrepareSceneForVersus(data)
        })

        io.on("started-round", function(data){
        	game.isDrawing = false
        	game.PrepareSceneForGuess()
        })

        io.on("selected-painter", function(data){
        	game.isDrawing = true
        	game.PrepareSceneForDraw(data)
        })

        io.on("paint-response", function(data)
        {
        	var canvasToPaint = game.paintCanvasR

        	if(data.canvas == "L")
        		canvasToPaint = game.paintCanvasL
        	
        	self.paintManager.paint(data, canvasToPaint)

        })

        io.on("guessed-correct", function(){
        	game.guessB.setVisible(false)
        })

        io.on("cancel-round", function(data){
        	game.PrepareSceneForLobby()
        	alert(data)
        })

        io.on("new-time", function(data){
        	game.paintCanvasDrawable.setTimerText(data)
        	game.paintCanvasR.setTimerText(data)
        	game.paintCanvasL.setTimerText(data)
        })

        io.on("time-up", function(data){
        	game.gameState = "EPIL-LOBBY"
        	game.PrepareSceneForVote(false)
        	game.clearCanvasTimers()
                game.chat.addText({
                        type: "SYSTEM",
                        message: "Çizilen kelime " + data.word + " idi."
                })

        })

        io.on("to-lobby", function(data){
        	game.gameState = "LOBBY"
        	game.clearCanvasTimers()
        	game.PrepareSceneForLobby()
        })

        io.on("vote-results", function(){
        	game.PrepreSceneForVoteResults()
        })

        io.on("chat-text", function(data){  	
        	game.chat.addText(data)
        })

        io.on("clear-response", function(data){

        	var canvasToClear

        	if(data.canvas == "L"){ canvasToClear = game.paintCanvasL }
        	else { canvasToClear = game.paintCanvasR }
        	canvasToClear.clear()

        })
	}


	emit(code, data){
		// To be used for logging in the future.
		this.io.emit(code, data)
	}
}