class PaintManager{
	constructor(game){
		this.game = game
	}

	setMainCanvas(canvas){
		this.mainCanvas = canvas
	}


	paint(data, targetCanvas){
		if(targetCanvas == null)
			return

		var scaledData = targetCanvas.getScaledData(data, this.mainCanvas)

		switch(data.tool){
			case "pen": 
				this.paintPen(scaledData, targetCanvas) 
			break;
			case "eraser":
				this.erase(scaledData, targetCanvas) 
			break;
			case "rect": 
				this.paintRect(scaledData, targetCanvas, data.isFilled) 
			break;
			case "ellipse":
				this.paintEllipse(scaledData, targetCanvas, data.isFilled) 
			break;
			case "bucket-fill":
				this.floodFill(scaledData, targetCanvas)
			break;
		}
	}


	// Methods bellow are to be used internally.
	paintPen(data, canvas){
		canvas.graphics.lineStyle(canvas.graphicsScale, data.color, 1);
		canvas.graphics.beginPath()
		canvas.graphics.moveTo(data.xPos, data.yPos)
		canvas.graphics.lineTo(data.endX, data.endY)
		canvas.graphics.closePath()
		canvas.graphics.strokePath()
	}

	paintRect(data, canvas, isFilled){
		var width = data.endX - data.xPos;
		var height = data.endY - data.yPos;

		canvas.graphics.fillStyle(data.color);
		canvas.graphics.lineStyle(2, data.color);

		if(isFilled){
			canvas.graphics.fillRect(data.xPos, data.yPos, width, height);
		} else {
			canvas.graphics.strokeRect(data.xPos, data.yPos, width, height);
		}

	}

	paintEllipse(data, canvas, isFilled){
		var width = data.endX - data.xPos;
		var height = data.endY - data.yPos;

		canvas.graphics.fillStyle(data.color);
		canvas.graphics.lineStyle(2, data.color);
		// Adding half the width and height because ellipse origin is it's center. We want origin to be up left corner same as highlighted ellipse object.
		if(isFilled){
			canvas.graphics.fillEllipse(data.xPos + width/2, data.yPos + height/2, width, height);
		} else {
			canvas.graphics.strokeEllipse(data.xPos + width/2, data.yPos + height/2, width, height);
		}
	}


	floodFill(data, canvas){
		canvas.graphics.generateTexture(canvas.textureID)
		var texture = this.game.textures.get(canvas.textureID)
        var imageData = texture.getData(0, 0, texture.width, texture.height)
        var pixelData = imageData.data;

        var colorRGB = Phaser.Display.Color.IntegerToRGB(data.color)
        
        data.xPos = Math.floor(data.xPos)
        data.yPos = Math.floor(data.yPos)

        var pointerPos = Math.floor(data.xPos + (data.yPos * texture.width)) * 4
       	var targetClr = {r: pixelData[pointerPos], g: pixelData[pointerPos + 1], b: pixelData[pointerPos + 2]}

       	if(targetClr.r == undefined || targetClr.g == undefined || targetClr.b == undefined){
       		console.log("Undefined click position for flood fill.")
       		console.log(targetClr)
       		return
       	}

        var fillStack = [pointerPos]

        while(fillStack.length > 0)
        {

        	let targetPos = fillStack.pop()

        	let pixelClr = {r: pixelData[targetPos], g: pixelData[targetPos + 1], b: pixelData[targetPos + 2]}

        	if(targetPos < 0 || targetPos > pixelData.length ||
        		(colorRGB.r == pixelClr.r && colorRGB.g == pixelClr.g && colorRGB.b == pixelClr.b))
        	{
        		continue
        	}

        	if(targetClr.r == pixelClr.r && targetClr.g == pixelClr.g && targetClr.b == pixelClr.b){

        		pixelData[targetPos] = colorRGB.r
	            pixelData[targetPos + 1] = colorRGB.g
	           	pixelData[targetPos + 2] = colorRGB.b
	           	pixelData[targetPos + 3] = 255
        	}
        	else{
        		continue
        	}


	        if(Math.floor((targetPos + 4) / (texture.width*4)) == Math.floor(targetPos / (texture.width * 4))){ // Checking if pixel on the right is on the same row.
	        	fillStack.push(targetPos + 4)
			}	

			if(Math.floor((targetPos - 4) / (texture.width*4)) == Math.floor(targetPos / (texture.width * 4))){ // Checking if pixel on the left is on the same row.
				fillStack.push(targetPos - 4)
			}
			if((targetPos - texture.width * 4) >= 0){ // Checking if is there a pixel bellow.
				fillStack.push(targetPos - texture.width*4)
			}	

			if((targetPos + texture.width * 4) <= pixelData.length){ // Checking if there is a pixel bellow.
				fillStack.push(targetPos + texture.width*4)
			}

        }

        texture.putData(imageData, 0,0);
        texture.refresh()

        canvas.bgSprite.setTexture(canvas.textureID)
        canvas.graphics.clear()

	}


	erase(data, canvas){
		var scaleRatio = data.scaleAmount || 1
		canvas.graphics.fillStyle(data.color);
		canvas.graphics.fillRect(data.xPos - (10/scaleRatio), data.yPos - (10/scaleRatio), 20/scaleRatio, 20/scaleRatio);	
	}
}