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
			0xB97A57
		]

		this.toolList = [
		{tool: "pen", button: "Pen"},
		{tool: "bucket", button: "Bucket"},
		{tool: "filled-rect", button: "FRect"},
		{tool: "empty-rect", button: "Rect"},
		{tool: "filled-ellipse", button: "FEllipse"},
		{tool: "empty-ellipse", button: "Ellipse"},
		]

		this.color = 0x000000
		this.selectedTool = "pen"

		// This shouldn't be here, remove it after moving the clear all button.
		this.networkManager = game.networkManager
		//----

		this.pen = new PenTool(game)
		this.shapeTool = new ShapeTool(game)
		this.bucketTool = new BucketTool(game)
		
	}

	// Called when canvas is set.
	create(){
		var self = this
		this.toolbox = this.game.add.sprite(this.xPos, this.yPos, "toolbox")
		this.toolbox.setScale(0.42)


		// Creating colors.
		var index = 0
		for (var x = 0; x < Math.ceil(this.colorList.length/2); x++) {
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

		// Creating tools.
		index = 0
		for (var x = 0; x < this.toolList.length / 2; x++) {
			for (var y = 0; y < 2; y++) {

				let toolName = this.toolList[index].tool

				this.eraseButton = new Button("", (this.xPos - 14.5) + y*29, (this.yPos + 67) + x*29, "", this.game, function(){
					self.setSelectedTool(toolName)
				}, {
					normal: this.toolList[index].button,
					hover: this.toolList[index].button + "H",
					pressed: this.toolList[index].button + "P",
					scale: 0.45,
					hasText: false
				})

				index++
			}
		}

		this.eraseButton = new Button("", this.xPos, this.yPos + 190, "", this.game, function(){
			self.canvasObj.sendClearMsg(self.networkManager)
		}, {
			normal: "Eraser",
			hover: "EraserH",
			pressed: "EraserP",
			scale: 0.8,
			hasText: false
		})
		
		this.pen.create(this.game, this.canvasObj, this.canvasObj.graphicsMask)
		this.shapeTool.create(this.canvasObj.graphicsMask)
		
		this.selectedClrImg = this.game.add.sprite(this.xPos, this.yPos - 200, "box")
		this.selectedClrImg.setScale(1.6)
		this.selectedClrImg.tint = 0x000000
		
	}

	update()
	{

		if(this.selectedTool == "pen"){
			this.pen.update(this.color)
		}
		else if (this.selectedTool == "bucket"){
			this.bucketTool.update(this.canvasObj, this.color)
		}
		else{
			this.shapeTool.update(this.color)
		}

	}

	selectColor(index){
		this.color = this.colorList[index]
		this.selectedClrImg.tint = this.colorList[index]
	}

	setCanvas(canvas){
		this.canvasObj = canvas
		this.create(game)
	}

	setSelectedTool(newTool){
		var shapeData = newTool.split("-");
		if(shapeData.length == 2){
			this.shapeTool.setShape(shapeData[1], shapeData[0] == "filled")
		}

		this.selectedTool = newTool
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

		game.load.image("Bucket","PaintGame/Assets/Buttons/Toolbox/Bucket/button.png")
		game.load.image("BucketH","PaintGame/Assets/Buttons/Toolbox/Bucket/buttonH.png")
		game.load.image("BucketP","PaintGame/Assets/Buttons/Toolbox/Bucket/buttonP.png")

		game.load.image("Eraser","PaintGame/Assets/Buttons/Toolbox/Eraser/button.png")
		game.load.image("EraserH","PaintGame/Assets/Buttons/Toolbox/Eraser/buttonH.png")
		game.load.image("EraserP","PaintGame/Assets/Buttons/Toolbox/Eraser/buttonP.png")

		game.load.image("Ellipse","PaintGame/Assets/Buttons/Toolbox/Ellipse/button.png")
		game.load.image("EllipseH","PaintGame/Assets/Buttons/Toolbox/Ellipse/buttonH.png")
		game.load.image("EllipseP","PaintGame/Assets/Buttons/Toolbox/Ellipse/buttonP.png")

		game.load.image("FEllipse","PaintGame/Assets/Buttons/Toolbox/Filled-Ellipse/button.png")
		game.load.image("FEllipseH","PaintGame/Assets/Buttons/Toolbox/Filled-Ellipse/buttonH.png")
		game.load.image("FEllipseP","PaintGame/Assets/Buttons/Toolbox/Filled-Ellipse/buttonP.png")

		game.load.image("Rect","PaintGame/Assets/Buttons/Toolbox/Rect/button.png")
		game.load.image("RectH","PaintGame/Assets/Buttons/Toolbox/Rect/buttonH.png")
		game.load.image("RectP","PaintGame/Assets/Buttons/Toolbox/Rect/buttonP.png")

		game.load.image("FRect","PaintGame/Assets/Buttons/Toolbox/Filled-Rect/button.png")
		game.load.image("FRectH","PaintGame/Assets/Buttons/Toolbox/Filled-Rect/buttonH.png")
		game.load.image("FRectP","PaintGame/Assets/Buttons/Toolbox/Filled-Rect/buttonP.png")

		game.load.image("Pen","PaintGame/Assets/Buttons/Toolbox/Pen/button.png")
		game.load.image("PenH","PaintGame/Assets/Buttons/Toolbox/Pen/buttonH.png")
		game.load.image("PenP","PaintGame/Assets/Buttons/Toolbox/Pen/buttonP.png")

	}

}