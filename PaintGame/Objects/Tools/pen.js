class PenTool{
	constructor(game){
		this.game = game
		this.gamePointer = game.input.activePointer

	}

	create(game, spriteScale, mask){
		this.eraserMarker = game.add.rectangle(0, 0, 8/spriteScale, 8/spriteScale, 0xC0C0C0)
		this.eraserMarker.visible = false
		this.eraserMarker.setMask(mask)
	}

	update(targetCanvas, drawColor){
		
	  	if(!targetCanvas.canPaint || !targetCanvas.isVisible())
	  	{
	  		this.OldMouseX = null
	  		this.OldMouseY = null
	  		return
	  	}


		if(targetCanvas.canvas.mouseOverCanvas){

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
					color: drawColor
				}
			if(this.gamePointer.leftButtonDown()){
				targetCanvas.sendPaintMsg(this.OldMouseX, this.OldMouseY, pointerX, pointerY, drawColor)
				targetCanvas.paint(data)
			}
			else if(this.gamePointer.rightButtonDown()){
				this.eraserMarker.x = pointerX
				this.eraserMarker.y = pointerY
				this.eraserMarker.visible = true

				targetCanvas.sendEraseMsg(pointerX, pointerY)
				targetCanvas.erase(data)
			}
			else{
				this.eraserMarker.visible = false
			}
		}

		

		this.OldMouseX = pointerX;
		this.OldMouseY = pointerY;
	}
}