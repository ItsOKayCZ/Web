import { GLTFLoader } from './three.js/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import * as TWEEN from './tween.esm.js';
window.onload = main;

let sceneManager;

let scene;
let camera;
let renderer;
let controls;
let loader;
let raycast;
let mouse = {x: 0, y: 0};

const hoverColor = new THREE.Color(0x222222);

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

	// controls = new OrbitControls(camera, renderer.domElement);

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

		console.log(scene);
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
	// TODO: Change FOV on small devices
	// Source: https://stackoverflow.com/questions/22212152/threejs-update-camera-fov

	raycast = new THREE.Raycaster();
	renderer.domElement.addEventListener('mousemove', setupRaycast, false);

	render();
}

// Source: https://riptutorial.com/three-js/example/17088/object-picking---raycasting
function setupRaycast(e){
	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

	raycast.setFromCamera(mouse, camera);

	let currentSceneObjects = scene.getObjectByName(sceneManager.getCurrentSceneName());

	let intersects = raycast.intersectObjects(currentSceneObjects.children, true);

	let chosenObjects = [];
	for(let intersectedObject of intersects){
		let object = intersectedObject.object;

		if(!isObjectInArray(chosenObjects, object))
			chosenObjects.push(object);
	}

	for(let object of currentSceneObjects.children){
		if(isObjectInArray(chosenObjects, object)){
			renderer.domElement.classList.add('hoverObject');
			changeEmissiveColor(object, hoverColor);
		} else {
			renderer.domElement.classList.remove('hoverObject');
			changeEmissiveColor(object, new THREE.Color(0, 0, 0));
		}
	}
	// console.log(chosenObjects.map(obj => obj.name));
}

function changeEmissiveColor(object, color){
	if(object.material == undefined)
		object = object.children[0];
	console.log(object);

	let originColor = object.material.emissive;

	if(originColor.equals(color))
		return;

	 const tween = new TWEEN.Tween({ r: originColor.r, g: originColor.g, b: originColor.b })
	 	.to(color, 100)
	 	.easing(TWEEN.Easing.Quadratic.Out)
	 	.onUpdate((tweenColor) => {

	 		object.material.emissive = new THREE.Color(tweenColor.r, tweenColor.g, tweenColor.b).clone();
	 	}).start();
}

function isObjectInArray(arr, checkObject){
	for(let object of arr){
		if(object.uuid == checkObject.uuid)
			return true;
	}

	return false;
}

function render(time){
	requestAnimationFrame(render);
	TWEEN.update(time);
	renderer.render(scene, camera);
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
