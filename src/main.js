// Initialization of scene variables

var scene    = null,
    camera   = null,
    renderer = null,
    controls = null,
    origin   = new THREE.Vector3(0,0,0),
    figuresGeo = [],
    obj = null,
    count = 0,
    toAlter = null;

// 
var sonido,
    ppPlayer = null,
    collidableMeshList = [],
    points = 0;

// Ambient Sounds
var ambientArtic,
    ambientbamboo,
    ambientMadag,
    ambientDesert

// Animal Sounds
var penguinSound,
    pandaSound,
    lemurSound,
    camelSound,
    duckSound

// Zoo Variables
var modelLoad,
    light = null,
    panda,
    lemur,
    penguin,
    camel,
    duck,
    man;

// This is called when the page starts
function start() {
    window.onresize = onWindowResize;
    initScene();
    animate();
}

// This starts when the scene starts
function initScene(){
    // Where I see it
    scene  = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 10000); 

    // where I put it
    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#app") });
    renderer.setClearColor(0x0099ff); // 0x333333
    renderer.setSize(window.innerWidth, window.innerHeight - 4); 
    document.body.appendChild( renderer.domElement ); 

    // Zoo and animals models
    createFistModel('./modelos/zoo/', 'zoo.mtl', 'zoo.obj');
    panda = createAnimal1('./modelos/animales/panda/', 'pandaAnimal.mtl', 'pandaAnimal.obj');
    camel = createAnimal2('./modelos/animales/camello/', 'camelloAnimal.mtl', 'camelloAnimal.obj');
    penguin = createAnimal3('./modelos/animales/pinguino/', 'pinguinoAnimal.mtl', 'pinguinoAnimal.obj');
    lemur = createAnimal4('./modelos/animales/lemur/', 'lemurAnimal.mtl', 'lemurAnimal.obj');
    duck = createAnimal5('./modelos/animales/pato/', 'patito.mtl', 'patito.obj');    

    createGuideMan('./modelos/guia/', 'guia.mtl', 'guia.obj');

    // Camera position
    camera.position.set(0,3,40);
    camera.position.x = -35;
    camera.position.y = 7;
    camera.position.z = 25;

    // SoundBoxes
    articBox();
    madagBox();
    bambooBox();
    desertBox();

    penguinBox();
    lemurBox();
    pandaBox();
    camelbox();
    duckBox();

    // Function calls
    defaultLight();
    recoControls();
    initSound();
    pricipalPlayer();
}

// Scene opction according to model
function ajustarEscenaSegunModelo() {
    // Model Dimensions
    var box = new THREE.Box3().setFromObject(modelLoad);
    var size = box.getSize(new THREE.Vector3());
    var center = box.getCenter(new THREE.Vector3());

    // Camera position
    camera.position.x = center.x;
    camera.position.y = center.y + size.y; 
    camera.position.z = center.z + size.z * 1.5; 

    // Scene limits
    var maxSize = Math.max(size.x, size.y, size.z);
    var minSize = Math.min(size.x, size.y, size.z);

    var maxDistance = maxSize * 2;
    var minDistance = minSize * -2;

    controls.maxDistance = maxDistance;
    controls.minDistance = minDistance;
}

// Player Collision
function pricipalPlayer() { 
    var geometry = new THREE.BoxGeometry(50, 50, 50, 10, 10, 10);
    var material = new THREE.MeshStandardMaterial({ color: 0x808A9B,
                                                    transparent: true,
                                                    opacity: 0 
                                                    });
    ppPlayer = new THREE.Mesh( geometry, material );
    ppPlayer.position.x = camera.position.x+70;
    ppPlayer.position.y = camera.position.y-7;
    ppPlayer.position.z = camera.position.z+600;
    scene.add(ppPlayer);
}

// Guide Model
function createGuideMan(generalPath,pathMtl,pathObj) {
    
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(generalPath);
    mtlLoader.setPath(generalPath);
    mtlLoader.load(pathMtl, function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(generalPath);
        objLoader.load(pathObj, function (object) {

            // Add man
            man = object;
            figuresGeo.push(modelLoad);
            scene.add(object);
            object.scale.set(30,30,30);

            // Man position
            object.position.y = 0;
            object.position.x = 0;
            object.position.z = 0;
            object.rotation.y = Math.PI;

            ppPlayer.add(object);
        });
    });
}

// Get off instructions and play
function go2Play() {
    document.getElementById('blocker').style.display = 'none';
}

// Set window size
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initial Sound
function initSound() { 

    const listener = new THREE.AudioListener();
    camera.add(listener);
    const audioLoader = new THREE.AudioLoader();

    // Artic & Penguin
    ambientArtic = new THREE.Audio( listener );
    audioLoader.load('./songs/artico.mp3', function( buffer ){
        ambientArtic.setBuffer( buffer );
        ambientArtic.setLoop( false );
        ambientArtic.setVolume( 0.5 );
    });
    penguinSound = new THREE.Audio( listener );
    audioLoader.load('./songs/pinguino.mp3', function( buffer ){
        penguinSound.setBuffer( buffer );
        penguinSound.setLoop( false );
        penguinSound.setVolume( 0.3 );
    });

    // Bamboo & Panda
    ambientbamboo = new THREE.Audio( listener );
    audioLoader.load('./songs/bamboo.mp3', function( buffer ){
        ambientbamboo.setBuffer( buffer );
        ambientbamboo.setLoop( false );
        ambientbamboo.setVolume( 0.5 );
    });
    pandaSound = new THREE.Audio( listener );
    audioLoader.load('./songs/panda.mp3', function( buffer ){
        pandaSound.setBuffer( buffer );
        pandaSound.setLoop( false );
        pandaSound.setVolume( 0.2 );
    });

    // Madag & Lemur
    ambientMadag = new THREE.Audio( listener );
    audioLoader.load('./songs/Madagascar.mp3', function( buffer ){
        ambientMadag.setBuffer( buffer );
        ambientMadag.setLoop( false );
        ambientMadag.setVolume( 0.5 );
    });
    lemurSound = new THREE.Audio( listener );
    audioLoader.load('./songs/lemur.mp3', function( buffer ){
        lemurSound.setBuffer( buffer );
        lemurSound.setLoop( false );
        lemurSound.setVolume( 0.5 );
    });

   // Desert & Camel
    ambientDesert = new THREE.Audio( listener );
    audioLoader.load('./songs/desierto.mp3', function( buffer ){
        ambientDesert.setBuffer( buffer );
        ambientDesert.setLoop( false );
        ambientDesert.setVolume( 0.5 );
    });
    camelSound = new THREE.Audio( listener );
    audioLoader.load('./songs/camello.mp3', function( buffer ){
        camelSound.setBuffer( buffer );
        camelSound.setLoop( false );
        camelSound.setVolume( 0.3 );
    });

    // Duck
    duckSound = new THREE.Audio( listener );
    audioLoader.load('./songs/pato.mp3', function( buffer ){
        duckSound.setBuffer( buffer );
        duckSound.setLoop( false );
        duckSound.setVolume( 0.5 );
    });
}

// Animal Information Cards

// Panda Card
function showPandaCard() {
    document.getElementById("pandaCard").style.display = "block";
}
function hidePandaCard() {
    document.getElementById("pandaCard").style.display = "none";
}
// Lemur Card
function showLemurCard() {
    document.getElementById("lemurCard").style.display = "block";
}
function hideLemurCard() {
    document.getElementById("lemurCard").style.display = "none";
}
// Penguin Card
function showPenguinCard() {
    document.getElementById("penguinCard").style.display = "block";
}
function hidePenguinCard() {
    document.getElementById("penguinCard").style.display = "none";
}
// Camel Card
function showCamelCard() {
    document.getElementById("camelCard").style.display = "block";
}
function hideCamelCard() {
    document.getElementById("camelCard").style.display = "none";
}
// Duck Card
function showDuckCard() {
    document.getElementById("duckCard").style.display = "block";
}
function hideDuckCard() {
    document.getElementById("duckCard").style.display = "none";
}

var movementSpeed = 20;
var rotationSpeed = 0.02;
var controls;

// Camera Movement
function recoControls() {
    document.addEventListener("keydown", onDocumentKeyDown, false);

    // Orbit controls initialization with camera
    controls = new THREE.OrbitControls(camera);

    function onDocumentKeyDown(event) {
        var keyCode = event.which;

        // Movimiento del personaje
        var moveDistance = movementSpeed;

        if (keyCode == 37 || keyCode == 65 || keyCode == 97) {
            // Izquierda
            ppPlayer.position.x -= moveDistance;
        } else if (keyCode == 39 || keyCode == 68 || keyCode == 100) {
            // Derecha
            ppPlayer.position.x += moveDistance;
        } else if (keyCode == 38 || keyCode == 87 || keyCode == 119) {
            // Arriba
            ppPlayer.position.z -= moveDistance;
        } else if (keyCode == 40 || keyCode == 83 || keyCode == 115) {
            // Abajo
            ppPlayer.position.z += moveDistance;
        } else if (keyCode == 27) {
            // Salir
            document.getElementById("blocker").style.display = 'block';
        } else if (keyCode == 49){
            //info
            hideCamelCard();
            hidePenguinCard();
            hideLemurCard();
            hideDuckCard();
            showPandaCard();
            camelSound.pause();
            penguinSound.pause();
            lemurSound.pause();
            duckSound.pause();
            pandaSound.play();
        } else if (keyCode == 50){
            hidePandaCard();
            hidePenguinCard();
            hideLemurCard();
            hideDuckCard();
            showCamelCard();
            pandaSound.pause();
            penguinSound.pause();
            lemurSound.pause();
            duckSound.pause();
            camelSound.play();
        } else if(keyCode == 51){
            hidePandaCard();
            hideCamelCard();
            hideLemurCard();
            hideDuckCard();
            showPenguinCard();
            pandaSound.pause();
            camelSound.pause();
            lemurSound.pause();
            duckSound.pause();
            penguinSound.play();
        } else if(keyCode == 52){
            hidePandaCard();
            hideCamelCard();
            hidePenguinCard();
            hideDuckCard();
            showLemurCard();
            pandaSound.pause();
            camelSound.pause();
            penguinSound.pause();
            duckSound.pause();
            lemurSound.play();
        } else if(keyCode == 53){
            hidePandaCard();
            hideCamelCard();
            hidePenguinCard();
            hideLemurCard();
            showDuckCard();
            pandaSound.pause();
            camelSound.pause();
            penguinSound.pause();
            lemurSound.pause();
            duckSound.play();
        } else if (keyCode == 76) {
            // Day Light
            toggleAmbientLight('Day');
        } else if (keyCode == 78) {
            // Night Light
            toggleAmbientLight('Night');
        } else {
            hidePandaCard();
            hideCamelCard();
            hidePenguinCard();
            hideLemurCard();
            hideDuckCard();
            pandaSound.pause();
            camelSound.pause();
            penguinSound.pause();
            lemurSound.pause();
            duckSound.pause();
        }
    }
    // Añade un listener para eventos de movimiento del mouse
    document.addEventListener('mousemove', onMouseMove, false);
}

// Mouse Movement
function onMouseMove(event) {
    // Calcula la rotación de la cámara según el movimiento del mouse
    var deltaX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var deltaY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    // Ajusta la velocidad de rotación según tu preferencia
    deltaX *= rotationSpeed;
    deltaY *= rotationSpeed;

    // Actualiza la orientación de la cámara con el movimiento del mouse
    controls.rotateLeft(deltaX);
    controls.rotateUp(deltaY);
}

// Sound Boxes
var opacidad = 0;

function articBox() {
    const geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    const material = new THREE.MeshStandardMaterial({ color: 0x229EED,
                                                      transparent: true,
                                                      opacity: opacidad
                                                        });

    mesh = new THREE.Mesh( geometry, material );
    
    mesh.scale.set(2,1,2)
    mesh.position.x = -300;
    mesh.position.y = 100;
    mesh.position.z = 200;
    
    mesh.name = "articBox";
    collidableMeshList.push(mesh);
    scene.add(mesh);
}

function penguinBox() {
    const geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    const material = new THREE.MeshStandardMaterial({ color: 0xE87B06,
                                                      transparent: true,
                                                      opacity: opacidad 
                                                        });

    mesh = new THREE.Mesh( geometry, material );
    
    mesh.scale.set(2,1,2)
    mesh.position.x = -400;
    mesh.position.y = 100;
    mesh.position.z = 150;
    
    mesh.name = "penguinBox";
    collidableMeshList.push(mesh);
    scene.add(mesh);
}

function madagBox() {
    const geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    const material = new THREE.MeshStandardMaterial({ color: 0x229EED,
                                                      transparent: true,
                                                      opacity: opacidad 
                                                        });

    mesh = new THREE.Mesh( geometry, material );
    
    mesh.scale.set(2,1,2)
    mesh.position.x = -185;
    mesh.position.y = 100;
    mesh.position.z = -200;
    
    mesh.name = "madagBox";
    collidableMeshList.push(mesh);
    scene.add(mesh);
}

function lemurBox() {
    const geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    const material = new THREE.MeshStandardMaterial({ color: 0xB85CD9,
                                                      transparent: true,
                                                      opacity: opacidad 
                                                        });

    mesh = new THREE.Mesh( geometry, material );
    
    mesh.scale.set(2,1,2)
    mesh.position.x = -100;
    mesh.position.y = 100;
    mesh.position.z = -310;
    
    mesh.name = "lemurBox";
    collidableMeshList.push(mesh);
    scene.add(mesh);
}

function bambooBox() {
    const geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    const material = new THREE.MeshStandardMaterial({ color: 0xB85CD9,
                                                      transparent: true,
                                                      opacity: opacidad 
                                                        });

    mesh = new THREE.Mesh( geometry, material );
    
    mesh.scale.set(2,1,2)
    mesh.position.x = 215;
    mesh.position.y = 100;
    mesh.position.z = -200;
    
    mesh.name = "bambooBox";
    collidableMeshList.push(mesh);
    scene.add(mesh);
}

function pandaBox() {
    const geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    const material = new THREE.MeshStandardMaterial({ color: 0x229EED,
                                                      transparent: true,
                                                      opacity: opacidad 
                                                        });

    mesh = new THREE.Mesh( geometry, material );
    
    mesh.scale.set(2,1,2)
    mesh.position.x = 130;
    mesh.position.y = 100;
    mesh.position.z = -310;
    
    mesh.name = "pandaBox";
    collidableMeshList.push(mesh);
    scene.add(mesh);
}

function desertBox() {
    const geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    const material = new THREE.MeshStandardMaterial({ color: 0xE87B06,
                                                      transparent: true,
                                                      opacity: opacidad 
                                                        });

    mesh = new THREE.Mesh( geometry, material );
    
    mesh.scale.set(2,1,2)
    mesh.position.x = 300;
    mesh.position.y = 100;
    mesh.position.z = 200;
    
    mesh.name = "desertBox";
    collidableMeshList.push(mesh);
    scene.add(mesh);
}

function camelbox() {
    const geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    const material = new THREE.MeshStandardMaterial({ color: 0x229EED,
                                                      transparent: true,
                                                      opacity: opacidad 
                                                        });

    mesh = new THREE.Mesh( geometry, material );
    
    mesh.scale.set(2,1,2)
    mesh.position.x = 400;
    mesh.position.y = 100;
    mesh.position.z = 150;
    
    mesh.name = "camelBox";
    collidableMeshList.push(mesh);
    scene.add(mesh);
}

function duckBox() {
    const geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    const material = new THREE.MeshStandardMaterial({ color: 0x808A9B,
                                                      transparent: true,
                                                      opacity: opacidad 
                                                        });

    mesh = new THREE.Mesh( geometry, material );
    
    mesh.scale.set(2,1,2)
    mesh.position.x = 550;
    mesh.position.y = 100;
    mesh.position.z = -70;
    
    mesh.name = "duckBox";
    collidableMeshList.push(mesh);
    scene.add(mesh);
}

// Animate function
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    collisionAnimate();
}

// Collision of Sounds
function collisionAnimate() {
    var originPoint = ppPlayer.position.clone();
    var collidedObjectName;

    for (var vertexIndex = 0; vertexIndex < ppPlayer.geometry.vertices.length; vertexIndex++) {
        var localVertex = ppPlayer.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(ppPlayer.matrix);
        var directionVector = globalVertex.sub(ppPlayer.position);

        var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(collidableMeshList);

        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
            collidedObjectName = collisionResults[0].object.name;
            console.log('Colisión con: ' + collidedObjectName);

            switch(collidedObjectName){
                case "articBox":
                    console.log('Entrando a zona artica');
                    ambientArtic.play();
                    break;
                case "penguinBox":
                    console.log('Pinguino');
                    penguinSound.play();
                    break;
                case "lemurBox":
                    console.log('Lemur');
                    lemurSound.play();
                    break;
                case "madagBox":
                    console.log('Entrando a zona madagascar');
                    ambientMadag.play();
                    break;
                case "bambooBox":
                    console.log('Entrando a zona bamboo');
                    ambientbamboo.play();
                    break;
                case "pandaBox":
                    console.log('Panda');
                    pandaSound.play();
                    break;
                case "desertBox":
                    console.log('Entrando a zona desierto');
                    ambientDesert.play();
                    break;
                case "camelBox":
                    console.log('Camello');
                    camelSound.play();
                    break;
                case "duckBox":
                    console.log('Patito');
                    duckSound.play();
                    break;
            }

        } else {
            
        }
    }
}

// Zoo Model
function createFistModel(generalPath,pathMtl,pathObj) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(generalPath);
    mtlLoader.setPath(generalPath);
    mtlLoader.load(pathMtl, function (materials) {

        materials.preload();
        console.log(materials);
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(generalPath);
        objLoader.load(pathObj, function (object) {

            modelLoad = object;
            figuresGeo.push(modelLoad);
            scene.add(object);
            object.scale.set(50,50,50);

            object.position.y = -20;
            object.position.x = 0;
            object.position.z = 0;

            ajustarEscenaSegunModelo();
        });

    });
}

// panda Model
function createAnimal1(generalPath, pathMtl, pathObj) {
    
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(generalPath);
    mtlLoader.setPath(generalPath);
    mtlLoader.load(pathMtl, function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(generalPath);
        objLoader.load(pathObj, function (object) {

            // Add Panda
            panda = object;
            figuresGeo.push(modelLoad);
            scene.add(object);
            object.scale.set(55, 45, 55);

            // Panda position
            object.position.y = 10;
            object.position.x = 300;
            object.position.z = -385;
        });
    });

    return panda;
}

// Camel Model
function createAnimal2(generalPath,pathMtl,pathObj) {
    
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(generalPath);
    mtlLoader.setPath(generalPath);
    mtlLoader.load(pathMtl, function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(generalPath);
        objLoader.load(pathObj, function (object) {

            // Add Camel
            camel = object;
            figuresGeo.push(modelLoad);
            scene.add(object);
            object.scale.set(40,35,35);

            // Camel position
            object.position.y = 5;
            object.position.x = 280;
            object.position.z = 100;

            object.rotation.y = Math.PI / 2;
        });
    });

    return camel;
}

// Penguin Model
function createAnimal3(generalPath,pathMtl,pathObj) {
    
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(generalPath);
    mtlLoader.setPath(generalPath);
    mtlLoader.load(pathMtl, function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(generalPath);
        objLoader.load(pathObj, function (object) {

            // Add Penguin
            penguin = object;
            figuresGeo.push(modelLoad);
            scene.add(object);
            object.scale.set(15,15,15);

            // Penguin position
            object.position.y = 18;
            object.position.x = -420;
            object.position.z = 135;

            object.rotation.y = Math.PI / 2;
        });
    });

    return penguin;
}

// Lemur Model
function createAnimal4(generalPath,pathMtl,pathObj) {
    
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(generalPath);
    mtlLoader.setPath(generalPath);
    mtlLoader.load(pathMtl, function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(generalPath);
        objLoader.load(pathObj, function (object) {

            // Add Lemur
            lemur = object;
            figuresGeo.push(modelLoad);
            scene.add(object);
            object.scale.set(20,20,20);

            // Lemur position
            object.position.y = 40;
            object.position.x = -146;
            object.position.z = -272; 
        });
    });

    return lemur;
}

// duck Model
function createAnimal5(generalPath, pathMtl, pathObj) {
    
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(generalPath);
    mtlLoader.setPath(generalPath);
    mtlLoader.load(pathMtl, function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(generalPath);
        objLoader.load(pathObj, function (object) {

            // Add Duck
            duck = object;
            figuresGeo.push(modelLoad);
            scene.add(object);
            object.scale.set(15, 15, 15);

            // Duck position
            object.position.y = -11;
            object.position.x = 565;
            object.position.z = -80;
        });
    });

    return duck;
}

function defaultLight() {
    var defaultLight = new THREE.AmbientLight(0xffffff);
    defaultLight.position.set(10, 10, 10);
    scene.add(defaultLight);

    light = new THREE.DirectionalLight(0xffffff, 1.0, 1000);
    scene.add(light);
}   


// Day/Night Lights

// Day light
function createDayLight() {
    scene.remove(light);
    light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(0, 1, 0);
    scene.add(light);
}

// Night light
function createNightLight() {
    scene.remove(light);
    light = new THREE.PointLight(0xffffff, 0.6);
    light.position.set(0, 50, 0);
    scene.add(light);
}

// Change Lights
function toggleAmbientLight(timeOfDay) {
    console.log('Toggling ambient light to:', timeOfDay);
    scene.remove(light);

    switch (timeOfDay) {
        case 'Day':
            createDayLight();
            backgroundColor = 0x0099ff;
            break;
        case 'Night':
            createNightLight();
            backgroundColor = 0x000033;
            break;
    }
    renderer.setClearColor(backgroundColor);
}