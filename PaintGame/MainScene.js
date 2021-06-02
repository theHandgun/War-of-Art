class MainScene extends Phaser.Scene{
	constructor(data) {
		super("MainScene");

	}

	init(){
		
	}

	preload(){
		Button.preloadAll(this)
		PortraitManager.preloadAll(this)
        this.load.html('nameInput', 'PaintGame/DOM/username.html');
	}


	create(){
        var self = this
        this.portrait = new PortraitManager(500, 200, this)
        this.joinB = new Button("longButton", 503, 420, "Giriş Yap", this, 
            function() 
            {
                self.onJoin()
                self.nameInput.getChildByName("nameInput").value = ""
            })

        this.nameInput = this.add.dom(504, 350).createFromCache("nameInput")
        this.nameInput.addListener("keyup")
        this.nameInput.on("keyup", function(event){
            if(event.key == "Enter")
                self.joinB.clickFunc()
        })
    }

    onJoin(){
  
        var self = this

        var nick = this.nameInput.getChildByName("nameInput").value
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
