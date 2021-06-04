class ErrorManager{
	constructor(message, iconType){
		this.message = message
		this.iconType = iconType
	}

	create(game){
		var sceneCanvas = this.sys.game.canvas

		this.darkBG = game.add.sprite(0, 0, "box")
		this.darkBG.displayWidth = sceneCanvas.x
		this.darkBG.scaleX = this.darkBG.scaleY
		this.darkBG.displayHeight = sceneCanvas.y
		this.darkBG.alpha = 0.3

		this.msgBG = game.add.sprite(sceneCanvas/2, sceneCanvas/2, "messageBackground")
		this.msgTxt = game.add.text(sceneCanvas/2, sceneCanvas/2 - 40, "", { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF'})
		this.okBtn = new Button("midButton", sceneCanvas/2, midButton/2 + 150, "Tamam", this.closeBtnClick)
		// TODO: Add icon
		// TODO: Add close button.
	}

	showMessage(msgType, message){
		this.toggleElements(true)
	}

	closeBtnClick(){
		this.toggleElements(false)
	}

	toggleElements(newStatus){
		this.darkBG.visible = true
		this.msgTxt.visible = true
		this.okBtn.visible = true
	}

	static preload(game){
		// Load error box, close button and message icon.
  	}
}