class BucketTool{
	constructor(game){
		this.game = game
		this.gamePointer = game.input.activePointer
		this.paintManager = game.paintManager

		this.isFilled = false
		this.canUse = true
		this.useCooldown = 1000
	}

	update(canvas, drawColor, game){
		
		if(this.gamePointer.leftButtonDown() && this.canUse){

			var pointerX = this.game.input.x;
			var pointerY = this.game.input.y;

			if(!canvas.isMouseOver(pointerX, pointerY))
				return

			var data = {xPos: pointerX, yPos: pointerY, color: drawColor, tool:"bucket-fill"}

			this.paintManager.paint(data, this.paintManager.mainCanvas)
			this.game.networkManager.emit("paint", data)
			this.canUse = false
			var self = this
			var interval = setInterval(function(){self.canUse = true; clearInterval(interval)}, this.useCooldown)
		}
	}

}