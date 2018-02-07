game=new Phaser.Game(1920,1080,Phaser.CANVAS,"gameDiv",{preload: preload, create: create, update: update, render:render});

var asteroids;
var planets;

const FIRE = "fire";
const WATER = "water";
const EARTH = "earth";
const AIR = "air";
const ENERGY = "energy";

function preload() {
    game.load.image('asteroid', 'images/asteroid.png');
    game.load.image('planet', 'images/planet.png');
}

var mouseBody;
var mouseConstraint;

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.world.setBounds(0, 0, 1800, 1000);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.updateBoundsCollisionGroup();

   

    var asteroidCollisionGroup = game.physics.p2.createCollisionGroup();
    var planetCollisionGroup = game.physics.p2.createCollisionGroup();

    game.physics.p2.updateBoundsCollisionGroup();


    asteroids = game.add.group();
    planets = game.add.group();

    asteroids.inputEnableChildren = true;

    planets.enableBody = true;
    planets.physicsBodyType = Phaser.Physics.P2JS;

    asteroids.enableBody = true;
    asteroids.physicsBodyType = Phaser.Physics.P2JS;

    var asteroid;
    for (var i = 0; i < 8; i++) {
        asteroid = asteroids.create(game.world.randomX, game.world.randomY, 'asteroid')
        {
            this.worldType = randomElement();
        };

        var rand = game.rnd.realInRange(0, 3);
        asteroid.scale.setTo(rand, rand);
        asteroid.body.setCircle();
        asteroid.body.collideWorldBounds = true;
        game.physics.enable(asteroid, Phaser.Physics.ARCADE);
        //asteroid.body.velocity.x = game.rnd.integerInRange(-200, 200);
        //asteroid.body.velocity.y = game.rnd.integerInRange(-200, 200);
        
        asteroid.inputEnabled = true;
        asteroid.input.enableDrag(true);

        asteroid.input.useHandCursor = true;
        asteroid.events.onInputOver.add(traceThis, this)

        asteroid.events.onDragStart.add(onDragStart, asteroid);
        asteroid.events.onDragStop.add(onDragStop, asteroid);
    }

    var planet;
    for (var i = 0; i < 1; i++) {
        planet = planets.create(game.width / 2, game.height / 2, 'planet');
        planet.scale.setTo(0.3, 0.3);
        planet.body.setCircle(160);
        planet.body.collideWorldBounds = true;

        planet.inputEnabled = true;
        planet.input.enableDrag();
    }

    game.physics.p2.enable([asteroid, planet], false);

    mousebody = new Body();
    game.physics.p2.world.addBody(mouseBody);

    game.input.onDown.add(click, this);
    game.input.onUp.add(release, this);
    game.input.addMoveCallback(move, this);

}

function update() {

}

function render() {
}

function randomElement() {

}

function click(pointer) {

    var bodies = game.physics.p2.hitTest(pointer.position, [asteroid.body, planet.body]);

    // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
    var physicsPos = [game.physics.p2.pxmi(pointer.position.x), game.physics.p2.pxmi(pointer.position.y)];

    if (bodies.length) {
        var clickedBody = bodies[0];

        var localPointInBody = [0, 0];
        // this function takes physicsPos and coverts it to the body's local coordinate system
        clickedBody.toLocalFrame(localPointInBody, physicsPos);

        // use a revoluteContraint to attach mouseBody to the clicked body
        mouseConstraint = this.game.physics.p2.createRevoluteConstraint(mouseBody, [0, 0], clickedBody, [game.physics.p2.mpxi(localPointInBody[0]), game.physics.p2.mpxi(localPointInBody[1])]);
    }

}

function release() {

    // remove constraint from object's body
    game.physics.p2.removeConstraint(mouseConstraint);

}

function move(pointer) {

    // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
    mouseBody.position[0] = game.physics.p2.pxmi(pointer.position.x);
    mouseBody.position[1] = game.physics.p2.pxmi(pointer.position.y);

}

function traceThis() {

    console.log("Mouse Over");
}

function onDragStart(){
    this.body.static = true;
    this.body.x = game.input.activePointer.worldX;
    this.body.y = game.input.activePointer.worldY;
    console.log(this.body.x)
}

function onDragStop() {
    this.body.static = false;
}


