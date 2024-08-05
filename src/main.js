import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer;
let collectibles = [];
const totalCollectibles = 100;
let collectedCount = 0;
let player;
const playerSpeed = 0.5;

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

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const keyboard = {};

function onMouseMove(event) {
    // Normalize mouse coordinates to [-1, 1] range
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function onKeyDown(event) {
    keyboard[event.key] = true;
}

function onKeyUp(event) {
    keyboard[event.key] = false;
}

function checkCollection() {
    // Update the raycaster's ray with the current camera and mouse position
    raycaster.updateMatrixWorld();  // Ensure raycaster matrix is updated
    raycaster.ray.origin.setFromCamera(mouse, camera);

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

function update() {
    checkCollection();
    if (player) {
        handlePlayerMovement();
    }
}

function handlePlayerMovement() {
    if (keyboard['ArrowUp']) player.position.z -= playerSpeed;
    if (keyboard['ArrowDown']) player.position.z += playerSpeed;
    if (keyboard['ArrowLeft']) player.position.x -= playerSpeed;
    if (keyboard['ArrowRight']) player.position.x += playerSpeed;
}

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

function updateCollectedCount() {
    document.getElementById('collectibleCount').textContent = `Collectibles: ${collectedCount}/${totalCollectibles}`;
}

function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

init();
