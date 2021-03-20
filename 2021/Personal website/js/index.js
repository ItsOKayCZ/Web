import { GLTFLoader } from './three.js/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js';
window.onload = main;

let sceneManager;

let scene;
let camera;
let renderer;
let controls;
let loader;
function main(){

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xffffff);

	camera = new THREE.PerspectiveCamera(
		70,
		window.innerWidth / window.innerHeight, 0.1, 1000
	);

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	controls = new OrbitControls(camera, renderer.domElement);

	loader = new GLTFLoader();
	loader.load('models/Main scene.glb', function(gltf){
		scene.add(gltf.scene);

		sceneManager = new SceneManager({
			scene: scene,
			parts: 4,
			scrollDOMSelector: "#fakeScroll"
		});
	}, undefined, function(err){
		console.error(err);
	});

	let ambientLight = new THREE.AmbientLight(0x404040);
	scene.add(ambientLight);

	let spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(0, 2, 0);
	scene.add(spotLight);

	let spotLightHelper = new THREE.SpotLightHelper(spotLight);
	scene.add(spotLightHelper);

	camera.position.y = 0.8;
	camera.position.z = 0.5;
	camera.rotation.x = -0.4;
	console.log(scene);
	// TODO: Change FOV on small devices
	// Source: https://stackoverflow.com/questions/22212152/threejs-update-camera-fov

	render();
}

function createCube(x, y, z, color){
	const geometry = new THREE.BoxGeometry();
	const material = new THREE.MeshBasicMaterial( { color: color } );
	const cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
}


function render(){
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
