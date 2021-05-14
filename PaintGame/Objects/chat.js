class Chat{
	constructor(xPos, yPos, game){
		this.xPos = xPos
		this.yPos = yPos
		this.game = game

		this.chatHistory = []
		this.cornerMargin = 10

		this.create(game)
	}

	create(game){
		this.chat = game.add.sprite(this.xPos, this.yPos, "chatbox")
		this.chat.setScale(0.42)

		this.graphics = game.make.graphics();
		var x1 = this.xPos + this.cornerMargin
		var y1 = this.yPos + this.cornerMargin
		var x2 = this.xPos + this.chat.displayWidth - this.cornerMargin
		var y2 = this.yPos + this.chat.displayHeight - this.cornerMargin
	    this.graphics.fillRect(x1, y1, x2, y2)

	    this.mask = new Phaser.Display.Masks.GeometryMask(game, this.graphics);
	}

	addText(text, textData){

		var yPos = this.yPos - cornerMargin + this.chat.displayHeight - 30*this.chatHistory.length

		if(textData.type == "SYSTEM"){
			let message = this.game.add.text(this.xPos + this.cornerMargin, yPos, textData.message, {fontSize: 24, fontFamily: "Arial", color:"#FF0000"})
			message.setOrigin(0, 0.5)

			message.setMask(this.mask)
			this.chatHistory.push({message: message})
		}
		else{
			let sender = this.game.add.text(this.xPos + cornerMargin, yPos, textData.sender, {fontSize:22, fontFamily: "Arial", color: "#000000", fontStyle:"bold"})
			sender.setOrigin(0, 0.5)
			let message =  this.game.add.text(this.xPos + cornerMargin + sender.displayWidth, yPos, ": " + textData.message, {fontSize:22, fontFamily: "Arial", color: "#000000"})
			message.setOrigin(0, 0.5)

			sender.setMask(this.mask)
			message.setMask(this.mask)
			this.chatHistory.push({sender: sender, message: message})
		}
	}

	clearChat(){
		for (var i = 0; i < this.chatHistory.length; i++) {
			this.chatHistory[i].message.destroy()
			if(this.chatHistory[i].sender){
				this.chatHistory[i].sender.destroy()
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