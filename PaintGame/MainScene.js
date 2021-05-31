class MainScene extends Phaser.Scene{
	constructor(data) {
		super("MainScene");

	}
	init(){
		
	}

	preload(){
		Button.preloadAll(this)
		PortraitManager.preloadAll(this)
	}


	create(){
        var self = this
        this.joinB = new Button("longButton", 500,400, "Giriş Yap", this, function() {self.onJoin()} )
        this.portrait = new PortraitManager(500, 200, this)
    }

    onJoin(){
  
        var self = this

        var nick = prompt("Rumuz giriniz:")
        this.registry.set("nick", nick)

        this.io = io("https://warofart.herokuapp.com", {transports : ["websocket"]});

        this.io.on("connect", function(socket){
        	this.emit("attemptJoin", {nick: self.registry.get("nick"), portrait: self.portrait.getPortrait()})
        })

        this.io.on("accepted", function(data){
        	self.scene.start("PaintScene", 
        	{
        		id: data.id,
        	 	gameState: data.gameState,
        	 	isHost: data.isHost,
        	 	portrait: self.portrait.getPortrait(),
        	 	io: self.io,
        	 	players: data.players
        	 })

        })

        this.io.on("rejected", function(data){
        	alert(data)
        })
    }
}
