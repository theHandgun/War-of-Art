
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
			x2: (self.xPos + self.canvas.displayWidth - self.drawMargin),
			y1: (self.yPos + self.drawMargin - 3),
			y2: (self.yPos + self.canvas.displayHeight - self.drawMargin - 2)
		}

		this.graphics = game.add.graphics();
		this.graphics.lineStyle(this.graphicsScale, 0xFF3300, 1);
		
		this.canvas.timer = game.add.text(this.xPos + this.canvas.displayWidth/2, this.yPos + this.canvas.displayHeight/2, "", {fontFamily: "Arial", fontSize: 82, color: "#000000"})
		this.canvas.timer.setOrigin(0.5, 0.5)
		this.canvas.timer.alpha = 0.4

		this.setVisible(true)
	}

	update(game){
		var pointer = game.input.activePointer;


	  	if(!this.canPaint || !this.canvas.visible)
	  	{
	  		this.OldMouseX = null
	  		this.OldMouseY = null
	  		return
	  	}

		var pointerX = game.input.x;
		var pointerY = game.input.y;

		if(this.OldMouseX == null){
			this.OldMouseX = pointerX;
			this.OldMouseY = pointerY;
		}

		var deltaX = pointerX - this.OldMouseX;
		var deltaY = pointerY - this.OldMouseY;


		if(pointer.leftButtonDown() && this.canvas.mouseOverCanvas){

			if(this.OldMouseX > this.limits.x2){ this.OldMouseX = this.limits.x2 - 1}
			if(this.OldMouseX < this.limits.x1){ this.OldMouseX = this.limits.x1 + 1}
			if(this.OldMouseY > this.limits.y2){ this.OldMouseY = this.limits.y2 - 1}
			if(this.OldMouseY < this.limits.y1){ this.OldMouseY = this.limits.y1 + 1}

			if(pointerX > this.limits.x2){ pointerX = this.limits.x2 - 1}
			if(pointerX < this.limits.x1){ pointerX = this.limits.x1 + 1}
			if(pointerY > this.limits.y2){ pointerY = this.limits.y2 - 1}
			if(pointerY < this.limits.y1){ pointerY = this.limits.y1 + 1}

			this.sendPaintMsg(this.OldMouseX, this.OldMouseY, pointerX, pointerY)
			this.paint({
				xPos: this.OldMouseX, 
				yPos: this.OldMouseY, 
				endX: pointerX, 
				endY: pointerY
			})
		}

			this.OldMouseX = pointerX;
			this.OldMouseY = pointerY;
	}

	sendPaintMsg(_xPos, _yPos, _endX, _endY){
		this.io.emit("paint", {xPos:_xPos, yPos:_yPos, endX: _endX, endY: _endY})
	}

	setVisible(isVisible){
		this.canvas.visible = isVisible
		this.graphics.visible = isVisible
		this.canvas.timer.visible = isVisible
	}

	setTimerText(time){
		this.canvas.timer.setText(time)
		this.graphics.lineStyle(this.graphicsScale, 0xFF3300, 1);
	}

	paintScaled(posData, canvasObj){

		var scaleAmount = canvasObj.spriteScale / this.spriteScale

		var x = (posData.xPos - canvasObj.canvas.x) / scaleAmount
		var y = (posData.yPos - canvasObj.canvas.y) / scaleAmount
		var x2 = (posData.endX - canvasObj.canvas.x) / scaleAmount
		var y2 = (posData.endY - canvasObj.canvas.y) / scaleAmount

		var paintData = {
			xPos: this.canvas.x + x,
			yPos: this.canvas.y + y,
			endX: this.canvas.x + x2,
			endY: this.canvas.y + y2
		}

		this.paint(paintData)

	}

	clear(){
		this.graphics.clear()
	}

	paint(data){
		this.graphics.beginPath()
		this.graphics.moveTo(data.xPos, data.yPos)
		this.graphics.lineTo(data.endX, data.endY)
		this.graphics.closePath()
		this.graphics.strokePath()
	}


	static preload(game){
  		game.load.image("canvas", "PaintGame/Assets/Components/canvas.png")
  	}
}