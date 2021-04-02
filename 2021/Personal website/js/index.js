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
	renderer.shadowMap.enabled = true;
	document.body.appendChild(renderer.domElement);

	controls = new OrbitControls(camera, renderer.domElement);

	loader = new GLTFLoader();
	loader.load('models/Main scene.glb', (gltf) => {
		gltf.scene.traverse(function(n) {
			if(n.isMesh){
				n.castShadow = true;
				n.receiveShadow = true;

				if(n.material.map) n.material.map.anisotropy = 1;
			}
		});

		scene.add(gltf.scene);

		sceneManager = new SceneManager({
			scene: scene,
			parts: 4,
			scrollDOMSelector: "#fakeScroll"
		});
	}, undefined, function(err){
		console.error(err);
	});

	let hemiLight = new THREE.HemisphereLight(0xffffff, 1);
	scene.add(hemiLight);

	let light = new THREE.SpotLight(0x404040, 1);
	light.position.set(0, 2, 1);
	light.castShadow = true;
	light.shadow.bias = -0.00203;
	light.shadow.mapSize.width = 4 * 1024;
	light.shadow.mapSize.height = 4 * 1024;
	scene.add(light);

	camera.position.y = 1;
	camera.position.z = 0.5;
	camera.rotation.x = -0.5;
	console.log(scene);
	// TODO: Change FOV on small devices
	// Source: https://stackoverflow.com/questions/22212152/threejs-update-camera-fov

	render();
}

function createCube(x, y, z, color){
	const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
	const material = new THREE.MeshStandardMaterial( { color: color } );
	const cube = new THREE.Mesh( geometry, material );
	cube.position.set(x, y, z);

	cube.receiveShadow = true;
	cube.castShadow = true;
	scene.add( cube );
}


function render(){
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
