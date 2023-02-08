import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { gsap } from "gsap";

// import Stats from "stats.js";

/*** FPS */

// const stats = new Stats();
// stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom);

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 *Welcomelayer
 */

const switch1 = document.getElementById("switch1");

switch1.addEventListener("click", () => {
  setTimeout(() => {
    const welcomeLayer = document.getElementById("welcome-layer");
    welcomeLayer.remove();
    document.getElementById("nav-projects").style.display = "";
    document.getElementById("nav-about").style.display = "";
    document.getElementById("nav-contact").style.display = "";
    document.getElementById("nav-credits").style.display = "";
  }, 1500);
});

/*** Update all Materials */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Models
 */

// Loaders

const loadingManager = new THREE.LoadingManager();

loadingManager.onLoad = () => {
  document.getElementById("loading-circle").style.display = "none";
};

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load("portfolioscene.glb", (gltf) => {
  // gltf.scene.scale.set(2, 2, 2);
  //gltf.scene.position.set(0, -4, 0);
  // gltf.scene.rotation.y = 0.442;
  gltf.scene.rotation.y = 0.007;
  scene.add(gltf.scene);
  updateAllMaterials();

  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name("RotationY");

  // const monitor = gltf.scene.getObjectByName("monitor");

  // console.log(monitor);

  // const flipPhone = gltf.scene.getObjectByName("defaultMaterial003");
  // console.log(flipPhone);
});

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024); //change quality of shadow
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.bias = -0.01; //to fix shadow acne due to self-shadowing artifacts. bias for flat, normalbias for round surfaces
// directionalLight.shadow.camera.left = -7;
// directionalLight.shadow.camera.top = 7;
// directionalLight.shadow.camera.right = 7;
// directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(0.565, 5, 5);
scene.add(directionalLight);

// const directionalLightCameraHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(directionalLightCameraHelper); // only needed when adjusting the directionallight shadow camera

//Lights GUI

// gui
//   .add(directionalLight, "intensity")
//   .min(0)
//   .max(10)
//   .step(0.001)
//   .name("lightIntensity");
// gui
//   .add(directionalLight.position, "x")
//   .min(-5)
//   .max(5)
//   .step(0.001)
//   .name("lightX");
// gui
//   .add(directionalLight.position, "y")
//   .min(-5)
//   .max(5)
//   .step(0.001)
//   .name("lighty");
// gui
//   .add(directionalLight.position, "z")
//   .min(-5)
//   .max(5)
//   .step(0.001)
//   .name("lightZ");

// gui
//   .add(ambientLight, "intensity")
//   .min(0)
//   .max(10)
//   .step(0.001)
//   .name("AmbientlightIntensity");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.4, 1.5, 4);

scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0.1, 0.9, 0);
controls.enableDamping = true;
controls.maxDistance = 10;

// controls.addEventListener("change", () => console.log("Controls Change"));
// controls.addEventListener("start", () => console.log("Controls Start Event"));
// controls.addEventListener("end", () => console.log("Controls End Event"));

// // controls.dampingFactor = 0.01;
// // controls.rotateSpeed = 0.03;
// controls.enableZoom = true;
// // controls.zoomSpeed = 0.5;
// controls.enableKeys = true; //older versions
// controls.listenToKeyEvents(document.body);
// controls.keys = {
//   LEFT: "ArrowLeft", //left arrow
//   UP: "ArrowUp", // up arrow
//   RIGHT: "ArrowRight", // right arrow
//   BOTTOM: "ArrowDown", // down arrow
// };
// controls.mouseButtons = {
//   LEFT: THREE.MOUSE.ROTATE,
//   MIDDLE: THREE.MOUSE.DOLLY,
//   RIGHT: THREE.MOUSE.PAN,
// };
// controls.touches = {
//   ONE: THREE.TOUCH.ROTATE,
//   TWO: THREE.TOUCH.DOLLY_PAN,
// };
// // controls.screenSpacePanning = true;
// // controls.minAzimuthAngle = 0;
// // controls.maxAzimuthAngle = Math.PI / 2;
// // controls.minPolarAngle = 0;
// // controls.maxPolarAngle = Math.PI;
// // controls.maxDistance = 4;
// // controls.minDistance = 2;

// controls.update();

/**
 *Interactions
 */

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  // alpha: true,
  antialias: true, //reducing the stair like effect on the edges
  powerPreference: "high-performance",
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 1;

//Tonemapping GUI

// gui.add(renderer, "toneMapping", {
//   No: THREE.NoToneMapping,
//   Linear: THREE.LinearToneMapping,
//   Reinhard: THREE.ReinhardToneMapping,
//   Cineon: THREE.CineonToneMapping,
//   ACESFilmic: THREE.ACESFilmicToneMapping,
// });

// gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

/**
 * Animate
 */

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const onMouseClick = (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    console.log(intersects[0].object);
    console.log(pointer.x, pointer.y);
  }

  //Monitor

  if (intersects.length > 0) {
    if (intersects[0].object.name === "monitorscreen") {
      gsap.to(camera.position, {
        duration: 1,
        x: 0,
        y: 1.6,
        z: 0.4,
        // onUpdate: function () {
        //   camera.lookAt(2, 2, 2);
        // },
      });
      controls.target.set(0.00000000001, 1.59999999999, 0.2894382476806641);
    }

    //Flip Phone

    if (intersects[0].object.name === "defaultMaterial003") {
      gsap.to(camera.position, {
        duration: 1,
        x: -0.7214790996784565,
        y: 1.1,
        z: 0.07,
        // onUpdate: function () {
        //   camera.lookAt(2, 2, 2);
        // },
      });
      controls.target.set(-0.75, 1.06, 0.02);
    }

    //Laptop

    if (intersects[0].object.name === "laptopscreen") {
      gsap.to(camera.position, {
        duration: 1,
        x: 1.33,
        y: 1.3,
        z: 0.1,
        // onUpdate: function () {
        //   camera.lookAt(2, 2, 2);
        // },
      });
      controls.target.set(1.3835, 1.24, 0.02);
    }

    //Notebook

    if (intersects[0].object.name === "Object_4004") {
      gsap.to(camera.position, {
        duration: 1,
        x: -1.67,
        y: 1.32,
        z: 0.335,
        // onUpdate: function () {
        //   camera.lookAt(2, 2, 2);
        // },
      });
      controls.target.set(-1.673, -0.34986225895316814, 0.325);
    }
  }
};

window.addEventListener("click", onMouseClick);

const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  // stats.begin();
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
  // stats.end();
};

tick();
