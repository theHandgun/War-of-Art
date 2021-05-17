class PaintScene extends Phaser.Scene{

	constructor() {
		super("PaintScene");
	}

	preload(){
		Button.preloadAll(this)
		Canvas.preload(this)
		PortraitManager.preloadAll(this)
		Toolbox.preload(this)
		Chat.preload(this)

		this.load.image("canvas", "PaintGame/Assets/Components/canvas.png")
		this.load.image("playersContainer", "PaintGame/Assets/Components/lobby.png")
	}

	init(data)
    {
    	var self = this

    	this.id = data.id
    	this.gameState = data.gameState
    	this.isHost = data.isHost
    	this.portrait = data.portrait
    	this.io = data.io
    	this.users = data.players

    	this.UserTextArr = []
    	this.PortraitArr = []

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

		this.paintCanvasDrawable = new Canvas(350, 100, 18, 0.42, 3, this.io, this, "M")
		this.paintCanvasDrawable.canPaint = true
		this.paintCanvasDrawable.setToolbox(new Toolbox(920, 350, this))


		this.chat = new Chat(400, 420, this)
		this.chat.setVisible(false)

		this.paintHeaderTxt = this.add.text(600,40, "Oyun kurucusunun oyunu başlatması bekleniyor.", { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF'})
		this.paintWord = this.add.text(600,70, "Araba", { fontFamily: 'Arial', fontSize: 26, color: '#FF0000', fontStyle: "bold"})

		this.paintHeaderTxt.setOrigin(0.5,0.5)
		this.paintHeaderTxt.setText("Oyun kurucusunun oyunu başlatması bekleniyor.")

		this.paintWord.setOrigin(0.5,0.5)
		this.paintWord.setText("")

		this.hostB = new Button("longButton", 610, 660, "Oyunu Başlat", this, function(){
			self.io.emit("start-game-request")
        })

        this.guessB = new Button("longButton", 645, 660, "Tahmin Yap", this, function(){
        	var guessWord = prompt()
			self.io.emit("guess-word", guessWord)
        })

        this.voteL = new Button("midButton", 475, 385, "Oy Ver", this, function(){
			self.io.emit("vote", "L")
			self.voteR.setInteractable(true)
			self.voteL.setInteractable(false)
        })

        this.voteR = new Button("midButton", 815, 385, "Oy Ver", this, function(){
			self.io.emit("vote", "R")
			self.voteR.setInteractable(false)
			self.voteL.setInteractable(true)
        })

        this.voteL.create()
        this.voteR.create()
		this.hostB.create()
		this.guessB.create()

		this.guessB.setVisible(false)
		this.hostB.setVisible(this.isHost || false)
        this.voteL.setVisible(false)
        this.voteR.setVisible(false)


		for(var i = 0; i < 12; i++){
			this.UserTextArr[i] = this.add.text(80, 50 + (i+1)*45.2, "", { fontFamily: 'Arial', fontSize: 20, color: '#00000'})
			this.UserTextArr[i].setOrigin(0)

			this.PortraitArr[i] = this.add.sprite(40, 88 + (i+i)*22.6, "")
			this.PortraitArr[i].visible = false
			this.PortraitArr[i].setOrigin(0, 0)
		}

		this.versusImageL = this.add.sprite(450, 200, "")
		this.versusImageL.visible = false

		this.versusImageR = this.add.sprite(830, 200, "")
		this.versusImageR.visible = false

		this.versusTextL = this.add.text(450, 350, "asds", {fontFamily: "Arial", fontSize: 30})
		this.versusTextL.visible = false
		this.versusTextL.setOrigin(0.5,0.5)

		this.versusTextR = this.add.text(830, 350, "adsds", {fontFamily: "Arial", fontSize: 30})
		this.versusTextR.visible = false
		this.versusTextR.setOrigin(0.5,0.5)

		this.versusTxt = this.add.text(630, 180, "VS", {fontFamily: "Arial", fontSize: 36, fontStyle:"bold"})
		this.versusTxt.visible = false

		this.UpdateUserList()
	}


	update(){

		this.IDText.setText("ID: " + this.id)

		this.paintCanvasL.update(this)
		this.paintCanvasR.update(this)
		this.paintCanvasDrawable.update(this)

	}

	PrepareSceneForDraw(word){
		this.showDrawBoard(true)

		this.paintHeaderTxt.setText("Çizmen Gereken Kelime")
		this.paintWord.setText(word)
		this.paintWord.visible = true
		this.paintHeaderTxt.visible = true
		this.hostB.setVisible(false)
		this.guessB.setVisible(false)
		this.chat.setVisible(false)
		this.versusImageR.visible = false
		this.versusImageL.visible = false
		this.clearCanvases()
	}

	PrepareSceneForVote(){
		this.showDrawBoard(false)
		this.paintHeaderTxt.visible = false
		this.paintWord.setText("")
		this.hostB.setVisible(false)
		this.guessB.setVisible(false)
		this.chat.setVisible(true)

		if(!this.isDrawing){
			this.voteL.setVisible(true)
	        this.voteR.setVisible(true)
	    }
	}

	PrepareSceneForVersus(data){
		this.paintCanvasDrawable.setVisible(false)
		this.paintCanvasL.setVisible(false)
		this.paintCanvasR.setVisible(false)
		this.chat.setVisible(true)
		this.paintHeaderTxt.setText("")
		this.hostB.setVisible(false)
		var drawingR = this.users.filter(usr => usr.nick == data.drawerR)[0]
		var drawingL = this.users.filter(usr => usr.nick == data.drawerL)[0]
		
		this.versusImageR.setTexture(drawingR.portrait)
		this.versusImageL.setTexture(drawingL.portrait)
		this.versusTextR.setText(drawingR.nick)
		this.versusTextL.setText(drawingL.nick)

		this.versusImageL.displayHeight = 250
		this.versusImageR.displayHeight = 250
		this.versusImageR.scaleX = this.versusImageR.scaleY
		this.versusImageL.scaleX = this.versusImageR.scaleY
		this.versusImageL.displayWidth = 250
		this.versusImageR.displayWidth = 250

		this.chat.addText({
			type: "SYSTEM",
			message: drawingL.nick + " ve " + drawingR.nick + " çiziyor."
		})
		// TOOD: Add text to chat.
		this.setVersusScreenVisible(true)
	}

	PrepareSceneForGuess(canGuess){
		this.showDrawBoard(false)
		this.paintHeaderTxt.visible = false
		this.hostB.setVisible(false)
		this.paintWord.setText("")
		this.guessB.setVisible(canGuess || true)
		this.chat.setVisible(true)
		this.setVersusScreenVisible(false)
		this.clearCanvases()
	}

	PrepareSceneForLobby(){
		this.showDrawBoard(true)

		this.paintHeaderTxt.visible = true
		this.paintHeaderTxt.setText("Oyun kurucusunun oyunu başlatması bekleniyor.")
		this.paintWord.setText("")
		this.hostB.setVisible(this.isHost)

		this.guessB.setVisible(false)
		this.voteL.setVisible(false)
        this.voteR.setVisible(false)
		this.chat.setVisible(false)

        this.clearCanvasTimers()
		this.clearCanvases()	

	}

	PrepareSceneForWait(){
		this.showDrawBoard(true)
		this.paintHeaderTxt.setText("Sıradaki tura girmek için lütfen bekle.")
		this.paintWord.setText("")
		this.guessB.setVisible(false)
		this.clearCanvases()
	}

	PrepreSceneForVoteResults(votersData){
		this.voteL.setVisible(false)
		this.voteR.setVisible(false)
		this.voteL.setInteractable(true)
		this.voteR.setInteractable(true)
		this.chat.setVisible(true)
	}

	showDrawBoard(isDrawing){
		this.paintCanvasDrawable.setVisible(isDrawing)
		this.paintCanvasL.setVisible(!isDrawing)
		this.paintCanvasR.setVisible(!isDrawing)
	}

	clearCanvases(){
		this.paintCanvasDrawable.clear()
		this.paintCanvasL.clear()
		this.paintCanvasR.clear()
	}

	clearCanvasTimers(){
		this.paintCanvasL.setTimerText("")
        this.paintCanvasR.setTimerText("")
        this.paintCanvasDrawable.setTimerText("")
	}

	setVersusScreenVisible(isVisible){
		this.versusImageR.visible = isVisible
		this.versusImageL.visible = isVisible
		this.versusTxt.visible = isVisible
		this.versusTextR.visible = isVisible
		this.versusTextL.visible = isVisible
	}

	UpdateUserList(){
		for(var i = 0; i < 12; i++){
			if(this.users[i] != null){
				this.UserTextArr[i].setText(this.users[i].nick + ": " + this.users[i].points)
				this.PortraitArr[i].setTexture(this.users[i].portrait)
				this.PortraitArr[i].visible = true
				this.PortraitArr[i].scaleY = this.PortraitArr[i].scaleX
				this.PortraitArr[i].displayHeight = 36
				this.PortraitArr[i].displayWidth = 36
			}
			else{
				this.UserTextArr[i].setText("")
				this.PortraitArr[i].visible = false
			}
		}
	}


	SocketEvents(io, self){

        io.on("refresh-users", function(data){
        	self.users = data
        	self.UpdateUserList()
        })

        io.on("new-host", function(data){
        	if(data.nick == self.registry.get("nick")){
        		self.isHost = true

        		if(self.gameState == "LOBBY"){
        			self.PrepareSceneForLobby()
        		}
        	}
        	else{
        		self.isHost = false
        		self.hostB.setVisible(false)
        	}
        })

        io.on("starting-soon", function(data){
        	self.PrepareSceneForVersus(data)
        })

        io.on("started-round", function(data){
        	self.isDrawing = false
        	self.PrepareSceneForGuess()
        })

        io.on("selected-painter", function(data){
        	self.isDrawing = true
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
        	self.PrepareSceneForVote(false)
        	self.clearCanvasTimers()

        })

        io.on("to-lobby", function(data){
        	self.gameState = "LOBBY"
        	self.clearCanvasTimers()
        	self.PrepareSceneForLobby()
        })

        io.on("vote-results", function(){
        	self.PrepreSceneForVoteResults()
        })

        io.on("chat-text", function(data){
        	// TODO: Don't send data from server in the first place. Or maybe let it send.
        	self.chat.addText(data)
        })
	}
}