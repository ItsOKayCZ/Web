import { GLTFLoader } from './three.js/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import * as TWEEN from './tween.esm.js';
import SceneManager from './SceneManager.js';
window.onload = main;

let PAUSE_RENDERING = false;
const dontMoveCameraOnSceneIndex = [2];

let sceneManager;

let projectsInfo;

let scene;
let camera;
let renderer;
let controls;
let loader;
let raycast;
let mouse = {x: 0, y: 0};
const cameraMouse = {
	x: 0,
	y: 0,
};

let objectDescriptions = {};

const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 1, 0.5);
const DEFAULT_CAMERA_LOOK_POSITION = new THREE.Vector3(0, 0, -1.5);
const DEFAULT_CAMERA_ROTATION = new THREE.Vector3();

const hoverColor = new THREE.Color(0x222222);

async function main(){
	await loadObjectDescriptions();

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
			scrollDOMSelector: "#fakeScroll",
			sceneActions: {
				'2': {
					enter: zoomIntoComputerScreen,
					exit: zoomOutFromComputerScreen,
				},
			}
		});

		console.log(scene);
		setupObjectLinksEvents();

		render();
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

	setupCamera();

	raycast = new THREE.Raycaster();
	renderer.domElement.addEventListener('mousemove', (e) => {
		onDocumentMouseMove(e);
		setupRaycast(e);
	}, false);
	renderer.domElement.addEventListener('click', setupRaycast, false);

	await loadProjects();
	setupProjectEvents();

	window.onresize = () => {
		resizeCanvas();
		checkIfWideScreen();
	};
}

function checkIfWideScreen(){
	if(window.innerWidth <= 600){
		PAUSE_RENDERING = true;
	} else {
		PAUSE_RENDERING = false;
		requestAnimationFrame(render);
	}
}

function resizeCanvas(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	render();
}

function onDocumentMouseMove(e){
	cameraMouse.x = (e.clientX - window.innerWidth / 2);
}

function setupProjectEvents(){
	document.querySelector('.closeIcon').onclick = closePreviewWindow;

	let projectDOMs = document.querySelectorAll('.project');
	for(let projectDOM of projectDOMs){
		projectDOM.onmouseover = changePreview;
		projectDOM.onmouseout = changePreview;
	}
}
function changePreview(e){
	let DOM = getParentByClass(e.target, 'project').children[0];
	let projectData = JSON.parse(DOM.dataset.projectData);

	let type = e.type;
	if(type == 'mouseover')
		DOM.style.backgroundImage = `url(${projectData.source.hover})`;
	else if(type == 'mouseout')
		DOM.style.backgroundImage = `url(${projectData.source.preview})`;
}
function setupObjectLinksEvents(){
	for(const objName of Object.keys(objectDescriptions)){
		const obj = objectDescriptions[objName];
		if(!obj.link)
			continue;

		scene.getObjectByName(objName, true).onclick = function(){
			window.open(obj.link, '_blank');
		};
	}
}

async function loadProjects(){
	let url = '/data/projects.json';

	let res = await fetch(url);

	projectsInfo = await res.json();

	addProjectsToProjectContainer();
}

function addProjectsToProjectContainer(){
	let projectContainerDOM = document.querySelector('.projectsContainer');

	for(let project of projectsInfo){
		let projectDOM = document.createElement('div');
		projectDOM.classList.add('project');

		let projectPreviewDOM = document.createElement('div');
		projectPreviewDOM.classList.add('projectPreview');
		projectPreviewDOM.style.backgroundImage = `url('${project.source.preview}')`;
		projectPreviewDOM.dataset.projectData = JSON.stringify(project);

		let clickContainer = document.createElement('div');
		clickContainer.classList.add('clickContainer');

		let mouseIcon = document.createElement('i');
		mouseIcon.classList.add('clickIcon');
		mouseIcon.classList.add('fas');
		mouseIcon.classList.add('fa-hand-pointer');
		clickContainer.appendChild(mouseIcon);

		let clickMeText = document.createElement('p');
		clickMeText.innerText = 'Click me';
		clickContainer.appendChild(clickMeText);

		let backgroundColorDOM = document.createElement('div');
		backgroundColorDOM.classList.add('backgroundColorOpacity');
		projectPreviewDOM.appendChild(backgroundColorDOM);

		projectPreviewDOM.appendChild(clickContainer);
		projectDOM.appendChild(projectPreviewDOM);
		projectContainerDOM.insertAdjacentElement('afterbegin', projectDOM);

		projectDOM.onclick = function(e){
			let DOM = getParentByClass(e.target, 'projectPreview');
			let projectData = JSON.parse(DOM.dataset.projectData);

			setupPreviewWindow(projectData);
		}

	}
}

function setupPreviewWindow(projectData){
	document.querySelector('#projectName').innerText = projectData.name;

	document.querySelector('#previewIframe').src = projectData.link;

	document.querySelector('#sourceCodeLink').href = projectData.code;
	document.querySelector('#newTabLink').href = projectData.link;

	document.querySelector('.previewContainer').style.display = 'flex';
}

function closePreviewWindow(){
	document.querySelector('.previewContainer').style.display = '';
}

function getParentByClass(DOM, className){
	while(DOM.parentElement != null){
		if(DOM.classList.contains(className))
			break;
		DOM = DOM.parentElement;
	}

	return DOM;
}

function setupCamera(){
	camera.position.copy(DEFAULT_CAMERA_POSITION);
	camera.lookAt(DEFAULT_CAMERA_LOOK_POSITION);
	DEFAULT_CAMERA_ROTATION.copy(camera.rotation);
}

function moveCamera(newPosition, newRotation, onComplete=null){
	let fromAttributes = {
		posX: camera.position.x,
		posY: camera.position.y,
		posZ: camera.position.z,

		rotX: camera.rotation.x,
		rotY: camera.rotation.y,
		rotZ: camera.rotation.z,
	};

	let toAttributes = {
		posX: newPosition.x,
		posY: newPosition.y,
		posZ: newPosition.z,

		rotX: newRotation.x,
		rotY: newRotation.y,
		rotZ: newRotation.z,
	};

	const tween = new TWEEN.Tween(fromAttributes)
		.to(toAttributes, 1000)
		.easing(TWEEN.Easing.Quartic.InOut)
		.onUpdate((tweenAttr) => {
			camera.position.set(tweenAttr.posX, tweenAttr.posY, tweenAttr.posZ);

			camera.rotation.x = tweenAttr.rotX;
			camera.rotation.y = tweenAttr.rotY;
			camera.rotation.z = tweenAttr.rotZ;
		});

	if(onComplete != null)
		tween.onComplete(onComplete);

	tween.start();
}

function displayProjects(){
	let projectsContainer = document.querySelector('.projectsContainer');
	projectsContainer.classList.add('displayProjectsContainer');
}
function hideProjects(){
	let projectsContainer = document.querySelector('.projectsContainer');
	projectsContainer.classList.remove('displayProjectsContainer');
}
function zoomIntoComputerScreen(){
	const promise = new Promise((resolve, reject) => {
		let screenMesh = scene.getObjectByName('Screen', true);

		let position = screenMesh.position.clone();
		position.y += 0.01;
		position.z += 0.15;
		let rotation = screenMesh.rotation.clone();

		moveCamera(position, rotation, () => {
			displayProjects();
			resolve();
		});
	});

	return promise;
}
function zoomOutFromComputerScreen(){
	const promise = new Promise((resolve, reject) => {
		hideProjects();
		moveCamera(DEFAULT_CAMERA_POSITION, DEFAULT_CAMERA_ROTATION, resolve);
	});

	return promise;
}

async function loadObjectDescriptions(){
	let URL = 'data/descriptions.json';

	let res = await fetch(URL);

	objectDescriptions = await res.json();
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

		if(!isObjectInArray(chosenObjects, object)){
			if(object.parent.type == 'Group')
				chosenObjects.push(object.parent);
			else
				chosenObjects.push(object);
		}
	}

	let hoveredObject = null;
	for(let object of currentSceneObjects.children){
		if(isObjectInArray(chosenObjects, object)){
			changeEmissiveColor(object, hoverColor);

			hoveredObject = object;
		} else {
			changeEmissiveColor(object, new THREE.Color(0, 0, 0));
		}
	}

	if(hoveredObject != null && e.type == 'click' && hoveredObject.onclick)
		hoveredObject.onclick();

	if(hoveredObject != null){
		renderer.domElement.classList.add('hoverObject');
		displayDescriptionOfObject(hoveredObject);
	} else {
		renderer.domElement.classList.remove('hoverObject');
		hideDescription();
	}

}

function hideDescription(){
	document.querySelector('.descriptionContainer').classList.remove('showDescriptionContainer');
}
function displayDescriptionOfObject(object){
	let name = object.name;
	if(!objectDescriptions[name]){
		return;
	}

	let { header, description } = objectDescriptions[name];

	if(!header || !description){
		return;
	}

	let descriptionDOM = document.querySelector('.descriptionContainer');
	let descriptionHeaderDOM = descriptionDOM.querySelector('.header');
	let descriptionTextDOM = descriptionDOM.querySelector('.text');

	descriptionHeaderDOM.innerText = header;
	descriptionTextDOM.innerText = description;

	descriptionDOM.classList.add('showDescriptionContainer');
}

function changeEmissiveColor(object, color){
	if(object.material == undefined){
		for(let obj of object.children){
			changeEmissiveColor(obj, color);
		}

		return;
	}

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

function moveCameraAroundCenterPoint(newPosition, lookAtPosition){
	new TWEEN.Tween({
		position: JSON.parse(JSON.stringify(camera.position)),
	})
	.to({
		position: JSON.parse(JSON.stringify(newPosition))
	}, 100)
	.easing(TWEEN.Easing.Linear.None)
	.onUpdate((tweenAttr) => {
		camera.position.set(tweenAttr.position.x, tweenAttr.position.y, tweenAttr.position.z);

		camera.lookAt(lookAtPosition.x, lookAtPosition.y, lookAtPosition.z);
	}).start();
}

function render(time){
	const newCameraPosition = camera.position.clone();
	newCameraPosition.x = (cameraMouse.x - newCameraPosition.x) * 0.001;
	if(!dontMoveCameraOnSceneIndex.includes(sceneManager.getDisplayedSceneIndex()) && !newCameraPosition.equals(camera.position))
		moveCameraAroundCenterPoint(newCameraPosition, DEFAULT_CAMERA_LOOK_POSITION);

	TWEEN.update(time);
	renderer.render(scene, camera);

	if(!PAUSE_RENDERING)
		requestAnimationFrame(render);
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
