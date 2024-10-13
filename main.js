import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
// seed data
const companies = [];
let allUsers = [];
let userIdCounter = 0;

for (let i = 0; i < 10; i++) {
  const companyId = 'company' + i;

  // Random number of users between 1 and 4
  const numUsers = Math.floor(Math.random() * 4) + 1;

  const users = [];
  for (let j = 0; j < numUsers; j++) {
    const userId = 'user' + userIdCounter++;
    users.push({ id: userId, companyId: companyId });
  }

  companies.push({ id: companyId, users: users });
  allUsers = allUsers.concat(users);
}
console.log(companies);
console.log(allUsers);
// Scene setup
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xcccccc);
scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

const aspect = window.innerWidth / window.innerHeight;
const scale = 7; // This is your equivalent "orthographic scale"

// Calculate frustum boundaries
const left = (-scale * aspect) / 2;
const right = (scale * aspect) / 2;
const top = scale / 2;
const bottom = -scale / 2;

const camera = new THREE.OrthographicCamera(
  left,
  right,
  top,
  bottom,
  -1000,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
geometry.translate(0, 0.5, 0);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = true; // Disable rotation
// controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
// controls.dampingFactor = 0.05;

// Helper Grid floor
const size = 100;
const divisions = 100;

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

camera.position.set(80, 30, 80);
camera.lookAt(cube);
controls.update(); //controls.update() must be called after any manual changes to the camera's transform
// For each company ID, create a circle and place it randomly on the grid. After that create users associated with that company and place them around company circle.
const ellipses = [];

companies.forEach(company => {
  // Create company circle geometry
  let radius = 0.5;
  let segments = 32;
  let circleGeometry = new THREE.CircleGeometry(radius, segments);
  // Create material with random color
  let color = new THREE.Color(Math.random(), Math.random(), Math.random());
  let circleMaterial = new THREE.MeshBasicMaterial({ color: color });
  // Create company mesh
  let circle = new THREE.Mesh(circleGeometry, circleMaterial);
  // 	// Random position within the grid size
  const x = Math.random() * size - size / 2;
  const z = Math.random() * size - size / 2;
  const y = 0.01; // Slightly above the grid
  let companyUsersColour = new THREE.Color(
    Math.random(),
    Math.random(),
    Math.random()
  );
  circle.position.set(x, y, z);
  circle.rotation.x = -Math.PI / 2;
  scene.add(circle);
  const ellipseXRadius = 5;
  const ellipseZRadius = 5;
  const curve = new THREE.EllipseCurve(
    0,
    0, // ax, aY
    ellipseXRadius,
    ellipseZRadius, // xRadius, yRadius
    0,
    2 * Math.PI, // aStartAngle, aEndAngle
    false, // aClockwise
    0 // aRotation
  );
  let points = curve.getPoints(50);
  let ellipseGeometry = new THREE.BufferGeometry().setFromPoints(points);
  let ellipseMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  let ellipse = new THREE.Line(ellipseGeometry, ellipseMaterial);
  ellipse.position.set(x, y, z);
  ellipse.rotation.x = Math.PI / 2; // Adjust the rotation speed as desired
  scene.add(ellipse);
  ellipses.push(ellipse);
  company.users.forEach((user, index) => {
    // Calculate the angle for this user
    let angle = (index / company.users.length) * 2 * Math.PI;
    // Parametric equations for the ellipse in the XZ-plane
    let userX = x + ellipseXRadius * Math.cos(angle);
    let userZ = z + ellipseZRadius * Math.sin(angle);
    let userY = y + 0.25; // Slightly above ground to account for cube height
    // Create user cube
    let cubeSize = 0.5;
    let userGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    let userMaterial = new THREE.MeshBasicMaterial({ color: color }); // Same color as company
    let userCube = new THREE.Mesh(userGeometry, userMaterial);
    // Set position of the cube
    userCube.position.set(userX, userY, userZ);
    user.mesh = userCube;
    userCube.lookAt(camera.position);
    scene.add(userCube);
  });
});

function animate() {
  controls.update();
  companies.forEach(company => {
    company.users.forEach(user => {
      console.log(user.mesh);
      user.mesh.lookAt(camera.position);
    });
  });
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
