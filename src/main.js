import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/loaders/GLTFLoader.js';

// Scene setup
let scene, camera, renderer;
let collectibles = [];
const totalCollectibles = 100;
let collectedCount = 0;
let player;
const playerSpeed = 0.5;

// Initialization function
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 50;

    loadModels();
    loadCollectibles();
    loadPlayer();

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);

    animate();
}

// Handle window resize
function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

// Keyboard input
const keyboard = {};

// Handle key down
function onKeyDown(event) {
    keyboard[event.key] = true;
}

// Handle key up
function onKeyUp(event) {
    keyboard[event.key] = false;
}

// Check for collectible proximity (player-object collision detection)
function checkCollection() {
    collectibles.forEach(collectible => {
        const distance = player.position.distanceTo(collectible.position);
        if (distance < 5) { // Adjust based on the scale of your objects
            scene.remove(collectible);
            collectibles = collectibles.filter(c => c !== collectible);
            collectedCount++;
            updateCollectedCount();
        }
    });
}

// Update game logic
function update() {
    applyGravity();
    checkCollection();
    if (player) {
        handlePlayerMovement();
    }
}

// Handle player movement (including 3D movement with optional jumping/flying)
function handlePlayerMovement() {
    if (keyboard['ArrowUp']) player.position.z -= playerSpeed;
    if (keyboard['ArrowDown']) player.position.z += playerSpeed;
    if (keyboard['ArrowLeft']) player.position.x -= playerSpeed;
    if (keyboard['ArrowRight']) player.position.x += playerSpeed;
    if (keyboard[' '] && player.position.y <= 1) player.position.y += playerSpeed; // Jump
    if (keyboard['Shift']) player.position.y -= playerSpeed; // Move down
}

// Apply gravity to player (optional)
function applyGravity() {
    if (player.position.y > 0) {
        player.position.y -= 0.1; // Adjust gravity speed
    }
}

// Load block models
function loadModels() {
    const loader = new GLTFLoader();

    loader.load('models/combined_blocks.glb', (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                let mesh = child.clone();
                mesh.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
                mesh.scale.set(5, 5, 5);
                scene.add(mesh);
            }
        });
    }, undefined, (error) => {
        console.error('An error happened while loading blocks model:', error);
    });
}

// Load collectible models (limited to totalCollectibles)
function loadCollectibles() {
    const loader = new GLTFLoader();

    loader.load('models/collectible.glb', (gltf) => {
        let count = 0;
        gltf.scene.traverse((child) => {
            if (child.isMesh && count < totalCollectibles) {
                let mesh = child.clone();
                mesh.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
                mesh.scale.set(5, 5, 5);
                scene.add(mesh);
                collectibles.push(mesh);
                count++;
            }
        });
    }, undefined, (error) => {
        console.error('An error happened while loading collectibles model:', error);
    });
}

// Load player model
function loadPlayer() {
    const loader = new GLTFLoader();

    loader.load('models/gorrila.glb', (gltf) => {
        player = gltf.scene;
        player.scale.set(2, 2, 2);
        player.position.set(0, 0, 0);
        scene.add(player);
    }, undefined, (error) => {
        console.error('An error happened while loading the player model:', error);
    });
}

// Update collected count display
function updateCollectedCount() {
    document.getElementById('collectibleCount').textContent = `Collectibles: ${collectedCount}/${totalCollectibles}`;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

init();
