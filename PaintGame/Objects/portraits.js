class PortraitManager{
	constructor(xPos, yPos, game){
		this.xPos = xPos
		this.yPos =  yPos
		this.game = game
		this.portArray = [
			{img: "boba", name: "Boba Fett"},
			{img: "barney", name: "Barney Stinson"},
			{img: "baron", name: "Mehmet Karahanlı"},
			{img: "bond", name: "James Bond"},
			{img: "cakir", name: "Süleyman Çakır"},
			{img: "ethan", name: "Ethan Hunt"},
			{img: "han", name: "Han Solo"},
			{img: "harvey", name: "Harvey Specter"},
			{img: "house", name: "Dr. Gregory House"},
			{img: "indiana", name: "Indiana Jones"},
			{img: "irfan", name: "İrfan Hoca"},
			{img: "luke", name: "Luke Skywalker"},
			{img: "maul", name: "Darth Maul"},
			{img: "pala", name: "Pala"},
			{img: "polat", name: "Polat Alemdar"},
			{img: "necmi", name: "Testere Necmi"},
			{img: "50 kuruş", name: "450 Kuruş"},
			{img: "ercik", name: "President Ercik"},
			{img: "terminator", name: "Terminator"}
		]

		this.selectedIndex = 0
	}

	create(game){

		var self = this

		this.portrait = this.game.add.sprite(this.xPos, this.yPos, "boba")
		this.header = this.game.add.text(this.xPos, this.yPos + 90, "Boba Fett", {fontSize: 24})
		this.header.setOrigin(0.5,0.5)

		this.portrait.displayWidth = 128
		this.portrait.displayHeight = 128

		this.forward = new Button("smallButton", this.xPos + 130, this.yPos, ">", this.game, function(){
			if(self.selectedIndex != self.portArray.length - 1){
				self.selectNewPortrait(self.selectedIndex + 1)
			}else{
				self.selectNewPortrait(0)
			}
		})

		this.back = new Button("smallButton", this.xPos - 130, this.yPos, "<", this.game, function(){
			if(self.selectedIndex != 0){
				self.selectNewPortrait(self.selectedIndex - 1)
			}else{
				self.selectNewPortrait(self.portArray.length - 1)
			}
		})

		this.forward.create(this.game)
		this.back.create(this.game)  
	}

	getPortrait(){
		return this.portArray[this.selectedIndex].img
	}

	selectNewPortrait(newIndex){
		this.selectedIndex = newIndex
		this.portrait.setTexture(this.portArray[newIndex].img)
		this.portrait.displayHeight = 128
		this.portrait.scaleX = this.portrait.scaleY
		this.portrait.displayWidth = 128
		this.header.setText(this.portArray[newIndex].name)
	}


	static preloadAll(game){
		game.load.image("boba", "PaintGame/Assets/Portraits/boba.jpg")
		game.load.image("barney", "PaintGame/Assets/Portraits/barney.jpg")
		game.load.image("baron", "PaintGame/Assets/Portraits/baron.jpg")
		game.load.image("bond", "PaintGame/Assets/Portraits/bond.jpg")
		game.load.image("cakir", "PaintGame/Assets/Portraits/cakir.jpg")
		game.load.image("ethan", "PaintGame/Assets/Portraits/ethan.jpg")
		game.load.image("han", "PaintGame/Assets/Portraits/han.jpg")
		game.load.image("harvey", "PaintGame/Assets/Portraits/harvey.jpg")
		game.load.image("house", "PaintGame/Assets/Portraits/house.png")
		game.load.image("indiana", "PaintGame/Assets/Portraits/indiana.jpg")
		game.load.image("irfan", "PaintGame/Assets/Portraits/irfan.jpg")
		game.load.image("luke", "PaintGame/Assets/Portraits/luke.jpg")
		game.load.image("maul", "PaintGame/Assets/Portraits/maul.jpg")
		game.load.image("pala", "PaintGame/Assets/Portraits/pala.jpg")
		game.load.image("polat", "PaintGame/Assets/Portraits/polat.jpg")
		game.load.image("necmi", "PaintGame/Assets/Portraits/necmi.jpg")
		game.load.image("50 kuruş", "PaintGame/Assets/Portraits/50 kuruş.png")
		game.load.image("ercik", "PaintGame/Assets/Portraits/ercik.png")
		game.load.image("terminator", "PaintGame/Assets/Portraits/terminator.jpg")
	}
}