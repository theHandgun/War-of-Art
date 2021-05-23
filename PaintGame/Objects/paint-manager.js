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
			case "filled-rect": 
				this.paintRect(scaledData, targetCanvas, true) 
			break;
			case "filled-ellipse":
				this.paintCircle(scaledData, targetCanvas, true) 
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
		canvas.graphics.fillRect(data.xPos, data.yPos, width, height);
	}

	paintCircle(data, canvas, isFilled){
		var width = data.endX - data.xPos;
		var height = data.endY - data.yPos;

		canvas.graphics.fillStyle(data.color);
		canvas.graphics.fillEllipse(data.xPos, data.yPos, width, height, 100);
	}




	erase(data, canvas){
		var scaleRatio = data.scaleAmount || 1
		canvas.graphics.fillRect(data.xPos - (10/scaleRatio), data.yPos - (10/scaleRatio), 20/scaleRatio, 20/scaleRatio);	
	}
}