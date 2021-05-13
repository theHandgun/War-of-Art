class Toolbox{
	constructor(xPos, yPos, game){
		this.xPos = xPos
		this.yPos = yPos
		this.game = game

		this.create(game)
	}

	create(game){
		this.toolbox = game.add.sprite(this.xPos, this.yPos, "toolbox")
		this.toolbox.setScale(0.42)
	}

	static preload(game){
		game.load.image("toolbox", "PaintGame/Assets/Components/toolbox.png")
	}
}