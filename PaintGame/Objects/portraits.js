class PortraitManager{
	constructor(xPos, yPos, game){
		this.xPos = xPos
		this.yPos =  yPos
		this.game = game
		this.portArray = [
			{img: "red", name: "Red Avatar"},
			{img: "white", name: "White Avatar"},
			{img: "blue", name: "Blue Avatar"}
		]

		this.selectedIndex = 0

		this.create(game)
	}

	create(){

		var self = this

		this.portrait = this.game.add.sprite(this.xPos, this.yPos, this.portArray[0].img)
		this.header = this.game.add.text(this.xPos, this.yPos + 90, this.portArray[1].name, {fontSize: 24})
		this.header.setOrigin(0.5,0.5)

		this.portrait.displayWidth = 128
		this.portrait.displayHeight = 128

		this.forward = new Button("smallButton", this.xPos + 130, this.yPos, ">", this.game, function(){
			if(self.selectedIndex != self.portArray.length - 1){
				self.selectNewPortrait(self.selectedIndex + 1)
			}else{
				self.selectNewPortrait(0)
			}
		})

		this.back = new Button("smallButton", this.xPos - 130, this.yPos, "<", this.game, function(){
			if(self.selectedIndex != 0){
				self.selectNewPortrait(self.selectedIndex - 1)
			}else{
				self.selectNewPortrait(self.portArray.length - 1)
			}
		})
	}

	getPortrait(){
		return this.portArray[this.selectedIndex].img
	}

	selectNewPortrait(newIndex){
		this.selectedIndex = newIndex
		this.portrait.setTexture(this.portArray[newIndex].img)
		this.portrait.displayHeight = 128
		this.portrait.scaleX = this.portrait.scaleY
		this.portrait.displayWidth = 128
		this.header.setText(this.portArray[newIndex].name)
	}


	static preloadAll(game){
		game.load.image("red", "PaintGame/Assets/Portraits/red.png")
		game.load.image("white", "PaintGame/Assets/Portraits/white.png")
		game.load.image("blue", "PaintGame/Assets/Portraits/blue.png")

	}
}