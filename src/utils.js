var scene    = null,
    camera   = null,
    renderer = null,
    controls = null,
    origin   = new THREE.Vector3(0,0,0),
    figuresGeo = [],
    obj = null,
    count = 0,
    toAlter = null;

function initScene(){
    scene  = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 10000); // aspecto - desde donde veo a donde (dende donde veo)

    // renderer = new THREE.WebGLRenderer();  // En donde la voy a poner
    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#app") });
    renderer.setClearColor(0x0099ff); // 0x333333
    renderer.setSize(window.innerWidth, window.innerHeight - 4); // tamano total   window.innerWidth, window.innerHeight 
    document.body.appendChild( renderer.domElement ); // agrego 

    createFistModel('./modelos/city/OBJ/', 'Amaryllis City.mtl', 'Amaryllis City.obj');
    // var controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0,3,40);
    // controls.update();
    controls = new THREE.PointerLockControls(camera,100,30,true,figuresGeo);  // NEW
    scene.add(controls.getPlayer());                                          // NEW
    // var size = 50;
    // var divisions = 50;
    // var gridHelper = new THREE.GridHelper( size, divisions ,0x000000, 0xffffff );
    // scene.add( gridHelper );
    camera.position.x = -35;
    camera.position.y = 7;
    camera.position.z = 25;
    createLight();
    initGUI();
    recoControls();
    ScreenOverlay(controls);                                                  // NEW
}