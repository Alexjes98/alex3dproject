import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const helper = new THREE.CameraHelper(camera);
scene.add(helper);
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setX(0);
camera.position.setY(0);
camera.position.setZ(50);
camera.lookAt(0, 0, 0);

renderer.render(scene, camera);

let celestialBodiesModels = [];
function createPlanet(
  x,
  y,
  z,
  radius = 1,
  width = 1,
  height = 1,
  opacity = 1,
  texture,
  planetName
) {
  const geometry = new THREE.SphereGeometry(radius, width, height);
  const mesh = new THREE.TextureLoader().load(texture);
  const material = new THREE.MeshPhysicalMaterial({
    map: mesh,
    depthTest: true,
    depthWrite: true,
  });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.set(x, y, z);
  scene.add(planet);
  //planet name
  const loader = new FontLoader();
  loader.load("/assets/fonts/optimer_bold.typeface.json", function (font) {
    const textGeo = new TextGeometry(planetName || "No name", {
      font: font,
      size: 2,
      height: 1,
    });
    const textMaterial = new THREE.MeshNormalMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(textGeo, textMaterial);
    mesh.position.set(x, y + radius + 5, z);
    scene.add(mesh);
  });
  return planet;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function configureSun() {
  const sunPosition = new THREE.Vector3(30, 0, 0);
  const sunLight = new THREE.PointLight(0xffffff, 25000, 0, 1.7);
  sunLight.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(30, 30, 30),
    new THREE.MeshBasicMaterial({
      depthTest: true,
      map: new THREE.TextureLoader().load("/assets/img/textures/2k_sun.jpg"),
    })
  );
  sunLight.add(sunMesh);
  const sunLightHelper = new THREE.PointLightHelper(sunLight, 1);
  celestialBodiesModels.push({
    instance: sunMesh,
    rotationSpeed: 0.01,
    orbitSpeed: 0,
    name: "Sun",
  });
  scene.add(sunLight, sunLightHelper);
  //sun name
  const loader = new FontLoader();
  loader.load("/assets/fonts/optimer_bold.typeface.json", function (font) {
    const textGeo = new TextGeometry("The sun", {
      font: font,
      size: 2,
      height: 1,
    });
    const textMaterial = new THREE.MeshNormalMaterial({
      color: 0xff0000,
    });
    const mesh = new THREE.Mesh(textGeo, textMaterial);
    mesh.position.set(sunPosition.x, 25, sunPosition.z);
    mesh.rotation.set(0, 5.5, 0);
    scene.add(mesh);
  });
}

function configurePlanets() {
  celestialBodiesModels.push({
    instance: createPlanet(
      -120,
      0,
      -110,
      2.44,
      20,
      20,
      1,
      "/assets/img/textures/2k_mercury.jpg",
      "Mercury"
    ),
    rotationSpeed: 0.05,
    orbitSpeed: 0,
    name: "Mercury",
  });
  celestialBodiesModels.push({
    instance: createPlanet(
      190,
      0,
      -115,
      6.052,
      20,
      20,
      1,
      "/assets/img/textures/2k_venus_surface.jpg",
      "Venus"
    ),
    rotationSpeed: 0.01,
    orbitSpeed: 0,
    name: "Venus",
  });
  celestialBodiesModels.push({
    instance: createPlanet(
      -100,
      0,
      364,
      6.371,
      20,
      20,
      1,
      "/assets/img/textures/2k_earth_daymap.jpg",
      "Earth"
    ),
    rotationSpeed: 0.01,
    orbitSpeed: 0,
    name: "Earth",
  });
  celestialBodiesModels.push({
    instance: createPlanet(
      -350,
      0,
      0,
      3.39,
      20,
      20,
      1,
      "/assets/img/textures/2k_mars.jpg",
      "Mars"
    ),
    rotationSpeed: 0.01,
    orbitSpeed: 0,
    name: "Mars",
  });
  celestialBodiesModels.push({
    instance: createPlanet(
      -330,
      0,
      -234,
      39.911,
      20,
      20,
      1,
      "/assets/img/textures/2k_jupiter.jpg",
      "Jupiter"
    ),
    rotationSpeed: 0.01,
    orbitSpeed: 0,
    name: "Jupiter",
  });
  celestialBodiesModels.push({
    instance: createPlanet(
      280,
      0,
      0,
      28.232,
      20,
      20,
      1,
      "/assets/img/textures/2k_saturn.jpg",
      "Saturn"
    ),
    rotationSpeed: 0.01,
    orbitSpeed: 0,
    name: "Saturn",
  });
  celestialBodiesModels.push({
    instance: createPlanet(
      340,
      0,
      0,
      15.362,
      20,
      20,
      1,
      "/assets/img/textures/2k_uranus.jpg",
      "Uranus"
    ),
    rotationSpeed: 0.01,
    orbitSpeed: 0,
    name: "Uranus",
  });
  celestialBodiesModels.push({
    instance: createPlanet(
      420,
      0,
      0,
      14.622,
      20,
      20,
      1,
      "/assets/img/textures/2k_neptune.jpg",
      "Neptune"
    ),
    rotationSpeed: 0.01,
    orbitSpeed: 0,
    name: "Neptune",
  });
}

function init() {
  configureSun();
  configurePlanets();
}

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 500;
controls.autoRotate = true;
const rederScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(rederScene);

scene.background = new THREE.TextureLoader().load(
  "/assets/img/textures/2k_stars_milky_way.jpg"
);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
composer.addPass(bloomPass);

window.addEventListener("resize", onWindowResize, false);

function animateCelestialBodies() {
  celestialBodiesModels.forEach((celestialBody) => {
    celestialBody.instance.rotation.y += celestialBody.rotationSpeed;
  });
}

const fibonacciPoints = [];
const numPoints = 10000; // Number of points along the spiral
const scale = 10; // Scale of the spiral

for (let i = 0; i < numPoints; i++) {
  const t = i / numPoints; // Normalized position along the spiral (0 to 1)
  const angle = 2 * Math.PI * t;
  const radius = scale * Math.sqrt(t);
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  fibonacciPoints.push(new THREE.Vector3(x, y, 0));
}

function lookAtPlanet() {
  for (let i = 0; i < celestialBodiesModels.length; i++) {
    console.log(
      celestialBodiesModels[i].instance.position.distanceTo(camera.position),
      celestialBodiesModels[i].name
    );
    if (
      celestialBodiesModels[i].instance.position.distanceTo(camera.position) <
      60
    ) {
      controls.target.set(
        celestialBodiesModels[i].instance.position.x,
        celestialBodiesModels[i].instance.position.y,
        celestialBodiesModels[i].instance.position.z
      );
      console.log("look at", celestialBodiesModels[i].name);
      return;
    }
  }
  controls.target.set(0, 0, 0);
}

function moveCamera() {
  const scrollPosition = window.scrollY;
  const maxScrollPosition = document.body.scrollHeight - window.innerHeight;
  // Calculate the current scroll fraction (0 at the top of the page, 1 at the bottom)
  const scrollFraction = scrollPosition / maxScrollPosition;
  // Define the rotation angle and distance from the origin
  const angle = scrollFraction * Math.PI; // Rotate 180 degrees when scrolling from top to bottom
  const distance = scrollFraction * 100; // Move up to 100 units away from the origin
  // Calculate the new camera position
  const x = distance * Math.sin(angle);
  const y = camera.position.y; // Keep the same y-coordinate
  const z = 50 + distance * Math.cos(angle);
  // Update the camera position
  camera.position.set(x, y, z);
  // Make the camera look at the origin
  // camera.lookAt(new THREE.Vector3(0, 0, 0));
  lookAtPlanet();
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);
  animateCelestialBodies();
  controls.update();
  composer.render();
  //renderer.render(scene,camera)
}
init();
animate();
