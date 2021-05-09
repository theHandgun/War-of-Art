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
    	
        this.io = io("ws://localhost:3000", {transports : ["websocket"]});

        this.SocketEvents(this.io, self)
        
    }

	create(){

		var self = this


		this.IDText = this.add.text(10,20, "ID: " + this.id);



		this.playerBox = this.add.sprite(110, 355,"playersContainer")
		this.playerBox.setScale(0.35)

		this.paintCanvasR = new Canvas(655, 35, 11.1, 0.26, 1, this.io, this, "R")
		this.paintCanvasL = new Canvas(315, 35, 11.1, 0.26, 1, this.io, this, "L")
		this.paintCanvasDrawable = new Canvas(350, 117, 18, 0.42, 2, this.io, this, "M")

		this.paintCanvasDrawable.canPaint = true

		this.drawB = new Button("smallButton", 270, 480, "D", this, function(){
        	self.PrepareSceneForDraw()
        })

        this.guessB = new Button("smallButton", 270, 580, "G", this, function(){
        	self.PrepareSceneForGuess()
        })

		this.guessB.create()
		this.drawB.create()

		this.PrepareSceneForDraw(this.graphics)


		

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

	PrepareSceneForDraw(){
		this.paintCanvasDrawable.setVisible(true)
		this.paintCanvasL.setVisible(false)
		this.paintCanvasR.setVisible(false)
	}

	PrepareSceneForGuess(){

		this.paintCanvasDrawable.setVisible(false)
		this.paintCanvasL.setVisible(true)
		this.paintCanvasR.setVisible(true)
	}

	clear(){
		this.graphics.clear()
	}


	SocketEvents(io, self){

		io.on("connect", function(socket){
        	this.emit("attemptJoin", {nick: self.registry.get("nickname")})
        })

        io.on("accepted", function(data){
        	
        	self.users = data.users
        	self.id = data.id
        })

        io.on("rejected", function(data){
        	alert(data)
        	self.scene.start("MainScene")
        })

        io.on("refreshUsers", function(data){
        	self.users = data
        })

        io.on("newHost", function(data){

        })

        io.on("paint-response", function(data)
        {
        	var canvasToPaint

        	if(data.canvas == "L"){ canvasToPaint = self.paintCanvasL }
        	else if(data.canvas == "R"){ canvasToPaint = self.paintCanvasR}
        	else if(data.canvas == "M") {canvasToPaint = self.paintCanvasDrawable}

        	if(data.scaleFrom == "M"){
        		canvasToPaint.paintScaled(data, self.paintCanvasDrawable)
        	}
        	else{
        		self.paintCanvasDrawable.paint(data)
        	}

        })
	}
}