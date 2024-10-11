import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const scene = new THREE.Scene();
// scene.background = new THREE.Color( 0xcccccc );
scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

const aspect = window.innerWidth / window.innerHeight;
const scale = 7; // This is your equivalent "orthographic scale"

// Calculate frustum boundaries
const left = -scale * aspect / 2;
const right = scale * aspect / 2;
const top = scale / 2;
const bottom = -scale / 2;

const camera = new THREE.OrthographicCamera(left, right, top, bottom, 0, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
geometry.translate( 0, 0.5, 0 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
// controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableRotate = false; // Disable rotation
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.005;

// Helper Grid floor
const size = 100;
const divisions = 100;

const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

camera.position.set( 8, 3, 8 );
camera.lookAt(cube)
controls.update(); //controls.update() must be called after any manual changes to the camera's transform

function animate() {
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
