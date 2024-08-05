import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
    onWindowResize();

    animate();
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

function loadModels() {
    const loader = new GLTFLoader();

    // Load blocks
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

    // Load collectibles
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

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', onMouseMove, false);

function checkCollection() {
    raycaster.updateMatrixWorld();
    raycaster.ray.origin.setFromCamera(mouse, camera);
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
    const keyboard = {}; 

    if (keyboard['ArrowUp']) player.position.z -= playerSpeed;
    if (keyboard['ArrowDown']) player.position.z += playerSpeed;
    if (keyboard['ArrowLeft']) player.position.x -= playerSpeed;
    if (keyboard['ArrowRight']) player.position.x += playerSpeed;
}

function updateCollectedCount() {
    document.getElementById('collectibleCount').textContent = `Collectibles: ${collectedCount}/${totalCollectibles}`;
}

window.addEventListener('keydown', (event) => {
    keyboard[event.key] = true;
});
window.addEventListener('keyup', (event) => {
    keyboard[event.key] = false;
});

init();
