class PaintManager{

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




	erase(data, canvas){
		var scaleRatio = data.scaleAmount || 1
		canvas.graphics.fillRect(data.xPos - (10/scaleRatio), data.yPos - (10/scaleRatio), 20/scaleRatio, 20/scaleRatio);	
	}
}