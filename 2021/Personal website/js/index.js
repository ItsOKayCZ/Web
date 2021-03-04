import { GLTFLoader } from './three.js/examples/jsm/loaders/GLTFLoader.js';
window.onload = main;

let sceneManager;

let scene;
let camera;
let renderer;
let loader;
function main(){

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(
		80,
		window.innerWidth / window.innerHeight, 0.1, 1000
	);

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

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

	let bottomPointLight = new THREE.PointLight(0xffffff, 1, 100);
	bottomPointLight.position.set(0, 2, 0);
	scene.add(bottomPointLight);

	let topPointLight = new THREE.PointLight(0xffffff, 0.5, 100);
	topPointLight.position.set(0, 1, 2);
	scene.add(topPointLight);

	camera.position.y = 0.8;
	camera.position.z = 0.5;
	camera.rotation.x = -0.2;
	console.log(scene);

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
