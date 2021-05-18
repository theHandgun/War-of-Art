
class Button {
	
	constructor(size, xPos, yPos, text , game, clickFunc, customData) { 
	    this.game = game
	    this.xPos = xPos
	    this.yPos = yPos
	    this.size = size
	    this.clickFunc = clickFunc
	    this.text = text
 		this.game = game

	    this.customData = customData
	    this.hasCustomData = this.customData != null
	    this.interactable = true
	    // TODO: call create function here.

	    this.create()
	}

	create(){
	  	var self = this

		this.button = this.game.add.sprite(this.xPos, this.yPos, this.hasCustomData ? this.customData.normal : this.size).setInteractive();
		this.button.setScale(this.hasCustomData ? this.customData.scale : 0.2)

		var textXPos = this.xPos
		var textYPos = this.yPos

		if(this.hasCustomData && this.customData.hasText || !this.hasCustomData){
			this.bText = this.game.add.text(textXPos, textYPos, this.text, { fontFamily: 'Arial', fontSize: 36, color: '#FFFFFF'})
			this.bText.setOrigin(0.5)
		}

		this.button.on("pointerover",function(pointer){
			if(self.interactable){
	    		this.setTexture(self.hasCustomData ? self.customData.hover : (self.size + "H"))
			}
		});

		this.button.on("pointerout",function(pointer){
			if(self.interactable){
	    		this.setTexture(self.hasCustomData ? self.customData.normal :self.size)
			}
		});

		this.button.on("pointerdown",function(pointer){
			if(self.interactable){
	    		this.setTexture(self.hasCustomData ? self.customData.pressed : (self.size + "P"))
			}
		});

		this.button.on("pointerup",function(pointer){
			if(self.interactable){
	    		this.setTexture(self.hasCustomData ? self.customData.normal : self.size)
	    		self.clickFunc()
			}
		});
  	}

  	setVisible(newState){
  		this.button.visible = newState

  		if(this.bText){
  			this.bText.visible = newState
  		}
  	}

  	setInteractable(newState){
  		this.interactable = newState
  		if(newState)
  			this.button.setTexture(self.hasCustomData ? self.customData.normal : this.size)
  		else
  			this.button.setTexture(self.hasCustomData ? self.customData.pressed : (this.size + "P"))
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