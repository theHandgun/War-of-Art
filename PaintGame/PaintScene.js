class PaintScene extends Phaser.Scene{

	constructor() {
		super("bootGame");

	}

	preload(){
	}

	create(){
		
		this.DXText = this.add.text(10,20, "DeltaX: 0");
		this.DYText = this.add.text(10,40, "DeltaY: 0");

		this.graphics = this.add.graphics();

		this.graphics.lineStyle(2, 0xFF3300, 1);
		
	}

	init(){
		
	}

	update(){
		
		var pointerX = this.input.mousePointer.x;
		var pointerY = this.input.mousePointer.y;

		if(this.OldMouseX == null){
			this.OldMouseX = pointerX;
			this.OldMouseY = pointerY;
		}

		var deltaX = pointerX - this.OldMouseX;
		var deltaY = pointerY - this.OldMouseY;

		this.DXText.setText("DeltaX: " + deltaX);
		this.DYText.setText("DeltaY: " + deltaY);


		if(game.input.activePointer.isDown){

			this.graphics.beginPath();
			this.graphics.moveTo(this.OldMouseX, this.OldMouseY);
			this.graphics.lineTo(pointerX, pointerY);
			this.graphics.closePath();
			this.graphics.strokePath();
		}

			this.OldMouseX = pointerX;
			this.OldMouseY = pointerY;

	}	
}