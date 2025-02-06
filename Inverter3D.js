import * as THREE from 'three';
import { AsciiEffect } from "three/addons/effects/AsciiEffect.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";

const threeRef = document.querySelector('div[ref="threeRef"]');

// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Initial aspect ratio set to 1
const renderer = new THREE.WebGLRenderer();

if (threeRef) {
  const { clientWidth, clientHeight } = threeRef;
  renderer.setSize(clientWidth, clientHeight);
  camera.aspect = clientWidth / clientHeight; // Update aspect ratio based on canvas size
  camera.updateProjectionMatrix();
}

const enableAsciiRendering = true; // Set this to true to enable ASCII rendering

let effect;
const characters = ' .:-+*=%@#steinmetz';
const effectSize = { amount: 0.25 };
const backgroundColor = 'black';
const ASCIIColor = 'white';

function createEffect() {
  if (threeRef) {
    effect = new AsciiEffect(renderer, characters, { invert: true, resolution: effectSize.amount });
    effect.setSize(threeRef.clientWidth, threeRef.clientHeight);
    effect.domElement.style.color = ASCIIColor;
    effect.domElement.style.backgroundColor = backgroundColor;
    effect.domElement.style.position = 'absolute'; // Ensure the effect is positioned correctly
    effect.domElement.style.top = '0';
    effect.domElement.style.left = '0';
  }
}

if (enableAsciiRendering) {
  createEffect();
  if (threeRef && effect) {
    threeRef.style.position = 'relative'; // Ensure the canvas is positioned correctly
    threeRef.appendChild(effect.domElement);
  }
} else {
  // Append the renderer's DOM element to ensure the mesh is visible when ASCII rendering is disabled
  if (threeRef) {
    threeRef.appendChild(renderer.domElement);
  }
}

// Add ambient light for general illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

// Add directional light to highlight the model
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

if (!enableAsciiRendering) {
  // Add lines on the axis to indicate where the mesh is rotating about
  const xAxisLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-100, 0, 0), new THREE.Vector3(100, 0, 0)]),
    new THREE.LineBasicMaterial({ color: 0xff0000 })
  );
  const yAxisLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -100, 0), new THREE.Vector3(0, 100, 0)]),
    new THREE.LineBasicMaterial({ color: 0x00ff00 })
  );
  const zAxisLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -100), new THREE.Vector3(0, 0, 100)]),
    new THREE.LineBasicMaterial({ color: 0x0000ff })
  );
  scene.add(xAxisLine, yAxisLine, zAxisLine);
}

// Load STL model from an online source for debugging
const stlLoader = new STLLoader();
stlLoader.load('./RenderAssem.STL', (geometry) => {
  if (!geometry) {
    console.error('Failed to load geometry');
    return;
  }
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  const object = new THREE.Object3D();
  mesh.position.set(-180, -30, -50);
  object.add(mesh);
  object.position.set(0, -75, 0);
  scene.add(object);

  // Log camera position for debugging
  console.log(`Camera position: x=${camera.position.x}, y=${camera.position.y}, z=${camera.position.z}`);

  // Log renderer size for debugging
  console.log(`Renderer size: width=${renderer.domElement.width}, height=${renderer.domElement.height}`);

  // Animation loop capped at 60fps
  let lastFrameTime = 0;
  const animate = function (time) {
    requestAnimationFrame(animate);
    const deltaTime = time - lastFrameTime;
    if (deltaTime < 1000 / 60) return; // Cap at 60fps
    lastFrameTime = time;

    object.rotation.y += 0.015;
    if (enableAsciiRendering && effect) {
      effect.render(scene, camera);
    } else {
      renderer.render(scene, camera);
    }
  };

  animate(performance.now());
}, undefined, (error) => {
  console.error('An error occurred while loading the STL model:', error);
});

camera.rotation.x = -(3.14159 / 5);
camera.position.z = 275;
camera.position.y = 75;

// Handle window resize
const handleResize = () => {
  if (threeRef) {
    const { clientWidth, clientHeight } = threeRef;
    renderer.setSize(clientWidth, clientHeight);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    if (effect) {
      effect.setSize(clientWidth, clientHeight);
    }
  }
};

window.addEventListener('resize', handleResize);

// Cleanup on component unmount
//return () => {
//  if (currentRef && effect) {
//    currentRef.removeChild(effect.domElement);
//  }
//  if (currentRef) {
//    currentRef.removeChild(renderer.domElement);
//  }
//  window.removeEventListener('resize', handleResize);
//};