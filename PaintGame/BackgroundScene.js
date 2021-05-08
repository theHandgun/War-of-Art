class BackgroundScene extends Phaser.Scene{

	constructor() {
		super("BackgroundScene");
	}

	preload(){
		this.load.image("bg", "PaintGame/Assets/BG/BG.jpg")
	}

	init()
    {
    }

	create(){
		this.bg = this.add.image(200, 200, "bg")
		this.bg.alpha = 0.6
		this.scene.launch("MainScene")
	}


	update(){


	}


}