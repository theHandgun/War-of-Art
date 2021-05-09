
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
	}

	update(game){

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


		if(game.input.activePointer.isDown && this.canvas.mouseOverCanvas){

			if(this.OldMouseX > this.limits.x2){ this.OldMouseX = this.limits.x2 - 1}
			if(this.OldMouseX < this.limits.x1){ this.OldMouseX = this.limits.x1 + 1}
			if(this.OldMouseY > this.limits.y2){ this.OldMouseY = this.limits.y2 - 1}
			if(this.OldMouseY < this.limits.y1){ this.OldMouseY = this.limits.y1 + 1}

			if(pointerX > this.limits.x2){ pointerX = this.limits.x2 - 1}
			if(pointerX < this.limits.x1){ pointerX = this.limits.x1 + 1}
			if(pointerY > this.limits.y2){ pointerY = this.limits.y2 - 1}
			if(pointerY < this.limits.y1){ pointerY = this.limits.y1 + 1}

			this.SendPaintMsg(this.OldMouseX, this.OldMouseY, pointerX, pointerY)
		}

			this.OldMouseX = pointerX;
			this.OldMouseY = pointerY;
	}

	SendPaintMsg(_xPos, _yPos, _endX, _endY){
		this.io.emit("paint", {xPos:_xPos, yPos:_yPos, endX: _endX, endY: _endY, id: this.id })
	}

	SetVisible(isVisible){
		this.canvas.visible = isVisible
		this.graphics.visible = isVisible
	}

	Paint(data){
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