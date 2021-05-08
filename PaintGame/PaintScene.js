class PaintScene extends Phaser.Scene{

	constructor() {
		super("PaintScene");
	}

	preload(){
		Button.preloadAll(this)

		this.load.image("canvas", "PaintGame/Assets/Components/canvas.png")
		this.load.image("playersContainer", "PaintGame/Assets/Components/lobby.png")
	}

	init(data)
    {
    	var self = this
    	console.log(data)
    	console.log(data.id)

    	var self = this
    	this.users = 0

        this.io = io("http://localhost:3000", {transports : ["websocket"] });
        this.SocketEvents(this.io, self)
        
    }

	create(){

		var self = this


		this.IDText = this.add.text(10,20, "ID: " + this.id);
		this.UserTextArr = []


		this.playerBox = this.add.sprite(120, 355,"playersContainer")
		this.playerBox.setScale(0.35)

		this.paintCanvas2 = this.add.sprite(810, 230, "canvas").setInteractive();
		this.paintCanvas2.setScale(0.26)

		this.paintCanvas1 = this.add.sprite(470, 230, "canvas").setInteractive();
		this.paintCanvas1.setScale(0.26)

		this.paintCanvasDrawable = this.add.sprite(620, 380, "canvas").setInteractive();
		this.paintCanvasDrawable.setScale(0.42)

		this.graphics = this.add.graphics();
		this.graphics.lineStyle(2, 0xFF3300, 1);

		this.drawB = new Button("smallButton", 250,600, "D", this, function(){
        	self.PrepareSceneForDraw(self.graphics)
        })

        this.guessB = new Button("smallButton", 250,500, "G", this, function(){
        	self.PrepareSceneForGuess(self.graphics)
        })

		this.guessB.create()
		this.drawB.create()

		this.PrepareSceneForDraw(this.graphics)

		this.paintCanvasDrawable.on("pointerover",function(pointer){
    		this.mouseOverCanvas = true;
		});

		this.paintCanvasDrawable.on("pointerout",function(pointer){
    		this.mouseOverCanvas = false;
		});



		this.io.on("paint-response", function(data){self.Paint(data, self.graphics)})

		for(var i = 0; i < 12; i++){
			this.UserTextArr[i] = this.add.text(45, 50 + (i+1)*45.2, "Empty", { fontFamily: 'Arial', fontSize: 20, color: '#00000'})
			this.UserTextArr[i].setOrigin(0)
		}
		
	}


	update(){
		
		let pointerX = this.input.x;
		let pointerY = this.input.y;

		if(this.OldMouseX == null){
			this.OldMouseX = pointerX;
			this.OldMouseY = pointerY;
		}

		let deltaX = pointerX - this.OldMouseX;
		let deltaY = pointerY - this.OldMouseY;


		if(game.input.activePointer.isDown && this.paintCanvasDrawable.visible && this.paintCanvasDrawable.mouseOverCanvas){

			if(this.OldMouseX > 860){ this.OldMouseX = 859;}
			if(this.OldMouseX < 382){ this.OldMouseX = 381;}
			if(this.OldMouseY > 617){ this.OldMouseY = 616;}
			if(this.OldMouseY < 140){ this.OldMouseY = 141;}

			if(pointerX > 860){ pointerX = 859;}
			if(pointerX < 382){ pointerX = 381;}
			if(pointerY > 617){ pointerY = 616;}
			if(pointerY < 140){ pointerY = 141;}

			this.SendPaintMsg(this.OldMouseX, this.OldMouseY, pointerX, pointerY)
		}

			this.OldMouseX = pointerX;
			this.OldMouseY = pointerY;


		for(var i = 0; i < 12; i++){
			if(this.users[i] != null){
				this.UserTextArr[i].setText(this.users[i].nick + ": " + this.users[i].points)
			}
			else{
				this.UserTextArr[i].setText("")
			}
		}
	}

	PrepareSceneForDraw(graphics){
		this.paintCanvasDrawable.visible = true
		this.paintCanvas1.visible = false
		this.paintCanvas2.visible = false
		graphics.visible = true
	}

	PrepareSceneForGuess(graphics){
		this.paintCanvasDrawable.visible = false
		this.paintCanvas1.visible = true
		this.paintCanvas2.visible = true
		graphics.visible = false
	}

	Paint(data, graphics){
		graphics.beginPath()
		graphics.moveTo(data.xPos, data.yPos)
		graphics.lineTo(data.endX, data.endY)
		graphics.closePath()
		graphics.strokePath()
	}

	SendPaintMsg(_xPos, _yPos, _endX, _endY){
		this.io.emit("paint", {xPos:_xPos, yPos:_yPos, endX: _endX, endY: _endY })
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
	}
}