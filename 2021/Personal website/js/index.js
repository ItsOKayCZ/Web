import { GLTFLoader } from './three.js/examples/jsm/loaders/GLTFLoader.js';
window.onload = main;

let scrollHandler;

let scene;
let camera;
let renderer;
let loader;
function main(){
	scrollHandler = new ScrollHandler({
		DOMSelector: '#fakeScroll',
		parts: 4,
		easeFunction: EasingFunctions.linear
	});

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		80,
		window.innerWidth / window.innerHeight, 0.1, 1000
	);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	loader = new GLTFLoader();
	loader.load('models/Main scene.glb', function(gltf){
		scene.add(gltf.scene);
	}, undefined, function(err){
		console.error(err);
	});

	let bottomPointLight = new THREE.PointLight(0xffffff, 1, 100);
	bottomPointLight.position.set(0, 2, 0);
	scene.add(bottomPointLight);

	let topPointLight = new THREE.PointLight(0xffffff, 0.5, 100);
	topPointLight.position.set(0, 1, 2);
	scene.add(topPointLight);

	// const sphereSize = 1;
	// const bottomPointLightHelper = new THREE.PointLightHelper(bottomPointLight, sphereSize);
	// scene.add(bottomPointLightHelper);
	// const topPointLightHelper = new THREE.PointLightHelper(topPointLight, sphereSize);
	// scene.add(topPointLightHelper);

	// createCube(0, 0, 0, 0xffffff);

	camera.position.y = 0.7;
	camera.position.z = 0.5;
	// camera.lookAt(0, 0, 0);
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
