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
	}

	paintPen(data, canvas){
		canvas.graphics.lineStyle(canvas.graphicsScale, data.color, 1);
		canvas.graphics.beginPath()
		canvas.graphics.moveTo(data.xPos, data.yPos)
		canvas.graphics.lineTo(data.endX, data.endY)
		canvas.graphics.closePath()
		canvas.graphics.strokePath()
	}

	erase(data, canvas){
		var scaleRatio = data.scaleAmount || 1
		canvas.graphics.fillRect(data.xPos - (10/scaleRatio), data.yPos - (10/scaleRatio), 20/scaleRatio, 20/scaleRatio);	
	}
}