class PaintManager{

	setMainCanvas(canvas){
		this.mainCanvas = canvas
	}


	paint(data, targetCanvas){
		if(targetCanvas == null)
			return

		var scaledData = targetCanvas.getScaledData(data, this.mainCanvas)


		if(data.tool == "pen"){
			this.paintPen(scaledData, targetCanvas)
		}
		else if(data.tool == "eraser"){
			this.erase(scaledData, targetCanvas)
		}
		else if(data.tool == "filled-rect"){
			this.paintRect(scaledData, targetCanvas)
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

	paintRect(data, canvas){
		var width = data.endX - data.xPos;
		var height = data.endY - data.yPos;

		canvas.graphics.fillStyle(data.color);
		canvas.graphics.fillRect(data.xPos, data.yPos, width, height);
	}

	erase(data, canvas){
		var scaleRatio = data.scaleAmount || 1
		canvas.graphics.fillRect(data.xPos - (10/scaleRatio), data.yPos - (10/scaleRatio), 20/scaleRatio, 20/scaleRatio);	
	}
}