(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'memorobelia');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":6,"./states/gameover":7,"./states/menu":8,"./states/play":9,"./states/preload":10}],2:[function(require,module,exports){
'use strict';

var Collectable = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'collectable', frame);
	this.anchor.setTo(0.5, 0.5);

	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.setSize(64, 64);

	game.add.tween(this).to({ angle: 360 }, 4000, Phaser.Easing.Linear.None, true, 0, 1000);
};

Collectable.prototype = Object.create(Phaser.Sprite.prototype);
Collectable.prototype.constructor = Collectable;
Collectable.prototype.update = function() {};
Collectable.prototype.collect = function(player) {
	//this.parent.remove(this);
	this.game.add.tween(this).to({ x: player.x, y:player.y }, 300, Phaser.Easing.Linear.None, true, 0, 0);
	this.game.add.tween(this.scale).to({ x: 0, y:0 }, 300, Phaser.Easing.Linear.None, true, 0, 0);
};

module.exports = Collectable;

},{}],3:[function(require,module,exports){
'use strict';

var InventorySlot = require('../prefabs/inventorySlot');

var Inventory = function(game, parent) {  
	Phaser.Group.call(this, game, parent);
	this.fixedToCamera = true;

	var self = this;

	var offsetX = (game.width/2) - ((96 * 2) / 2) + 16
	this.slots = [
		new InventorySlot(game, 0+offsetX+32, game.height - 96+32),
		new InventorySlot(game, 96+offsetX+32, game.height - 96+32)
	];

	this.slots.forEach(function(slot) {
		self.add(slot);
	});

	this.x = 200;
};

Inventory.prototype = Object.create(Phaser.Group.prototype);
Inventory.prototype.constructor = Inventory;
Inventory.prototype.update = function() {};

Inventory.prototype.addItem = function(item) {
	this.add(item);

	item.x = 50;
	item.y = 50;

	console.log(item);
	console.log(item);
	console.log(item);

	this.slots.forEach(function(slot) {
		if(slot.item === null && item) {
			slot.setItem(item);
			item = false;
		}
	});
};

module.exports = Inventory;

},{"../prefabs/inventorySlot":4}],4:[function(require,module,exports){
'use strict';

var InventorySlot = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'inventorySlot', frame);
	this.anchor.setTo(0.5, 0.5);
	this.item = null;
};

InventorySlot.prototype = Object.create(Phaser.Sprite.prototype);
InventorySlot.prototype.constructor = InventorySlot;
InventorySlot.prototype.update = function() {};
InventorySlot.prototype.setItem = function(item) {
	this.item = item;

	var self = this;
	item.x = self.x;
	item.y = self.y;
	self.game.add.tween(item.scale).to({ x: 0.5, y:0.5 }, 300, Phaser.Easing.Linear.None, true, 0, 0);
};
InventorySlot.prototype.clear = function(item) {};

module.exports = InventorySlot;

},{}],5:[function(require,module,exports){
'use strict';

var Player = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'player', 2);

	game.physics.enable(this, Phaser.Physics.ARCADE);

	this.body.setSize(42, 48, 0, 20);

	this.anchor.setTo(0.5, 0.5);

	this.animations.add('walk', [0, 1], 4, true);
	this.animations.add('stand', [2], 4, true);
	this.animations.play('stand');
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function() {};

module.exports = Player;

},{}],6:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],7:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],8:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],9:[function(require,module,exports){
'use strict';

var Player = require('../prefabs/player');
var Collectable = require('../prefabs/collectable');
var Inventory = require('../prefabs/inventory');

function Play() {}

Play.prototype = {
	create: function() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		//create entity group to sort "dept"
		this.entities = new Phaser.Group(this.game);

		//make player
		this.game.stage.backgroundColor = '#dddddd';
		this.player = new Player(this.game,  1920/2, 1920/2);
		this.entities.add(this.player);

		//make collectable
		this.game.stage.backgroundColor = '#dddddd';
		this.collectable = new Collectable(this.game,  (1920/2) - 200 , 1920/2);
		this.entities.add(this.collectable);

		//setup controls
		this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

		this.cursors = this.createCursorKeys();

		this.relateKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.relateKey.onDown.add(this.relate, this);

		//create some gui
		this.inventory = new Inventory(this.game);

		//setup camera
		this.game.world.setBounds(0, 0, 1920, 1920);
		this.game.camera.follow(this.player);
	},
	relate:function() {
		console.log('relating to stuff!!');
	},
	update: function() {
		var self = this;

		this.game.physics.arcade.overlap(this.player, this.collectable, function() {
			if(self.collectable.collected !== true) {
				console.log('COLLECTING MEMORABILIA!');
				self.collectable.collect(self.player);
				self.collectable.collected = true;
				setTimeout(function() {
					self.inventory.addItem(self.collectable);
				}, 500);
			}
		});

		var speed = 150;
		var vel = {x:0, y:0};

		if(this.cursors.left.isDown) {
			vel.x -= speed;
		}
		if(this.cursors.right.isDown) {
			vel.x += speed;
		}
		if(this.cursors.up.isDown) {
			vel.y -= speed;
		}
		if(this.cursors.down.isDown) {
			vel.y += speed;
		}

		if(vel.x > 0) {
			this.player.animations.play('walk');
			this.player.scale.x = -1;
		} else if(vel.x < 0) {
			this.player.animations.play('walk');
			this.player.scale.x= 1;
		} else if(vel.y !== 0) {
			this.player.animations.play('walk');
		} else {
			this.player.animations.play('stand');
		}

		this.player.body.velocity.x = vel.x;
		this.player.body.velocity.y = vel.y;

		this.entities.sort('y');
	},
	clickListener: function() {
		this.game.state.start('gameover');
	},
	render: function() {
		//this.game.debug.body(this.player);
		//this.game.debug.body(this.collectable);
	},
    createCursorKeys: function () {
        return {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
        };

    },
};

module.exports = Play;
},{"../prefabs/collectable":2,"../prefabs/inventory":3,"../prefabs/player":5}],10:[function(require,module,exports){

'use strict';

function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');
    this.load.image('collectable', 'assets/m1.png');
    this.load.image('inventorySlot', 'assets/inventorySlot.png');

    this.game.load.atlasXML('player', 'assets/player.png', 'assets/player.xml');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])