class ShapeTool{
	constructor(game){
		this.game = game
		this.gamePointer = game.input.activePointer
		this.paintManager = game.paintManager

		this.isFilled = false
	}

	create(mask){
		this.rectHighlight = this.game.add.rectangle(0, 0, 0, 0, 0x000000)
		this.circleHighlight = this.game.add.ellipse(0.0,0,0, 0x000000)


		this.circleHighlight.setMask(mask)
		this.rectHighlight.setMask(mask)
	}

	setShape(newShape, isFilled){
		var alpha = isFilled ? 1 : 0

		switch(newShape){
			case "rect":
				this.highlightedShape = this.rectHighlight
			break;
			case "ellipse":
				this.highlightedShape = this.circleHighlight
			break;
		}

		this.highlightedShape.setFillStyle(0x000000, alpha)
		this.highlightedShape.setStrokeStyle(2, 0x000000, 1-alpha);
		
		this.currentShape = newShape
		this.isFilled = isFilled
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
				this.highlightedShape.strokeColor = drawColor
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
					tool: this.currentShape,
					isFilled: this.isFilled
				}

				this.game.networkManager.emit("paint", data)
				this.paintManager.paint(data, this.paintManager.mainCanvas)
				this.highlightedShape.visible = false
				this.initialPos = null
				this.highlightedShape.setSize(0, 0)
			}
		}
	}

}