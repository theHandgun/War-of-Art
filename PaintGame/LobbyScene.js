class LobbyScene extends Phaser.Scene{

	constructor() {
		super("lobbyScene");

	}

	init(data)
    {
        this.io = data.io;
    }


	preload(){
		this.load.image("box", "PaintGame/Assets/box.png")
		
	}

	create(){
		this.config = {
			DrawZoneX : 600,
			DrawZoneY : 350,
			DrawZoneSize: 576,
		};


		this.DXText = this.add.text(10,20, "DeltaX: 0");
		this.DYText = this.add.text(10,40, "DeltaY: 0");
		this.MXPos = this.add.text(10,60, "asd");

		this.paintCanvas = this.add.sprite(this.config.DrawZoneX, this.config.DrawZoneY, "box").setInteractive();

		this.paintCanvas.on('pointerover',function(pointer){
    		this.mouseOverCanvas = true;
		});

		this.paintCanvas.on('pointerout',function(pointer){
    		this.mouseOverCanvas = false;
		});



		this.graphics = this.add.graphics();
		this.graphics.lineStyle(2, 0xFF3300, 1);
	}


	update(){
		
		let pointerX = this.input.mousePointer.x;
		let pointerY = this.input.mousePointer.y;

		if(this.OldMouseX == null){
			this.OldMouseX = pointerX;
			this.OldMouseY = pointerY;
		}

		let deltaX = pointerX - this.OldMouseX;
		let deltaY = pointerY - this.OldMouseY;

		this.DXText.setText("DeltaX: " + deltaX);
		this.DYText.setText("DeltaY: " + deltaY);
		this.MXPos.setText(pointerY);

		if(game.input.activePointer.isDown && this.paintCanvas.mouseOverCanvas){

			if(this.OldMouseX > 887){ this.OldMouseX = 886;}
			if(this.OldMouseX < 309){ this.OldMouseX = 310;}
			if(this.OldMouseY > 636){ this.OldMouseY = 635;}
			if(this.OldMouseY < 60){ this.OldMouseY = 61;}

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