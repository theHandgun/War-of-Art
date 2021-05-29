
class Canvas {

	constructor(xPos, yPos, drawMargin, spriteScale, graphicsScale, io, game, id) { 
	    this.xPos = xPos
	    this.yPos = yPos

	    this.drawMargin = drawMargin

	    this.spriteScale = spriteScale
	    this.graphicsScale = graphicsScale

	    this.io = io
	    this.id = id
	    this.textureID = id + "_CanvasTexture"

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

		this.limits = {
			x1: (self.xPos + self.drawMargin),
			w: (self.canvas.displayWidth - self.drawMargin * 2),
			y1: (self.yPos + self.drawMargin - 4),
			h: (self.canvas.displayHeight - (self.drawMargin * 2) + 1)
		}

	  	this.bgSprite = game.add.sprite(0, 0, this.textureID).setOrigin(0,0)

		this.graphics = game.add.graphics()
		this.graphics.fillStyle(0xFFFFFF, 1);
		// Background color.
		this.graphics.fillRect(0, 0,  this.game.sys.game.canvas.width, this.game.sys.game.canvas.height);

		this.graphicsZone = game.make.graphics()
		this.graphicsZone.fillRoundedRect(this.limits.x1, this.limits.y1, this.limits.w, this.limits.h, 10)

		this.graphicsMask = new Phaser.Display.Masks.GeometryMask(game, this.graphicsZone);

		this.graphics.setMask(this.graphicsMask)
        this.bgSprite.setMask(this.graphicsMask)

		this.canvas.timer = game.add.text(this.xPos + this.canvas.displayWidth/2, this.yPos + this.canvas.displayHeight/2, "", {fontFamily: "Arial", fontSize: 82, color: "#000000"})
		this.canvas.timer.setOrigin(0.5, 0.5)
		this.canvas.timer.alpha = 0.4

		this.setVisible(true)
	}


	// TODO: Move this method to somewhere better.
	sendClearMsg(nwManger){
		nwManger.emit("clear-canvas")
		this.clear()
	}
	// ---


	setVisible(isVisible){
		this.canvas.visible = isVisible
		this.graphics.visible = isVisible
		this.canvas.timer.visible = isVisible
		this.bgSprite.visible = isVisible
		
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
		this.clearBGTexture()
		var color = (this.toolboxObj) ? this.toolboxObj.color:0x000000
		this.graphics.lineStyle(this.graphicsScale, color, 1);
		this.graphics.fillStyle(0xFFFFFF, 1);
	}

	clearBGTexture(){
		//Change canvas texture to plain white.
		var texture = this.game.textures.get(this.textureID)
        var imageData = texture.getData(0, 0, texture.width, texture.height)
        var pixelData = imageData.data;
        for (var i=0; i < pixelData.length; i++) {
        	pixelData[i] = 255
	       	pixelData[i + 1] = 255
	        pixelData[i + 2] = 255
	       	pixelData[i + 3] = 255
	       	i += 3	
        }	

        texture.putData(imageData, 0,0);
        texture.refresh()
	}



	getDistance(data){
		var dx = data.xPos - data.endX;
    	var dy = data.yPos - data.endY;
    	return Math.sqrt(dx * dx + dy * dy);
	}

	isVisible(){
		return this.canvas.visible
	}

	isMouseOver(x, y){
		if(x < this.limits.x1 || x > this.limits.x1 + this.limits.w || y < this.limits.y1 || y > this.limits.y1 + this.limits.w)
			return false
		return true
	}

	static preload(game){
  		game.load.image("canvas", "PaintGame/Assets/Components/canvas.png")
  	}
}