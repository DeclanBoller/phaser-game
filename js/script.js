document.addEventListener('DOMContentLoaded', function () {
  let game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload,
    create: create, update: update, });

  function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  }

  function create() {
    game.add.sprite(0, 0, 'sky')

    platforms = game.add.group();
    platforms.enableBody = true;
    let ground = platforms.create(0, game.world.height - 64, 'ground')
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    let ledge = platforms.create( 400, 400, 'ground')
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    player = game.add.sprite(32, game.world.height - 250, 'dude')

    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [4, 5, 6, 7], 10, true);

    stars = game.add.group()
    stars.enableBody = true;

    for (var i = 0; i < 12; i++) {
      let star = stars.create(i * 70, 0, 'star');

      star.body.gravity.y = 6;
      star.body.bounce.y = 0.7 + Math.random() * 0.2;
      player.body.collideWorldBounds = true;

    }
  }

  function update() {
    game.physics.arcade.collide(player, platforms)

    cursors = game.input.keyboard.createCursorKeys();
    player.body.velocity.x = 0;

    if ( cursors.left.isDown ) {
      player.body.velocity.x = -350;
      player.animations.play('left')
    } else if ( cursors.right.isDown ) {
      player.body.velocity.x = 350;
      player.animations.play('right')
    } else {
      player.animations.stop()
      player.frame = 4;
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.body.velocity.y = -350
    }

    game.physics.arcade.collide(stars, platforms)
    game.physics.arcade.overlap(player, stars, collectStar, null, this)

    function collectStar(player, star) {
      star.kill()
    }

  }

}, false);
