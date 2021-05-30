class PenTool{
	constructor(game){
		this.game = game
		this.gamePointer = game.input.activePointer
		this.paintManager = game.paintManager
	}

	create(game, canvas, mask){
		this.eraserMarker = game.add.rectangle(0, 0, 8/canvas.spriteScale, 8/canvas.spriteScale, 0xC0C0C0)
		this.eraserMarker.visible = false
		this.eraserMarker.setMask(mask)
	}

	update(drawColor){
		
		var pointerX = this.game.input.x;
		var pointerY = this.game.input.y;

		if(this.OldMouseX == null){
			this.OldMouseX = pointerX;
			this.OldMouseY = pointerY;
		}
		
		if(this.gamePointer.leftButtonDown()){

			var paintData = {
				xPos: this.OldMouseX, 
				yPos: this.OldMouseY, 
				endX: pointerX, 
				endY: pointerY,
				color: drawColor,
				tool: "pen"
			}
			this.game.networkManager.emit("paint", paintData)
			this.paintManager.paint(paintData, this.paintManager.mainCanvas)
		}
		else if(this.gamePointer.rightButtonDown()){
			this.eraserMarker.x = pointerX
			this.eraserMarker.y = pointerY
			this.eraserMarker.visible = true

			var eraseData = {
				xPos: this.OldMouseX, 
				yPos: this.OldMouseY, 
				tool: "eraser",
				color: drawColor
			}

			this.game.networkManager.emit("paint", eraseData)
			this.paintManager.erase(eraseData, this.paintManager.mainCanvas)
		}
		else{
			this.eraserMarker.visible = false
		}

		this.OldMouseX = pointerX;
		this.OldMouseY = pointerY;
	}

}