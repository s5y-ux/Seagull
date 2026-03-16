import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Hamburger menu toggle (mobile only)
const hamburger = document.getElementById('hamburger');
const navbarLinks = document.getElementById('navbar-links');

if (hamburger && navbarLinks) {
  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    navbarLinks.classList.toggle('open');
    hamburger.textContent = navbarLinks.classList.contains('open') ? '\u2715' : '\u2630';
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.navbar')) {
      navbarLinks.classList.remove('open');
      hamburger.textContent = '\u2630';
    }
  });
}

// Submenu toggle — desktop: CSS hover; mobile: click toggles .open class
document.querySelectorAll('.has-submenu > a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const submenu = this.nextElementSibling;
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      document.querySelectorAll('.submenu').forEach(sm => {
        if (sm !== submenu) sm.classList.remove('open');
      });
      submenu.classList.toggle('open');
    } else {
      document.querySelectorAll('.submenu').forEach(sm => {
        if (sm !== submenu) sm.style.display = 'none';
      });
      submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    }
  });
});

// Close submenus when clicking outside
window.addEventListener('click', function (e) {
  if (!e.target.closest('.has-submenu')) {
    document.querySelectorAll('.submenu').forEach(sm => {
      sm.style.display = 'none';
      sm.classList.remove('open');
    });
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


const particleCount = window.innerWidth <= 768 ? 100 : 250;
Array(particleCount).fill().forEach(addShapes);

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
  console.log("Splash screen clicked");
  setTimeout(function () {
    splashScreen.style.display = "none";
  }, 600);
});
