import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { gsap } from "gsap";

const debug = false;

// images to show on laptop
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

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
/**
 * Welcome layer
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

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load("desksetup.glb", (gltf) => {
  gltf.scene.rotation.y = 0.007;
  scene.add(gltf.scene);
  updateAllMaterials();
});

const pointLight = new THREE.PointLight(0xffffff, 4, 10, 2);
pointLight.position.set(-1.9, 1.9, -0.58);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024); //change quality of shadow
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.bias = -0.01; //to fix shadow acne due to self-shadowing artifacts. bias for flat, normalbias for round surfaces
directionalLight.position.set(-1.043, 5, 5);
scene.add(directionalLight);

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

controls.enableKeys = true; //older versions
controls.listenToKeyEvents(document.body);
controls.keys = {
  LEFT: "ArrowLeft", //left arrow
  UP: "ArrowUp", // up arrow
  RIGHT: "ArrowRight", // right arrow
  BOTTOM: "ArrowDown", // down arrow
};

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

const monitorZoom = () => {
  gsap.to(camera.position, {
    duration: 1,
    x: 0,
    y: 1.6,
    z: 0.4,
  });
  controls.target.set(0.00000000001, 1.59999999999, 0.2894382476806641);
};

const phoneZoom = () => {
  gsap.to(camera.position, {
    duration: 1,
    x: -0.7214790996784565,
    y: 1.1,
    z: 0.07,
  });
  controls.target.set(-0.75, 1.06, 0.02);
};

//Gmail Phone Contact

const laptopZoom = () => {
  gsap.to(camera.position, {
    duration: 1,
    x: 1.33,
    y: 1.3,
    z: 0.1,
  });
  controls.target.set(1.3835, 1.24, 0.02);
};

const notebookZoom = () => {
  gsap.to(camera.position, {
    duration: 1,
    x: -1.67,
    y: 1.27,
    z: 0.335,
  });
  controls.target.set(-1.673, -0.34986225895316814, 0.325);
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

  if (debug === true && intersects.length > 0) {
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

const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
