let scene, camera, renderer;
let collectibles = [];
const totalCollectibles = 100;
let collectedCount = 0;

function init() {
    // Initialize scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 50;

    // Handle window resizing
    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();

    // Load 3D models
    loadModels();

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
                // Adjust properties for different models
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

                // Add the model to the scene and collectibles array
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
}

function updateCollectedCount() {
    document.getElementById('collectibleCount').textContent = `Collectibles: ${collectedCount}/${totalCollectibles}`;
}

// Initialize the scene
init();
