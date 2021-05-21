class Toolbox{
	constructor(xPos, yPos, game){
		this.xPos = xPos
		this.yPos = yPos
		this.game = game
		this.paintButtons = []
		this.colorList =[
			0x000000,
			0x7F7F7F,
			0x880015,
			0xED1C24,
			0xFF7F27,
			0xFFF200,
			0x22B14C,
			0x00A2E8,
			0x3F48CC,
			0xA349A4,
			0xC3C3C3,
			0xB97A57,
			0xFFAEC9,
			0xFFC90E,
		]
		this.color = 0x000000
		this.selectedTool = "pen"


		this.pen = new Pen(game)

		this.create(game)
	}

	create(){
		var self = this
		this.toolbox = this.game.add.sprite(this.xPos, this.yPos, "toolbox")
		this.toolbox.setScale(0.42)

		var index = 0
		for (var x = 0; x < 7; x++) {
			for (var y = 0; y < 2; y++) {
				this.paintButtons[index] = this.game.add.sprite( (this.xPos - 14.5) + y*29, (this.yPos - 125) + x*29, "box").setInteractive()
				this.paintButtons[index].setScale(.84)
				this.paintButtons[index].tint = this.colorList[index]

				let curIndex = index
				this.paintButtons[curIndex].on("pointerdown",function(pointer){
					self.selectColor(curIndex)
				});


				index++
			}
		}

		this.eraseButton = new Button("", this.xPos, this.yPos + 190, "", this.game, function(){
			self.canvas.sendClearMsg()
		}, {
			normal: "eraser",
			hover: "eraserH",
			pressed: "eraserP",
			scale: 0.8,
			hasText: false
		})
		


		this.selectedClrImg = this.game.add.sprite(this.xPos, this.yPos - 200, "box")
		this.selectedClrImg.setScale(1.6)
		this.selectedClrImg.tint = 0x000000
		
	}

	update()
	{
		if(this.selectedTool == "pen"){
			this.pen.update(this.canvas, this.color)
		}
	}

	selectColor(index){
		this.color = this.colorList[index]
		this.selectedClrImg.tint = this.colorList[index]
	}

	setCanvas(canvas){
		this.canvas = canvas
		this.pen.create(this.game, this.canvas.spriteScale, this.canvas.graphicsMask)
	}

	setVisible(isVisible){
		for (var i = 0; i < this.paintButtons.length; i++) {
			this.paintButtons[i].visible = isVisible
		}
		this.eraseButton.setVisible(isVisible)
		this.selectedClrImg.visible = isVisible
	}

	static preload(game){
		game.load.image("toolbox", "PaintGame/Assets/Components/toolbox.png")
		game.load.image("box", "PaintGame/Assets/box.png")

		game.load.image("eraser","PaintGame/Assets/Buttons/Eraser/button.png")
		game.load.image("eraserH","PaintGame/Assets/Buttons/Eraser/buttonH.png")
		game.load.image("eraserP","PaintGame/Assets/Buttons/Eraser/buttonP.png")
	}

}