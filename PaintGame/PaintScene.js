class PaintScene extends Phaser.Scene{

	constructor() {
		super("PaintScene");
	}

	preload(){
		Button.preloadAll(this)
		Canvas.preload(this)

		this.load.image("canvas", "PaintGame/Assets/Components/canvas.png")
		this.load.image("playersContainer", "PaintGame/Assets/Components/lobby.png")
	}

	init()
    {
    	var self = this

    	this.users = 0	
    	this.UserTextArr = []
    	this.isHost = false
    	this.loaded = false

        this.io = io("ws://localhost:3000", {transports : ["websocket"]});

        this.SocketEvents(this.io, this)
        
    }

	create(){

		var self = this


		this.IDText = this.add.text(10,20, "ID: " + this.id);



		this.playerBox = this.add.sprite(110, 355,"playersContainer")
		this.playerBox.setScale(0.35)

		this.paintCanvasR = new Canvas(655, 35, 11.1, 0.26, 1, this.io, this, "R")
		this.paintCanvasL = new Canvas(315, 35, 11.1, 0.26, 1, this.io, this, "L")

		this.paintCanvasL.setVisible(false)
		this.paintCanvasR.setVisible(false)

		this.paintCanvasDrawable = new Canvas(350, 100, 18, 0.42, 2, this.io, this, "M")
		this.paintCanvasDrawable.canPaint = true



		this.paintHeaderTxt = this.add.text(600,40, "Oyun kurucusunun oyunu başlatması bekleniyor.", { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF'})
		this.paintWord = this.add.text(600,70, "Araba", { fontFamily: 'Arial', fontSize: 26, color: '#FF0000', fontStyle: "bold"})

		this.paintHeaderTxt.setOrigin(0.5,0.5)
		this.paintHeaderTxt.setText("Oyun kurucusunun oyunu başlatması bekleniyor.")

		this.paintWord.setOrigin(0.5,0.5)
		this.paintWord.setText("")

	


		this.hostB = new Button("longButton", 610, 660, "Oyunu Başlat", this, function(){
			self.io.emit("start-game-request")
        })

        this.guessB = new Button("longButton", 610, 660, "Tahmin Yap", this, function(){
			self.io.emit("guess-word", prompt())
        })

		this.hostB.create()
		this.guessB.create()

		this.guessB.setVisible(false)
		console.log(this.isHost)
		this.hostB.setVisible(this.isHost || false)
		this.loaded = true
        

		for(var i = 0; i < 12; i++){
			this.UserTextArr[i] = this.add.text(45, 50 + (i+1)*45.2, "Empty", { fontFamily: 'Arial', fontSize: 20, color: '#00000'})
			this.UserTextArr[i].setOrigin(0)
		}

	}


	update(){

		this.IDText.setText("ID: " + this.id)

		this.paintCanvasL.update(this)
		this.paintCanvasR.update(this)
		this.paintCanvasDrawable.update(this)

		for(var i = 0; i < 12; i++){
			if(this.users[i] != null){
				this.UserTextArr[i].setText(this.users[i].nick + ": " + this.users[i].points)
			}
			else{
				this.UserTextArr[i].setText("")
			}
		}
	}

	PrepareSceneForDraw(word){
		this.ShowDrawBoard(true)

		this.paintHeaderTxt.setText("Çizmen Gereken Kelime")
		this.paintWord.setText(word)
		this.paintWord.visible = true
		this.paintHeaderTxt.visible = true
		this.hostB.setVisible(false)
		this.guessB.setVisible(false)
	}

	PrepareSceneForGuess(canGuess){
		this.ShowDrawBoard(false)
		this.paintHeaderTxt.visible = false
		this.hostB.setVisible(false)
		this.paintWord.setText("")
		this.guessB.setVisible(canGuess || true)
	}

	PrepareSceneForLobby(){
		this.ShowDrawBoard(true)

		this.paintHeaderTxt.visible = true
		this.paintHeaderTxt.setText("Oyun kurucusunun oyunu başlatması bekleniyor.")
		this.paintWord.setText("")
		this.hostB.setVisible(this.isHost)
		this.guessB.setVisible(false)
		
	}

	PrepareSceneForWait(){
		this.ShowDrawBoard(true)
		this.paintHeaderTxt.setText("Sıradaki tura girmek için lütfen bekle.")
		this.paintWord.setText("")
		this.guessB.setVisible(false)
	}

	ShowDrawBoard(isDrawing){
		this.paintCanvasDrawable.setVisible(isDrawing)
		this.paintCanvasL.setVisible(!isDrawing)
		this.paintCanvasR.setVisible(!isDrawing)
	}

	clear(){
		this.graphics.clear()
	}


	SocketEvents(io, self){

		io.on("connect", function(socket){
        	this.emit("attemptJoin", {nick: self.registry.get("nickname")})
        })

        io.on("accepted", function(data){

        	self.id = data.id
        	self.gameState = data.gameState
        	self.isHost = data.isHost
        	console.log("accepted: " + self.isHost)

        	if(self.loaded){
        		self.hostB.setVisible(self.isHost)
        	}

        })

        io.on("rejected", function(data){
        	//self.scene.start("MainScene")
        	alert(data)
        })

        io.on("refreshUsers", function(data){
        	self.users = data
        })

        io.on("newHost", function(data){
        	if(data.nick == self.registry.get("nickname")){
        		self.isHost = true

        		if(self.gameState == "LOBBY" && self.loaded){
        			self.PrepareSceneForLobby()
        		}
        	}
        	else{
        		self.isHost = false
        		self.hostB.setVisible(false)
        	}
        })

        io.on("newRound", function(data){
        	self.PrepareSceneForGuess()
        })

        io.on("selected-painter", function(data){
        	self.PrepareSceneForDraw(data)
        })

        io.on("paint-response", function(data)
        {
        	var canvasToPaint

        	if(data.canvas == "L"){ canvasToPaint = self.paintCanvasL }
        	else { canvasToPaint = self.paintCanvasR }

        	canvasToPaint.paintScaled(data, self.paintCanvasDrawable)

        })

        io.on("guessed-correct", function(){
        	self.guessB.setVisible(false)
        	alert("Doğru bildin, +10 puan")
        })

        io.on("cancel-round", function(data){
        	self.PrepareSceneForLobby()
        	alert(data)
        })

        io.on("new-time", function(data){
        	self.paintCanvasDrawable.setTimerText(data)
        	self.paintCanvasR.setTimerText(data)
        	self.paintCanvasL.setTimerText(data)
        })

        io.on("time-up", function(data){
        	self.gameState = "EPIL-LOBBY"
        	self.PrepareSceneForGuess(false)
        })

        io.on("to-lobby", function(data){
        	self.gameState = "LOBBY"
        	
        	self.paintCanvasDrawable.clear()
        	self.paintCanvasR.clear()
        	self.paintCanvasL.clear()

        	self.PrepareSceneForLobby()

        })
	}
}