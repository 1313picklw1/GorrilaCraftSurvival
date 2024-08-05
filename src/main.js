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
    window.addEventListener('mousemove', onMouseMove, false);
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

// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const keyboard = {};

// Handle mouse move
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

// Handle key down
function onKeyDown(event) {
    keyboard[event.key] = true;
}

// Handle key up
function onKeyUp(event) {
    keyboard[event.key] = false;
}

// Check for collectible intersections
function checkCollection() {
    // Update raycaster with camera and mouse position
    raycaster.updateMatrixWorld(); // Ensure the raycaster's matrix is updated

    // Calculate the ray direction based on the mouse position
    raycaster.ray.origin.copy(camera.position);
    raycaster.ray.direction.set(mouse.x, mouse.y, 1).unproject(camera).sub(raycaster.ray.origin).normalize();

    // Find intersections
    const intersects = raycaster.intersectObjects(collectibles);

    intersects.forEach(intersect => {
        if (collectibles.includes(intersect.object)) {
            scene.remove(intersect.object);
            collectibles = collectibles.filter(c => c !== intersect.object);
            collectedCount++;
            updateCollectedCount();
        }
    });
}

// Update game logic
function update() {
    checkCollection();
    if (player) {
        handlePlayerMovement();
    }
}

// Handle player movement
function handlePlayerMovement() {
    if (keyboard['ArrowUp']) player.position.z -= playerSpeed;
    if (keyboard['ArrowDown']) player.position.z += playerSpeed;
    if (keyboard['ArrowLeft']) player.position.x -= playerSpeed;
    if (keyboard['ArrowRight']) player.position.x += playerSpeed;
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

// Load collectible models
function loadCollectibles() {
    const loader = new GLTFLoader();

    loader.load('models/collectible.glb', (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                let mesh = child.clone();
                mesh.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
                mesh.scale.set(5, 5, 5);
                scene.add(mesh);
                collectibles.push(mesh);
            }
        });

        if (collectibles.length > totalCollectibles) {
            collectibles = collectibles.slice(0, totalCollectibles);
        }
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
