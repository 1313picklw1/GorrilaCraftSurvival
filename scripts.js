let scene, camera, renderer;
let collectibles = [];
const totalCollectibles = 100;
let collectedCount = 0;
let player; // To hold the player model
const playerSpeed = 0.5; // Adjust speed as needed

function init() {
    // Initialize scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 50;

    // Load models
    loadModels();
    loadPlayer();

    // Handle window resizing
    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();

    // Start animation loop
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
    const loader = new THREE.GLTFLoader();

    loader.load('models/combined_blocks.glb', (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
            if (child.isMesh) {
                switch (child.name) {
                    case 'GrassBlock':
                        // Customize GrassBlock properties if needed
                        break;
                    case 'StoneBlock':
                        // Customize StoneBlock properties if needed
                        break;
                    case 'OakPlanks':
                        // Customize OakPlanks properties if needed
                        break;
                    case 'Cobblestone':
                        // Customize Cobblestone properties if needed
                        break;
                    default:
                        // Handle any other models
                        break;
                }

                let mesh = child.clone();
                mesh.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
                mesh.scale.set(5, 5, 5); // Adjust scale as needed
                scene.add(mesh);
                collectibles.push(mesh);
            }
        });
    }, undefined, (error) => {
        console.error('An error happened:', error);
    });
}

function loadPlayer() {
    const loader = new THREE.GLTFLoader();

    loader.load('models/gorrila.glb', (gltf) => {
        player = gltf.scene;
        player.scale.set(2, 2, 2); // Adjust scale as needed
        player.position.set(0, 0, 0); // Start position
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
            // Handle collection logic
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
    const keyboard = {}; // You can use an object to track pressed keys

    // Handle keyboard input for movement
    if (keyboard['ArrowUp']) player.position.z -= playerSpeed;
    if (keyboard['ArrowDown']) player.position.z += playerSpeed;
    if (keyboard['ArrowLeft']) player.position.x -= playerSpeed;
    if (keyboard['ArrowRight']) player.position.x += playerSpeed;
}

function updateCollectedCount() {
    document.getElementById('collectibleCount').textContent = `Collectibles: ${collectedCount}/${totalCollectibles}`;
}

// Keyboard event listeners
window.addEventListener('keydown', (event) => {
    keyboard[event.key] = true;
});
window.addEventListener('keyup', (event) => {
    keyboard[event.key] = false;
});

// Initialize the scene
init();
