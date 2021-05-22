class PenTool{
	constructor(game){
		this.game = game
		this.gamePointer = game.input.activePointer
		this.paintManager = game.paintManager
	}

	create(game, canvas, mask){
		this.connectedCanvas = canvas
		this.eraserMarker = game.add.rectangle(0, 0, 8/canvas.spriteScale, 8/canvas.spriteScale, 0xC0C0C0)
		this.eraserMarker.visible = false
		this.eraserMarker.setMask(mask)
	}

	update(drawColor){
		
	  	if(!this.connectedCanvas.canPaint || !this.connectedCanvas.isVisible())
	  	{
	  		this.OldMouseX = null
	  		this.OldMouseY = null
	  		return
	  	}


		if(this.connectedCanvas.canvas.mouseOverCanvas){

			var pointerX = this.game.input.x;
			var pointerY = this.game.input.y;

			if(this.OldMouseX == null){
				this.OldMouseX = pointerX;
				this.OldMouseY = pointerY;
			}

			var data = {
					xPos: this.OldMouseX, 
					yPos: this.OldMouseY, 
					endX: pointerX, 
					endY: pointerY,
					color: drawColor,
					tool: "pen"
				}
			if(this.gamePointer.leftButtonDown()){
				this.sendPaintMsg(this.OldMouseX, this.OldMouseY, pointerX, pointerY, drawColor)
				this.paintManager.paint(data, this.paintManager.mainCanvas)
			}
			else if(this.gamePointer.rightButtonDown()){
				this.eraserMarker.x = pointerX
				this.eraserMarker.y = pointerY
				this.eraserMarker.visible = true

				this.sendEraseMsg(data.endX, data.endY)
				this.paintManager.erase(data, this.paintManager.mainCanvas)
			}
			else{
				this.eraserMarker.visible = false
			}
		}

		this.OldMouseX = pointerX;
		this.OldMouseY = pointerY;
	}

	// Might merge these two in the future.
	sendEraseMsg(xPos, yPos){
		this.game.networkManager.emit("paint", {xPos: xPos, yPos: yPos, tool: "eraser"})
	}

	sendPaintMsg(xPos, yPos, endX, endY, color, tool){
		this.game.networkManager.emit("paint", {xPos:xPos, yPos:yPos, endX: endX, endY: endY, color: color, tool: "pen"})
	}
	// ----
}