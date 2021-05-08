class MainScene extends Phaser.Scene{
	constructor(data) {
		super("MainScene");

	}
	init(){
		var self = this
		this.joinB = new Button("longButton", 220,120, "Giris Yap" , self, function() {self.onJoin(self)} )
	}

	preload(){
		Button.preloadAll(this)
	}


	create(){
		var self = this
		
       	this.joinB.create()
    }

    onJoin(self){
        /*let ip = prompt("IP adresini giriniz:");
        let port = prompt("Portu giriniz:");
			
        this.io = io("http://" + ip + ":" + port, {transports : ["websocket"] });*/

        //self.io = io("http://localhost:3000", {transports : ["websocket"] });

        var nick = prompt("Rumuz giriniz:")

        self.registry.set("socket-ip", "localhost")
        self.registry.set("socket-port", "3000")
        self.registry.set("nickname", nick)

        self.scene.start("PaintScene", {id: "test"});
    }
}
