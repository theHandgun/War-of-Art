class MainScene extends Phaser.Scene{
	constructor(data) {
		super("MainScene");

	}
	init(){
		var self = this
		this.joinB = new Button("longButton", 500,400, "Giriş Yap" , self, function() {self.onJoin()} )
		this.portrait = new PortraitManager(500, 200, this)
	}

	preload(){
		Button.preloadAll(this)
		PortraitManager.preloadAll(this)
	}


	create(){
		this.portrait.create()
       	this.joinB.create()
    }

    onJoin(){
  
        var self = this

        var nick = prompt("Rumuz giriniz:")

        this.registry.set("socket-ip", "localhost")
        this.registry.set("socket-port", "3000")
        this.registry.set("nickname", nick)

        this.io = io("ws://localhost:3000", {transports : ["websocket"]});

        this.io.on("connect", function(socket){
        	this.emit("attemptJoin", {nick: self.registry.get("nickname"), portrait: self.portrait.getPortraitID()})
        })

        this.io.on("accepted", function(data){
        	self.scene.start("PaintScene", 
        	{
        		id: data.id,
        	 	gameState: data.gameState,
        	 	isHost: data.isHost,
        	 	portrait: self.portrait.getPortraitID(),
        	 	io: self.io,
        	 	players: data.players
        	 })

        })

        this.io.on("rejected", function(data){
        	alert(data)
        })
    }
}
