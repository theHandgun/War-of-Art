
class Canvas {

	constructor(xPos, yPos, drawMargin, spriteScale, graphicsScale, io, game, id) { 
	    this.xPos = xPos
	    this.yPos = yPos

	    this.drawMargin = drawMargin

	    this.spriteScale = spriteScale
	    this.graphicsScale = graphicsScale

	    this.io = io
	    this.id = id

	    this.canPaint = false
	    this.color = 0x000000

	    this.game = game

	    this.create(game)

	}

	create(game){
	  	var self = this

		this.canvas = game.add.sprite(this.xPos, this.yPos, "canvas").setInteractive()
		this.canvas.setOrigin(0,0)
		this.canvas.setScale(this.spriteScale)
	
		this.canvas.on("pointerover",function(pointer){
	    	this.mouseOverCanvas = true;
		});

		this.canvas.on("pointerout",function(pointer){
	    	this.mouseOverCanvas = false;
		});

		this.limits ={
			x1: (self.xPos + self.drawMargin),
			x2: (self.canvas.displayWidth - self.drawMargin * 2),
			y1: (self.yPos + self.drawMargin - 4),
			y2: (self.canvas.displayHeight - (self.drawMargin * 2) + 1)
		}

		this.graphics = game.add.graphics()
		this.graphics.fillStyle(0xFFFFFF, 1);

		this.graphicsZone = game.make.graphics()
		this.graphicsZone.fillRoundedRect(self.limits.x1, self.limits.y1, self.limits.x2, self.limits.y2, 10)

		this.graphicsMask = new Phaser.Display.Masks.GeometryMask(game, this.graphicsZone);

		this.graphics.setMask(this.graphicsMask)

		this.canvas.timer = game.add.text(this.xPos + this.canvas.displayWidth/2, this.yPos + this.canvas.displayHeight/2, "", {fontFamily: "Arial", fontSize: 82, color: "#000000"})
		this.canvas.timer.setOrigin(0.5, 0.5)
		this.canvas.timer.alpha = 0.4

		this.setVisible(true)
	}


	// TODO: Move this method to somewhere better.
	sendClearMsg(){
		self.networkManager.emit("clear-canvas")
		this.clear()
	}
	// ---


	setVisible(isVisible){
		this.canvas.visible = isVisible
		this.graphics.visible = isVisible
		this.canvas.timer.visible = isVisible
		
		if(this.toolboxObj)
			this.toolboxObj.setVisible(isVisible)

		if(this.toolboxObj != null)
		{
			this.toolboxObj.toolbox.visible = isVisible
		}
	}

	setToolbox(toolboxObject){
		this.toolboxObj = toolboxObject
	}

	setTimerText(time){
		this.canvas.timer.setText(time)
	}

	getScaledData(data, canvasObj){

		var scaleAmount = canvasObj.spriteScale / this.spriteScale

		var x = (data.xPos - canvasObj.canvas.x) / scaleAmount
		var y = (data.yPos - canvasObj.canvas.y) / scaleAmount
		var x2 = (data.endX - canvasObj.canvas.x) / scaleAmount
		var y2 = (data.endY - canvasObj.canvas.y) / scaleAmount

		var paintData = {
			xPos: this.canvas.x + x,
			yPos: this.canvas.y + y,
			endX: this.canvas.x + x2,
			endY: this.canvas.y + y2,
			color: data.color,
			scaleAmount: scaleAmount

		}

		return paintData
		
	}

	clear(){
		this.graphics.clear()
		var color = (this.toolboxObj) ? this.toolboxObj.color:0x000000
		this.graphics.lineStyle(this.graphicsScale, color, 1);
		this.graphics.fillStyle(0xFFFFFF, 1);
	}



	getDistance(data){
		var dx = data.xPos - data.endX;
    	var dy = data.yPos - data.endY;
    	return Math.sqrt(dx * dx + dy * dy);
	}

	isVisible(){
		return this.canvas.visible
	}

	static preload(game){
  		game.load.image("canvas", "PaintGame/Assets/Components/canvas.png")
  	}
}