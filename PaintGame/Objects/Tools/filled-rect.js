class FilledRectTool{
	constructor(game){
		this.game = game
		this.gamePointer = game.input.activePointer
		this.paintManager = game.paintManager
	}

	create(mask){
		this.rectHighlight = this.game.add.rectangle(0, 0, 0, 0, 0x000000)
		this.rectHighlight.setMask(mask)
	}

	update(canvas, drawColor){

		var pointerX = this.game.input.x;
		var pointerY = this.game.input.y;

		if(this.gamePointer.leftButtonDown()){
			if(this.initialPos){
				this.rectHighlight.width = pointerX - this.initialPos.x
				this.rectHighlight.height = pointerY - this.initialPos.y
				this.rectHighlight.fillColor = drawColor
			}
			else{
				this.initialPos = {x: pointerX, y: pointerY}

				this.rectHighlight.x = pointerX
				this.rectHighlight.y = pointerY
				this.rectHighlight.width = 0
				this.rectHighlight.height = 0

				this.rectHighlight.visible = true
			}
		}
		else{
			if(this.initialPos){
				var data = {
					xPos: this.initialPos.x,
					yPos: this.initialPos.y,
					endX: pointerX,
					endY: pointerY,
					color: drawColor,
					tool: "filled-rect"
				}

				this.game.networkManager.emit("paint", data)
				this.paintManager.paint(data, this.paintManager.mainCanvas)
				this.rectHighlight.visible = false
				this.initialPos = null
			}
		}
	}

}