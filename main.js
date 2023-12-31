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
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(50);
camera.position.setX(-50);
camera.position.setY(50);
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
  loader.load("./assets/fonts/optimer_bold.typeface.json", function (font) {
    const textGeo = new TextGeometry(planetName || "No name", {
      font: font,
      size: 2,
      height: 1,
    });
    const textMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      specular: 0xffffff,
    });
    const mesh = new THREE.Mesh(textGeo, textMaterial);
    mesh.position.set(x,y+radius+5,z);
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
  const sunLight = new THREE.PointLight(0xffffff, 15000, 0, 2);
  sunLight.position.set(0, 0, 0);
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(20, 20, 20),
    new THREE.MeshBasicMaterial({
      depthTest: true,
      map: new THREE.TextureLoader().load("./assets/img/textures/2k_sun.jpg"),
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
  loader.load("./assets/fonts/optimer_bold.typeface.json", function (font) {
    const textGeo = new TextGeometry("The sun", {
      font: font,
      size: 2,
      height: 1,
    });
    const textMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      specular: 0xffffff,
    });
    const mesh = new THREE.Mesh(textGeo, textMaterial);
    mesh.position.set(0, 20, 0);
    scene.add(mesh);
  });
  
}

function configurePlanets() {
  celestialBodiesModels.push({
    instance: createPlanet(
      60,
      0,
      0,
      2.44,
      20,
      20,
      1,
      "./assets/img/textures/2k_mercury.jpg",
      "Mercury"
    ),
    rotationSpeed: 0.05,
    orbitSpeed: 0,
    name: "Mercury",
  });
  celestialBodiesModels.push({
    instance: createPlanet(
      50,
      0,
      -60,
      6.052,
      20,
      20,
      1,
      "./assets/img/textures/2k_venus_surface.jpg",
      "Venus"
    ),
    rotationSpeed: 0.01,
    orbitSpeed: 0,
    name: "Venus",
  });
  celestialBodiesModels.push({
    instance: createPlanet(
      0,
      0,
      -80,
      6.371,
      20,
      20,
      1,
      "./assets/img/textures/2k_earth_daymap.jpg",
      "Earth"
    ),
    rotationSpeed: 0.01,
    orbitSpeed: 0,
    name: "Earth",
  });
  celestialBodiesModels.push({
    instance: createPlanet(
      -55,
      0,
      -90,
      3.39,
      20,
      20,
      1,
      "./assets/img/textures/2k_mars.jpg",
      "Mars"
    ),
    rotationSpeed: 0.01,
    orbitSpeed: 0,
    name: "Mars",
  });
  celestialBodiesModels.push({
    instance: createPlanet(
      -180,
      0,
      0,
      39.911,
      20,
      20,
      1,
      "./assets/img/textures/2k_jupiter.jpg",
      "Jupiter"
    ),
    rotationSpeed: 0.01,
    orbitSpeed: 0,
    name: "Jupiter",
  });
  celestialBodiesModels.push({
    instance: createPlanet(
      -200,
      0,
      100,
      28.232,
      20,
      20,
      1,
      "./assets/img/textures/2k_saturn.jpg",
      "Saturn"
    ),
    rotationSpeed: 0.01,
    orbitSpeed: 0,
    name: "Saturn",
  });
  celestialBodiesModels.push({
    instance: createPlanet(
      -100,
      0,
      200,
      15.362,
      20,
      20,
      1,
      "./assets/img/textures/2k_uranus.jpg",
      "Uranus"
    ),
    rotationSpeed: 0.01,
    orbitSpeed: 0,
    name: "Uranus",
  });
  celestialBodiesModels.push({
    instance: createPlanet(
      0,
      0,
      210,
      14.622,
      20,
      20,
      1,
      "./assets/img/textures/2k_neptune.jpg",
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
controls.autoRotate = true;

const rederScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(rederScene);

scene.background = new THREE.TextureLoader().load(
  "./assets/img/2k_stars_milky_way.jpg"
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

function animate() {
  requestAnimationFrame(animate);
  animateCelestialBodies();
  controls.update();
  composer.render();
  //renderer.render(scene,camera)
}
init();
animate();
