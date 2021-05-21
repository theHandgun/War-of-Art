class FilledRectTool{
	constructor(game){
		this.game = game
		this.gamePointer = game.input.activePointer
	}

	create(mask){
		this.rectHighlight = this.game.add.rectangle(0, 0, 0, 0, 0x000000)
		this.rectHighlight.setMask(mask)
	}

	update(){

		var pointerX = this.game.input.x;
		var pointerY = this.game.input.y;

		if(this.gamePointer.leftButtonDown()){
			if(this.initialPos){
				this.rectHighlight.width = pointerX - this.initialPos.x
				this.rectHighlight.height = pointerY - this.initialPos.y
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
				// Draw rect.
				this.rectHighlight.visible = false
				this.initialPos = null
			}
		}
	}
}