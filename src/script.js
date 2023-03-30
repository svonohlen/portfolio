import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { gsap } from "gsap";

const imageAbout = new Image();
const textureAbout = new THREE.Texture(imageAbout);
imageAbout.addEventListener("load", () => {
  textureAbout.needsUpdate = true;
});
imageAbout.src = "/images/laptopwelcome3.jpg";
textureAbout.encoding = THREE.sRGBEncoding;

const imageDesk = new Image();
const textureDesk = new THREE.Texture(imageDesk);
imageDesk.addEventListener("load", () => {
  textureDesk.needsUpdate = true;
});
imageDesk.src = "/images/mydesktext.jpg";
textureDesk.encoding = THREE.sRGBEncoding;

const imageDiving = new Image();
const textureDiving = new THREE.Texture(imageDiving);
imageDiving.addEventListener("load", () => {
  textureDiving.needsUpdate = true;
});
imageDiving.src = "/images/diving2.jpg";
textureDiving.encoding = THREE.sRGBEncoding;

const imageSnow = new Image();
const textureSnow = new THREE.Texture(imageSnow);
imageSnow.addEventListener("load", () => {
  textureSnow.needsUpdate = true;
});
imageSnow.src = "/images/snowboarden_van.jpg";
textureSnow.encoding = THREE.sRGBEncoding;

const laptopScreenMaterial = new THREE.MeshBasicMaterial({ map: textureAbout });
const myDeskMaterial = new THREE.MeshBasicMaterial({ map: textureDesk });
const divingMaterial = new THREE.MeshBasicMaterial({ map: textureDiving });
const snowMaterial = new THREE.MeshBasicMaterial({ map: textureSnow });

const laptopMaterials = [
  laptopScreenMaterial,
  myDeskMaterial,
  divingMaterial,
  snowMaterial,
];

// import Stats from "stats.js";

/*** FPS */

// const stats = new Stats();
// stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom);

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
console.log(scene);
/**
 *Welcomelayer
 */

const switch1 = document.getElementById("switch1");

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
    if (child.name == "laptopscreen") {
      child.material = laptopScreenMaterial;
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
  document.getElementById("switch-label").style.cursor = "pointer";
  switch1.addEventListener("click", () => {
    setTimeout(() => {
      const welcomeLayer = document.getElementById("welcome-layer");
      welcomeLayer.remove();
      document.getElementById("nav-projects").style.visibility = "visible";
      document.getElementById("nav-about").style.visibility = "visible";
      document.getElementById("nav-contact").style.visibility = "visible";
      document.getElementById("nav-credits").style.visibility = "visible";
      document.getElementById("nav-back").style.visibility = "visible";
    }, 1500);
  });
};

// loadingManager.onProgress = () => {
//   switch1.addEventListener("click", () => {
//     () => {
//       document.getElementById("instructions-container").style.display = "";
//       document.getElementById("text-headline").style.display = "none";
//       document.getElementById("text-subtitle").style.display = "none";
//     };
//   });
// };

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load("desksetup.glb", (gltf) => {
  // gltf.scene.scale.set(2, 2, 2);
  //gltf.scene.position.set(0, -4, 0);
  // gltf.scene.rotation.y = 0.442;
  gltf.scene.rotation.y = 0.007;
  scene.add(gltf.scene);
  updateAllMaterials();

  // gui
  //   .add(gltf.scene.rotation, "y")
  //   .min(-Math.PI)
  //   .max(Math.PI)
  //   .step(0.001)
  //   .name("RotationY");

  // const monitor = gltf.scene.getObjectByName("monitor");

  // console.log(monitor);

  // const flipPhone = gltf.scene.getObjectByName("defaultMaterial003");
  // console.log(flipPhone);
});

const pointLight = new THREE.PointLight(0xffffff, 4, 10, 2);
pointLight.position.set(-1.9, 1.9, -0.58);
scene.add(pointLight);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// scene.add(pointLightHelper);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024); //change quality of shadow
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.bias = -0.01; //to fix shadow acne due to self-shadowing artifacts. bias for flat, normalbias for round surfaces
// directionalLight.shadow.camera.left = -7;
// directionalLight.shadow.camera.top = 7;
// directionalLight.shadow.camera.right = 7;
// directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(-1.043, 5, 5);
scene.add(directionalLight);

// const directionalLightCameraHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(directionalLightCameraHelper); // only needed when adjusting the directionallight shadow camera

// //Lights GUI

// gui
//   .add(directionalLight, "intensity")
//   .min(0)
//   .max(10)
//   .step(0.001)
//   .name("dlightIntensity");
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
//   .add(pointLight, "intensity")
//   .min(0)
//   .max(10)
//   .step(0.001)
//   .name("plightIntensity");
// gui
//   .add(pointLight, "distance")
//   .min(0)
//   .max(50)
//   .step(0.001)
//   .name("lightDistance");
// gui.add(pointLight, "decay").min(0).max(10).step(0.001).name("lightDecay");

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
controls.enableKeys = true; //older versions
controls.listenToKeyEvents(document.body);
controls.keys = {
  LEFT: "ArrowLeft", //left arrow
  UP: "ArrowUp", // up arrow
  RIGHT: "ArrowRight", // right arrow
  BOTTOM: "ArrowDown", // down arrow
};
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

/**
 * Mouse Events
 * */

// const checkZoom = () => {
//   if (
//     controls.target.x == 0.1 &&
//     controls.target.y == 0.9 &&
//     controls.target.z == 0
//   ) {
//     document.getElementById("nav-back").style.visibility = "hidden";
//   } else {
//     document.getElementById("nav-back").style.visibility = "visible";
//   }
// };

const monitorZoom = () => {
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
  // checkZoom();
};

const phoneZoom = () => {
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
  // checkZoom();
};

//Gmail Phone Contact

const laptopZoom = () => {
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
  // checkZoom();
};

const notebookZoom = () => {
  gsap.to(camera.position, {
    duration: 1,
    x: -1.67,
    y: 1.27,
    z: 0.335,
    // onUpdate: function () {
    //   camera.lookAt(2, 2, 2);
    // },
  });
  controls.target.set(-1.673, -0.34986225895316814, 0.325);
  // checkZoom();
};

// Object Clicks

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let slideIndex = 0;

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
      monitorZoom();
    }

    //Flip Phone

    if (intersects[0].object.name === "defaultMaterial003") {
      phoneZoom();
    }

    if (
      controls.target.x == -0.75 &&
      controls.target.y == 1.06 &&
      controls.target.z == 0.02
    ) {
      if (intersects[0].object.name === "gmail_plane") {
        window.location = "mailto:sandrinvonohlen@gmail.com";
      } else if (intersects[0].object.name === "linkedin_plane") {
        window.open("https://www.linkedin.com/in/sandrin-von-ohlen/");
      } else if (intersects[0].object.name === "github_plane") {
        window.open("https://github.com/svonohlen");
      }
    }
    //Laptop

    if (intersects[0].object.name === "laptopscreen") {
      //zoom in
      laptopZoom();
      //screen material change on click
    }
    //Laptop material change on arrows

    if (
      intersects[0].object.name === "arrowplane_right" ||
      intersects[0].object.name === "arrowplane_left"
    ) {
      // stores the slide position the user selected using the arrows
      if (intersects[0].object.name === "arrowplane_right") {
        if (slideIndex == 0 || slideIndex < laptopMaterials.length - 1) {
          slideIndex += 1;
        } else {
          slideIndex = 0;
        }
      } else if (intersects[0].object.name === "arrowplane_left") {
        if (slideIndex == 0) {
          slideIndex = laptopMaterials.length - 1;
        } else {
          slideIndex -= 1;
        }
      }

      // updates picture on laptop based after user navigated
      scene.children.forEach(function (sceneChild) {
        if (sceneChild.name === "Scene") {
          sceneChild.children.forEach(function (sceneObject) {
            if (sceneObject.name === "laptop") {
              sceneObject.children.forEach(function (laptopObject) {
                if (laptopObject.name === "laptopmonitor") {
                  laptopObject.children.forEach(function (laptopMonitorObject) {
                    if (laptopMonitorObject.name === "laptopscreen") {
                      laptopMonitorObject.material =
                        laptopMaterials[slideIndex];
                    }
                  });
                }
              });
            }
          });
        }
      });
    }

    //Notebook

    if (
      intersects[0].object.name === "Object_4004" ||
      intersects[0].object.name === "paper"
    ) {
      notebookZoom();
    }
  }
};

window.addEventListener("click", onMouseClick);

// Object hover

const onMouseMove = (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  //Monitor

  if (intersects.length > 0) {
    if (
      intersects[0].object.name === "defaultMaterial003" &&
      controls.target.x == -0.75 &&
      controls.target.y == 1.06 &&
      controls.target.z == 0.02
    ) {
      document.body.style.cursor = "default";
    } else if (
      intersects[0].object.name === "monitorscreen" ||
      intersects[0].object.name === "defaultMaterial003" ||
      intersects[0].object.name === "laptopscreen" ||
      intersects[0].object.name === "Object_4004" ||
      intersects[0].object.name === "gmail_plane" ||
      intersects[0].object.name === "linkedin_plane" ||
      intersects[0].object.name === "github_plane" ||
      intersects[0].object.name === "paper" ||
      intersects[0].object.name === "arrowplane_left" ||
      intersects[0].object.name === "arrowplane_right"
    ) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
  }
};

window.addEventListener("mousemove", onMouseMove);

//Navbar clicks

const projectsNav = document.getElementById("nav-projects");
projectsNav.addEventListener("click", () => {
  monitorZoom();
});

const contactNav = document.getElementById("nav-contact");
contactNav.addEventListener("click", () => {
  phoneZoom();
});

const aboutNav = document.getElementById("nav-about");
aboutNav.addEventListener("click", () => {
  laptopZoom();
});

const creditsNav = document.getElementById("nav-credits");
creditsNav.addEventListener("click", () => {
  notebookZoom();
});

const resetNav = document.getElementById("nav-back");
resetNav.addEventListener("click", () => {
  gsap.to(camera.position, {
    duration: 1,
    x: 0.4,
    y: 1.5,
    z: 4,
  });
  controls.target.set(0.1, 0.9, 0);
});

const instructionsNav = document.getElementById("nav-instructions");
instructionsNav.addEventListener("click", () => {
  document.getElementById("instructions-container").style.display = "";
  document.getElementById("text-headline").style.display = "none";
  document.getElementById("text-subtitle").style.display = "none";
});

const closeInstructions = document.getElementById("close-instructions");
closeInstructions.addEventListener("click", () => {
  document.getElementById("instructions-container").style.display = "none";
});

const closeMobile = document.getElementById("close-mobile");
closeMobile.addEventListener("click", () => {
  document.getElementById("mobile-container").style.display = "none";
});

if (/Android|iPhone/i.test(navigator.userAgent)) {
  // This checks if the current device is in fact mobile
  document.getElementById("mobile-container").style.display = "";
  document.getElementById("instructions-text").innerHTML =
    "Once you flip the switch, feel free to play around!<br /><br /> Zoom in & out using your touch screen and pan to the left and right using two fingers. Try turning the scene upside down by dragging it with your fingers or just tap on any of the items on the screen.<br /><br /> Maybe you will find some hidden treasures!<br /><br /> If you get lost, just use the RESET button at the top of your screen 🙂";
}

const { detect } = require("detect-browser");
const browser = detect();
if (/Android|iPhone/i.test(navigator.userAgent) && browser.name == "safari") {
  document.getElementById("mobile-container").style.display = "";
  document.getElementById("mobile-text").innerHTML =
    "Hey there,<br /><br /> looks like you opened this page on your phone in the Safari browser.<br /><br />Since this website contains a 3D model the experience will be much nicer on a computer. So head over to your laptop and try it there too! 🙂<br /><br />If your laptop is too far away, switch to Chrome to enjoy all functionalities.<br /><br /> Flip the switch and put your phone in horizontal mode when needed!<br /><br />Enjoy!";
}

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
