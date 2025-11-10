import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.querySelectorAll('.has-submenu > a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const submenu = this.nextElementSibling;
    const allSubmenus = document.querySelectorAll('.submenu');

    allSubmenus.forEach(sm => {
      if (sm !== submenu) sm.style.display = 'none';
    });

    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
  });
});

// Optional: Close submenu if user clicks outside
window.addEventListener('click', function (e) {
  if (!e.target.closest('.has-submenu')) {
    document.querySelectorAll('.submenu').forEach(sm => sm.style.display = 'none');
  }
});


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(10);

const material_3 = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

const Sphere = new THREE.SphereGeometry(15, 32, 16);
const S_Object = new THREE.Mesh(Sphere, material_3);

//------------------------Positions--------------------
S_Object.position.set(0, 0, 0);
//------------------------End of Positions--------------------


// ✅ Fixed GLTFLoader usage
let seagull; // Declare a variable to access it later

const loader = new GLTFLoader();
loader.load('/seagull.gltf', function (gltf) {
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
      });
    }
  });

  seagull = gltf.scene;
  seagull.scale.set(5, 5, 5);
  seagull.position.set(0, 0, 0);
  scene.add(seagull);
}, undefined, function (error) {
  console.error(error);
});



const ambientLight = new THREE.AmbientLight(0xffffff);
const gridHelper = new THREE.GridHelper(200, 50);

// scene.add(gridHelper);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

const movingSpheres = [];

function addShapes() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const sphere = new THREE.Mesh(geometry, material);

  // Random initial position
  sphere.position.set(
    THREE.MathUtils.randFloatSpread(250),
    THREE.MathUtils.randFloatSpread(250),
    THREE.MathUtils.randFloat(0, 250) // Start in front of the camera
  );

  // Only move along -Z
  sphere.userData.velocity = new THREE.Vector3(0, 0, -Math.random() * 0.5);

  scene.add(sphere);
  movingSpheres.push(sphere);
}


Array(250).fill().forEach(addShapes);


// const spaceTexture = new THREE.TextureLoader().load('space.png');
// scene.background = spaceTexture;

var globalaccessor = 0;

/*function moveCamera() {
  const t = (document.body.getBoundingClientRect().top - 20);
  camera.position.x = t * -0.0075;
  camera.position.y = t * -0.075;
}

document.body.onscroll = moveCamera;*/

let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // Animate seagull if it's loaded
  if (seagull) {
    // Bobbing up and down
    seagull.position.y = Math.sin(elapsed * 2) * 2;

    // Gentle tilting side to side
    seagull.rotation.z = Math.sin(elapsed) * 0.1;

    // Slowly moving forward (optional)
    //seagull.position.x += 0.02;
  }

  // Move spheres backwards
  movingSpheres.forEach((sphere) => {
    sphere.position.add(sphere.userData.velocity);
    if (sphere.position.z < -200) {
      sphere.position.z = THREE.MathUtils.randFloat(100, 250);
    }
  });

  controls.update();
  renderer.render(scene, camera);
}



animate();

const splashScreen = document.getElementById("splash-screen");

splashScreen.addEventListener("click", function () {
  splashScreen.style.opacity = "0";
  setTimeout(function () {
    splashScreen.style.display = "none";
  }, 600);
});
