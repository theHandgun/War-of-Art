class Chat{
	constructor(xPos, yPos, game){
		this.xPos = xPos
		this.yPos = yPos
		this.game = game

		this.chatHistory = []
		this.cornerMargin = 20
		this.chatDeltaScroll = 0

		this.create(game)
	}

	create(game){
		var self = this
		this.chat = game.add.sprite(this.xPos, this.yPos, "chatbox").setInteractive()
		this.chat.setScale(0.42)
		this.chat.setOrigin(0,0)

		this.chat.on('wheel', function (pointer, deltaX, deltaY, deltaZ) {
			var multiplier = (deltaY > 0) ? 1:-1
			var moveAmount = 20 * -multiplier //deltaY * 0.1

			if(self.chatDeltaScroll + moveAmount < 0 || self.chatDeltaScroll + moveAmount > 20*(self.chatHistory.length-8))
				moveAmount = 0

			self.chatDeltaScroll += moveAmount
	        self.moveChat(moveAmount);
    	});

		this.graphics = game.make.graphics();
		var x1 = this.xPos + this.cornerMargin
		var y1 = this.yPos + (this.cornerMargin - 6)
		var x2 = this.chat.displayWidth - this.cornerMargin
		var y2 = this.chat.displayHeight - (this.cornerMargin + 15)

	    this.graphics.fillRect(x1, y1, x2, y2)

	    this.mask = new Phaser.Display.Masks.GeometryMask(game, this.graphics);
	}

	addText(textData){

		var yPos = this.yPos - (this.cornerMargin - 4) + this.chat.displayHeight + this.chatDeltaScroll

		if(textData.type == "SYSTEM"){
			let message = this.game.add.text(this.xPos + this.cornerMargin, yPos, textData.message, {fontSize: 18, fontFamily: "Arial", color:"#FF0000"})
			message.setOrigin(0, 0.5)

			message.setMask(this.mask)
			this.chatHistory.push({message: message})
		}
		else{
			let sender = this.game.add.text(this.xPos + this.cornerMargin, yPos, textData.sender, {fontSize: 18, fontFamily: "Arial", color: "#000000", fontStyle:"bold"})
			sender.setOrigin(0, 0.5)
			let message =  this.game.add.text(this.xPos + this.cornerMargin + sender.displayWidth, yPos, ": " + textData.message, {fontSize:16, fontFamily: "Arial", color: "#000000"})
			message.setOrigin(0, 0.5)

			sender.setMask(this.mask)
			message.setMask(this.mask)
			this.chatHistory.push({sender: sender, message: message})
		}

		this.moveChat(-20)
	}

	clearChat(){
		for (var i = 0; i < this.chatHistory.length; i++) {
			this.chatHistory[i].message.destroy()
			if(this.chatHistory[i].sender){
				this.chatHistory[i].sender.destroy()
			}
		}
	}

	moveChat(moveDistance){
		for (var i = 0; i < this.chatHistory.length; i++) {
			this.chatHistory[i].message.y += moveDistance
			if(this.chatHistory[i].sender){
				this.chatHistory[i].sender.y += moveDistance
			}
		}
	}

	setVisible(isVisible){

		this.chat.visible = isVisible

		for (var i = 0; i < this.chatHistory.length; i++) {
			this.chatHistory[i].message.visible = isVisible
			if(this.chatHistory[i].sender){
				this.chatHistory[i].sender.visible = isVisible
			}
		}
	}

	static preload(game){
		game.load.image("chatbox", "PaintGame/Assets/Components/chat.png")
	}
}