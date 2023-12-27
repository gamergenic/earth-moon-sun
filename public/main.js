// const THREE = require('three'); // Not required since Three.js is included via CDN

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas') });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Texture loader
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('8k_earth_daymap.jpg');
const moonTexture = textureLoader.load('8k_moon.jpg');
const sunTexture = textureLoader.load('8k_sun.jpg');

// Geometry for a sphere
const earthGeometry = new THREE.SphereGeometry(1, 128, 128);

// Lit material with texture
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });

// Creating the sphere with the texture
const earthSphere = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthSphere);

const moonGeometry = new THREE.SphereGeometry(1, 64, 64);
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moonSphere = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moonSphere);
//moonSphere.position.set(-5, 3, 5);


const sunGeometry = new THREE.SphereGeometry(1, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sunSphere = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunSphere);
//sunSphere.position.set(500, 300, 500);


// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Color and intensity
directionalLight.position.set(500, 300, 500); // Position of the light
scene.add(directionalLight);

camera.position.z = 5;

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target = earthSphere.position;

const socket = io();

socket.on('earthRotation', (rotationY) => {
//    earthSphere.rotation.y = rotationY;
});

socket.on('earthPosition', (position) => {
    earthSphere.position.set(position.x, position.y, position.z);
});

socket.on('moonPosition', (position) => {
    moonSphere.position.set(position.x, position.y, position.z);
});

socket.on('sunPosition', (position) => {
    sunSphere.position.set(position.x, position.y, position.z);
    directionalLight.position.set(position.x, position.y, position.z);
});


socket.on('moonScale', (scale) => {
    moonSphere.scale.x = scale;
    moonSphere.scale.y = scale;
    moonSphere.scale.z = scale;
});

socket.on('earthScale', (scale) => {
    earthSphere.scale.x = scale;
    earthSphere.scale.y = scale;
    earthSphere.scale.z = scale;
});

socket.on('sunScale', (scale) => {
    sunSphere.scale.x = scale;
    sunSphere.scale.y = scale;
    sunSphere.scale.z = scale;
});


socket.on('earthQuat', (quat) => {
    earthSphere.quaternion.set(quat.x, quat.y, quat.z, quat.w);
});

socket.on('moonQuat', (quat) => {
    moonSphere.quaternion.set(quat.x, quat.y, quat.z, quat.w);
});

socket.on('sunQuat', (quat) => {
    sunSphere.quaternion.set(quat.x, quat.y, quat.z, quat.w);
});


const animate = function () {
    requestAnimationFrame(animate);

    // Update the orbit controls
    controls.update();

    renderer.render(scene, camera);
};

animate();
