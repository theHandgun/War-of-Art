
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

		this.eraserMarker = game.add.rectangle(0, 0, 8/this.spriteScale, 8/this.spriteScale, 0xC0C0C0)
		this.eraserMarker.visible = false
		this.eraserMarker.setMask(this.graphicsMask)

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


		if(this.canvas.mouseOverCanvas){
			var data = {
					xPos: this.OldMouseX, 
					yPos: this.OldMouseY, 
					endX: pointerX, 
					endY: pointerY,
					color: this.toolboxObj.color
				}
			if(pointer.leftButtonDown()){
				this.sendPaintMsg(this.OldMouseX, this.OldMouseY, pointerX, pointerY, this.toolboxObj.color)
				this.paint(data)
			}
			else if(pointer.rightButtonDown()){
				this.eraserMarker.x = pointerX
				this.eraserMarker.y = pointerY
				this.eraserMarker.visible = true

				this.sendEraseMsg(pointerX, pointerY)
				this.erase(data)
			}
			else{
				this.eraserMarker.visible = false
			}
		}

		

		this.OldMouseX = pointerX;
		this.OldMouseY = pointerY;
	}

	sendPaintMsg(xPos, yPos, endX, endY, color, isErase){
		this.io.emit("paint", {xPos:xPos, yPos:yPos, endX: endX, endY: endY, color: color, isErase: isErase})
	}

	sendEraseMsg(xPos, yPos){
		this.io.emit("paint", {xPos: xPos, yPos: yPos, isErase: true})
	}

	// Reached from outside by toolbox.js
	sendClearMsg(){
		this.io.emit("clear-canvas")
		this.clear()
	}

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

	paintScaled(data, canvasObj, isErase){

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
			color: data.color
		}

		if(!data.isErase){
			this.paint(paintData)
		}
		else{
			this.erase(paintData, scaleAmount)
		}
		
	}

	clear(){
		this.graphics.clear()
		var color = (this.toolboxObj) ? this.toolboxObj.color:0x000000
		this.graphics.lineStyle(this.graphicsScale, color, 1);
		this.graphics.fillStyle(0xFFFFFF, 1);
	}

	paint(data){
		this.graphics.lineStyle(this.graphicsScale, data.color, 1);
		this.graphics.beginPath()
		this.graphics.moveTo(data.xPos, data.yPos)
		this.graphics.lineTo(data.endX, data.endY)
		this.graphics.closePath()
		this.graphics.strokePath()
		
	}

	erase(data, scaleAmount){
		var scaleAmount = scaleAmount || 1
		this.graphics.fillRect(data.xPos - (10/scaleAmount), data.yPos - (10/scaleAmount), 20/scaleAmount, 20/scaleAmount);
	}

	getDistance(data){
		var dx = data.xPos - data.endX;
    	var dy = data.yPos - data.endY;
    	return Math.sqrt(dx * dx + dy * dy);
	}

	static preload(game){
  		game.load.image("canvas", "PaintGame/Assets/Components/canvas.png")
  	}
}