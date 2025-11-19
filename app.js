let config = {
    renderer: Phaser.AUTO, //chooses canvas automatically 
    width: 800, //sets width and height of the game window
    height: 600,
    physics: {
        default: 'arcade', //enables arcade physics engine
        arcade: {  //gravity pulls down at 300
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: { //difines three main game finctions 
        preload: preload, //load images
        create: create, //build game objects 
        update: update // updates the view
    }
};

let game = new Phaser.Game(config); // creates actual phaser game
let bird; //player sprite
let hasLanded = false; //true if bird touches ground
let cursors; // arrow key controls
let hasBumped = false; // true if bird hits column

let isGameStarted = false; //game starts after user presses space
let messageToPlayer; //text displayed to user

function preload() { //loads all images before game starts 
    this.load.image('background', 'assets/background.png');
    this.load.image('road', 'assets/road.png');
    this.load.image('column', 'assets/column.png');
    this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96 });
}

function create() {
    //puts background at top left
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0); 

    //objects that dont move
    const roads = this.physics.add.staticGroup(); 

    // creates top columns 
    const topColumns = this.physics.add.staticGroup({
        key: 'column',
        repeat: 1, 
        setXY: { x: 200, y: 0, stepX: 300 }
    })

    // creates bottom columns
    const bottomColumns = this.physics.add.staticGroup({
        key: 'column',
        repeat: 1, 
        setXY: { x: 350, y: 400, stepX: 300 },
    });
    const road = roads.create(400, 568, 'road').setScale(2).refreshBody(); //adds road


    bird = this.physics.add.sprite(0, 50, 'bird').setScale(2);
    //gives bird bounce
    bird.setBounce(0.2); 
    //keeps bord from leaving screen
    bird.setCollideWorldBounds(true); 

    //prevents bird from falling through ground
    this.physics.add.overlap(bird, road, () => hasLanded = true, null, this); 
    this.physics.add.collider(bird, road); 

    //handles collisions with columns
    this.physics.add.overlap(bird, topColumns, () => hasBumped = true, null, this);
    this.physics.add.overlap(bird, bottomColumns, () => hasBumped = true, null, this);
    this.physics.add.collider(bird, topColumns); 
    this.physics.add.collider(bird, bottomColumns); 

    //enables key controls
    cursors = this.input.keyboard.createCursorKeys(); 

    //displays text to user
    messageToPlayer = this.add.text(0, 0, 'Instructions: Press space bar to start', { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "20px", color: "black", backgroundColor: "white" });
    Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 0, 50); 
}

function update() {
    //when player presses space the game begins
    if (cursors.space.isDown && !isGameStarted) {
        isGameStarted = true; 
        messageToPlayer.text = 'Instructions: Press the "^" button to stay upright\nAnd don\'t hit the columns or ground';
    }
    //bird move upward until the game starts
    if (!isGameStarted) {
        bird.setVelocityY(-160); 
    }

    // Move bird upwards
    if (cursors.up.isDown && !hasLanded && !hasBumped) {
        bird.setVelocityY(-160);
    }

    //conditions to move right and stop moving
    if (isGameStarted && (!hasLanded || !hasBumped)) {
        bird.body.velocity.x = 50;
    } else {
        bird.body.velocity.x = 0;
    }

    //shows message when bird crashes
    if (hasLanded || hasBumped) {
        messageToPlayer.text = 'Oh no! You crashed!'
    }

    //conditions for when player wins
    if (bird.x > 750) {
        bird.setVelocityY(40);
        messageToPlayer.text = 'Congrats! You won!'
    }
}