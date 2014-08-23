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