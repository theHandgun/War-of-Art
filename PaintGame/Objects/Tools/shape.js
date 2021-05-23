class ShapeTool{
	constructor(game){
		this.game = game
		this.gamePointer = game.input.activePointer
		this.paintManager = game.paintManager
	}

	create(mask){
		this.rectHighlight = this.game.add.rectangle(0, 0, 0, 0, 0x000000)
		this.circleHighlight = this.game.add.ellipse(0.0,0,0, 0x000000)
		this.circleHighlight.setFillStyle(0xFF000000, 1);

		this.circleHighlight.setMask(mask)
		this.rectHighlight.setMask(mask)
	}

	setShape(newShape){
		var self = this
		switch(newShape){
			case "filled-rect":
				self.highlightedShape = self.rectHighlight
			break;
			case "filled-ellipse":
				self.highlightedShape = self.circleHighlight
			break;
		}

		this.currentShape = newShape
	}

	update(canvas, drawColor){
		var pointerX = this.game.input.x;
		var pointerY = this.game.input.y;


		if(this.gamePointer.leftButtonDown()){
			if(this.initialPos){
				var x = pointerX - this.initialPos.x
				var y = pointerY - this.initialPos.y
				this.highlightedShape.setSize(x, y)
				this.highlightedShape.fillColor = drawColor
			}
			else{
				this.initialPos = {x: pointerX, y: pointerY}

				this.highlightedShape.x = pointerX
				this.highlightedShape.y = pointerY
				this.highlightedShape.width = 0
				this.highlightedShape.height = 0

				this.highlightedShape.visible = true
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
					tool: this.currentShape
				}

				this.game.networkManager.emit("paint", data)
				this.paintManager.paint(data, this.paintManager.mainCanvas)
				this.highlightedShape.visible = false
				this.initialPos = null
			}
		}
	}

}