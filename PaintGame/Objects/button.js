
class Button {
	
	constructor(size, xPos, yPos, text , game, clickFunc) { 
	    this.game = game
	    this.xPos = xPos
	    this.yPos = yPos
	    this.size = size
	    this.clickFunc = clickFunc
	    this.text = text
	}

	create(){
	  	var self = this

		this.button = this.game.add.sprite(this.xPos, this.yPos, this.size).setInteractive();
		this.button.setScale(0.2)

		var textXPos = this.xPos
		var textYPos = this.yPos

		this.bText = this.game.add.text(textXPos, textYPos, this.text, { fontFamily: 'Arial', fontSize: 36, color: '#FFFFFF'})
		this.bText.setOrigin(0.5)

		this.button.on("pointerover",function(pointer){
	    	this.setTexture(self.size + "H")
		});

		this.button.on("pointerout",function(pointer){
	    	this.setTexture(self.size)
		});

		this.button.on("pointerdown",function(pointer){
	    	this.setTexture(self.size + "P")
		});

		this.button.on("pointerup",function(pointer){
	    	self.clickFunc()
	    	this.setTexture(self.size)
		});
  	}

	static preloadAll(game){
	  	game.load.image("smallButton", "PaintGame/Assets/Buttons/Small/button.png")
		game.load.image("midButton", "PaintGame/Assets/Buttons/Mid/button.png")
		game.load.image("longButton", "PaintGame/Assets/Buttons/Big/button.png")

		game.load.image("smallButtonH", "PaintGame/Assets/Buttons/Small/buttonH.png")
		game.load.image("midButtonH",  "PaintGame/Assets/Buttons/Mid/buttonH.png")
		game.load.image("longButtonH", "PaintGame/Assets/Buttons/Big/buttonH.png")

		game.load.image("smallButtonP", "PaintGame/Assets/Buttons/Small/buttonP.png")
		game.load.image("midButtonP", "PaintGame/Assets/Buttons/Mid/buttonP.png")
		game.load.image("longButtonP", "PaintGame/Assets/Buttons/Big/buttonP.png")
  	}

}