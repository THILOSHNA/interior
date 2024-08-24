import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PCFSoftShadowMap } from "three/src/constants.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import gsap from "gsap/gsap-core";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

// Scene creation
const scene = new THREE.Scene();

// global variables
var room;
const sofa_ui = document.querySelector(".sofa");
let sofa_focus = false;
let dining_focus = false;
let kitchen_wood_focus = false;
let kitchen_marble_focus = false;
let cabinet_selected = false
let wall_selected = false;

const instructions = [
  "Click upon 'floor', 'wall' to reveal their textures. You have a free view here. You can rotate and pan the view freely.",
  "Click upon 'sofa', 'sofa table' to reveal their textures",
  "Click upon 'dining table' to reveal the wood textures and on the 'seat' to reveal the fabric texture",
  "Click upon 'chairs' to reveal wood textures ,upon the 'marble top' to reveal marble textures and on the 'cabinet' to change colors",
];

const ui = document.querySelector("#ui-container");
const left_frame = document.querySelector("#instr");
const right_frame = document.querySelector(".right-frame");
const name = document.querySelector("#name");
const loading = document.querySelector(".loader");

let ui_present = false;
function create_ui(element, obj, obj_texture) {
  if (ui.childElementCount > 0) remove_ui();
  for (let i = 0; i < element.length; i++) {
    const new_el = document.createElement("button");
    new_el.className = "ui_circle";
    const img_el = document.createElement("img");
    img_el.src = element[i];
    new_el.appendChild(img_el);
    ui.appendChild(new_el);
    new_el.addEventListener("click", function () {
      obj.forEach((mesh) => {
        scene.getObjectByName(mesh).material = obj_texture[i];
      });
    });
  }
}
function remove_ui() {
  right_frame.style.display = "none";
  guiEl.style.display = "none"
  while (ui.firstChild) ui.firstChild.remove();
  ui_present = false;
  cabinet_selected = false;
  wall_selected = false;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") remove_ui();
});

const sofa = ["sofa"];
const sofa_cushions = ["sofa_cushions"];
const dining = ["dining_1", "dining_2", "dining_4"];
const dining_seat = ["dining"];
const kitchen_marble = ["marble_top"];
const kitchen_wood = ["kitchen_wood_1", "kitchen_wood_2", "kitchen_wood_3"];
const floor = ["Cube017", "Cube030_2"];
const wall = [
  "Cube022",
  "Cube037",
  "Cylinder003",
  "Cylinder010",
  "Cylinder012",
];
const kitchen_cabinet = ["Cube019", "Cube021", "Cube018"];
const sofa_table = ["Cube029_1", "Cube030_4"]

const sofa_thumbnails = [
  "assets/sofa/sofa_1/Leather009.png",
  "assets/sofa/sofa_2/Leather010.png",
  "assets/sofa/sofa_3/Leather012.png",
  "assets/sofa/sofa_4/Fabric063.png",
  "assets/sofa/sofa_5/Fabric023.png",
];
const wood_thumnails = [
  "assets/wood/wood_1/Wood026.png",
  "assets/wood/wood_2/Wood068.png",
  "assets/wood/wood_3/Wood069.png",
  "assets/wood/wood_4/Wood052.png",
  "assets/wood/wood_5/Wood066.png",
  "assets/wood/wood_6/Wood028.png",
];
const marble_thumbnail = [
  "assets/marble/marble_1/Marble012.png",
  "assets/marble/marble_2/Marble003.png",
  "assets/marble/marble_3/Marble006.png",
  "assets/marble/marble_4/Travertine013.png",
  "assets/marble/marble_5/Travertine003.png",
];

const floor_thumbnails = [
  "assets/floor/Thumbnail/1.png",
  "assets/floor/Thumbnail/2.png",
  "assets/floor/Thumbnail/3.png",
  "assets/floor/Thumbnail/4.png",
  "assets/floor/Thumbnail/5.png",
  "assets/floor/Thumbnail/6.png",
  "assets/floor/Thumbnail/7.png",
  "assets/floor/Thumbnail/8.png",
]

const wall_thumbnails = ["assets/wall/wall1/Metal027.png"];

const plastic_thumbnail = [String.raw`assets\plastic\Plastic013A.png`]
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const hdrLoader = new RGBELoader();
hdrLoader.load(
  "assets/room_interior/files/lythwood_room_2k.hdr",
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  }
);

// Camera Setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 1);

// load manager
const loadManager = new THREE.LoadingManager();

loadManager.onStart = () => {
  console.log("loading started");
  loading.style.display = "block";
};
loadManager.onProgress = () => {
  console.log("loading");
};
loadManager.onLoad = () => {
  console.log("loaded");
  setTimeout(() => {
    loading.style.display = "none";
    initial_movement();
  }, 3500);
};
loadManager.onError = (err) => {
  console.log("error while loading:" + err);
};

// Texture loader
const textureLoader = new THREE.TextureLoader(loadManager);

const loader = new GLTFLoader();
var model;
loader.load("assets/room_interior/files/interior__one.glb", function (gltf) {
  model = gltf.scene;

  model.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  scene.add(model);
});

function initial_movement() {
  gsap.to(camera.position, {
    x: 1.2,
    y: 1,
    z: 2,
    duration: 2,
    ease: "sine.inOut",
  });
}

const calling_pointer = [
  function () {
    console.log("camera move");
    gsap.to(camera.position, {
      x: 1.2,
      y: 1,
      z: 2,
      duration: 2,
      ease: "sine.inOut",
    });
    gsap.to(controls.target, {
      x: 0,
      y: 0,
      z: 0,
      duration: 2,
    });
  },

  function () {
    console.log("camera move");
    gsap.to(camera.position, {
      x: 1,
      y: 1.6,
      z: 1.7,
      duration: 2,
      ease: "sine.inOut",
    });
    gsap.to(controls.target, {
      x: 0.8,
      y: 0.2,
      z: 0.4,
      duration: 2,
      ease: "sine.inOut",
    });
  },

  function () {
    gsap.to(camera.position, {
      x: -2,
      y: 1.8,
      z: -2.5,
      duration: 2,
      ease: "sine.inOut",
    });
    gsap.to(controls.target, {
      x: -0.1,
      y: 0.2,
      z: -2,
      duration: 2,
      ease: "sine.inOut",
    });
  },

  function () {
    gsap.to(camera.position, {
      x: -2,
      y: 1.5,
      z: 0.6,
      duration: 2,
      ease: "sine.inOut",
    });
    gsap.to(controls.target, {
      x: -3.5,
      y: 0.5,
      z: 0.5,
      duration: 2,
      ease: "sine.inOut",
    });
  },
];

const viewing = {
  1: "pointer_1",
  2: "pointer_2",
  3: "pointer_3",
};

var current_viewing = 0;

document.addEventListener("keydown", (e) => {
  if (ui.childElementCount > 0) remove_ui();
  if (e.key == "ArrowUp") {
    current_viewing = current_viewing < 3 ? current_viewing + 1 : 0;
    guiEl.style.display = "none";
    left_frame.innerHTML = `${instructions[current_viewing]}`;
    if (current_viewing == 0) controls.enabled = true;
    else controls.enabled = false;
    calling_pointer[current_viewing]();
  } else if (e.key == "ArrowDown") {
    current_viewing = current_viewing > 0 ? current_viewing - 1 : 3;
    guiEl.style.display = "none";
    left_frame.innerHTML = instructions[current_viewing];
    if (current_viewing == 0) controls.enabled = true;
    else controls.enabled = false;
    calling_pointer[current_viewing]();
  }
});

// loading sofa textures
const sofa1 = new THREE.MeshStandardMaterial();
const sofa1_color = textureLoader.load(
  "assets/sofa/sofa_1/Leather009_2K-JPG_Color.jpg"
);
const sofa1_nrml = textureLoader.load(
  "assets/sofa/sofa_1/Leather009_2K-JPG_NormalGL.jpg"
);
const sofa1_rough = textureLoader.load(
  "assets/sofa/sofa_1/Leather009_2K-JPG_Roughness.jpg"
);
sofa1_color.wrapS = THREE.RepeatWrapping;
sofa1_color.wrapT = THREE.RepeatWrapping;
sofa1_color.repeat.set(1, 1);
sofa1_nrml.wrapS = THREE.RepeatWrapping;
sofa1_nrml.wrapT = THREE.RepeatWrapping;
sofa1_nrml.repeat.set(1, 1);
sofa1_rough.wrapS = THREE.RepeatWrapping;
sofa1_rough.wrapT = THREE.RepeatWrapping;
sofa1_rough.repeat.set(1, 1);
sofa1.map = sofa1_color;
sofa1.normalMap = sofa1_nrml;
sofa1.roughnessMap = sofa1_rough;
sofa1_color.colorSpace = THREE.SRGBColorSpace;

const sofa2 = new THREE.MeshStandardMaterial();
const sofa2_color = textureLoader.load(
  "assets/sofa/sofa_2/Leather010_2K-JPG_Color.jpg"
);
const sofa2_nrml = textureLoader.load(
  "assets/sofa/sofa_2/Leather010_2K-JPG_NormalGL.jpg"
);
const sofa2_rough = textureLoader.load(
  "assets/sofa/sofa_2/Leather010_2K-JPG_Roughness.jpg"
);
sofa2_color.wrapS = THREE.RepeatWrapping;
sofa2_color.wrapT = THREE.RepeatWrapping;
sofa2_color.repeat.set(1, 1);
sofa2_nrml.wrapS = THREE.RepeatWrapping;
sofa2_nrml.wrapT = THREE.RepeatWrapping;
sofa2_nrml.repeat.set(1, 1);
sofa2_rough.wrapS = THREE.RepeatWrapping;
sofa2_rough.wrapT = THREE.RepeatWrapping;
sofa2_rough.repeat.set(1, 1);
sofa2.map = sofa2_color;
sofa2.normalMap = sofa2_nrml;
sofa2.roughnessMap = sofa2_rough;
sofa2_color.colorSpace = THREE.SRGBColorSpace;

const sofa3 = new THREE.MeshStandardMaterial();
const sofa3_color = textureLoader.load(
  "assets/sofa/sofa_3/Leather012_2K-JPG_Color.jpg"
);
const sofa3_nrml = textureLoader.load(
  "assets/sofa/sofa_3/Leather012_2K-JPG_NormalGL.jpg"
);
const sofa3_rough = textureLoader.load(
  "assets/sofa/sofa_3/Leather012_2K-JPG_Roughness.jpg"
);
sofa3_color.wrapS = THREE.RepeatWrapping;
sofa3_color.wrapT = THREE.RepeatWrapping;
sofa3_color.repeat.set(1, 1);
sofa3_nrml.wrapS = THREE.RepeatWrapping;
sofa3_nrml.wrapT = THREE.RepeatWrapping;
sofa3_nrml.repeat.set(1, 1);
sofa3_rough.wrapS = THREE.RepeatWrapping;
sofa3_rough.wrapT = THREE.RepeatWrapping;
sofa3_rough.repeat.set(1, 1);
sofa3.map = sofa3_color;
sofa3.normalMap = sofa3_nrml;
sofa3.roughnessMap = sofa3_rough;
sofa3_color.colorSpace = THREE.SRGBColorSpace;

const sofa4 = new THREE.MeshStandardMaterial();
const sofa4_color = textureLoader.load(
  "assets/sofa/sofa_4/Fabric063_2K-JPG_Color.jpg"
);
const sofa4_nrml = textureLoader.load(
  "assets/sofa/sofa_4/Fabric063_2K-JPG_NormalGL.jpg"
);
const sofa4_rough = textureLoader.load(
  "assets/sofa/sofa_4/Fabric063_2K-JPG_Roughness.jpg"
);
sofa4_color.wrapS = THREE.RepeatWrapping;
sofa4_color.wrapT = THREE.RepeatWrapping;
sofa4_color.repeat.set(1, 1);
sofa4_nrml.wrapS = THREE.RepeatWrapping;
sofa4_nrml.wrapT = THREE.RepeatWrapping;
sofa4_nrml.repeat.set(1, 1);
sofa4_rough.wrapS = THREE.RepeatWrapping;
sofa4_rough.wrapT = THREE.RepeatWrapping;
sofa4_rough.repeat.set(1, 1);
sofa4.map = sofa4_color;
sofa4.normalMap = sofa4_nrml;
sofa4.roughnessMap = sofa4_rough;
sofa4_color.colorSpace = THREE.SRGBColorSpace;

const sofa5 = new THREE.MeshStandardMaterial();
const sofa5_color = textureLoader.load(
  "assets/sofa/sofa_5/Fabric023_2K-JPG_Color.jpg"
);
const sofa5_nrml = textureLoader.load(
  "assets/sofa/sofa_5/Fabric023_2K-JPG_NormalGL.jpg"
);
const sofa5_rough = textureLoader.load(
  "assets/sofa/sofa_5/Fabric023_2K-JPG_Roughness.jpg"
);
sofa5_color.wrapS = THREE.RepeatWrapping;
sofa5_color.wrapT = THREE.RepeatWrapping;
sofa5_color.repeat.set(1, 1);
sofa5_nrml.wrapS = THREE.RepeatWrapping;
sofa5_nrml.wrapT = THREE.RepeatWrapping;
sofa5_nrml.repeat.set(1, 1);
sofa5_rough.wrapS = THREE.RepeatWrapping;
sofa5_rough.wrapT = THREE.RepeatWrapping;
sofa5_rough.repeat.set(1, 1);
sofa5.map = sofa5_color;
sofa5.normalMap = sofa5_nrml;
sofa5.roughnessMap = sofa5_rough;
sofa5_color.colorSpace = THREE.SRGBColorSpace;

const sofa_textures = [sofa1, sofa2, sofa3, sofa4, sofa5];

// loading wood texture
const wood1 = new THREE.MeshStandardMaterial();
const wood1_color = textureLoader.load(
  "assets/wood/wood_1/Wood026_2K-JPG_Color.jpg"
);
const wood1_nrml = textureLoader.load(
  "assets/wood/wood_1/Wood026_2K-JPG_NormalGL.jpg"
);
const wood1_rough = textureLoader.load(
  "assets/wood/wood_1/Wood026_2K-JPG_Roughness.jpg"
);
wood1.map = wood1_color;
wood1.normalMap = wood1_nrml;
wood1.roughnessMap = wood1_rough;
wood1_color.wrapS = THREE.RepeatWrapping;
wood1_color.wrapT = THREE.RepeatWrapping;
wood1_color.repeat.set(3, 3);
wood1_color.rotation = Math.PI / 2;
wood1_nrml.wrapS = THREE.RepeatWrapping;
wood1_nrml.wrapT = THREE.RepeatWrapping;
wood1_nrml.repeat.set(3, 3);
wood1_nrml.rotation = Math.PI / 2;
wood1_rough.wrapS = THREE.RepeatWrapping;
wood1_rough.wrapT = THREE.RepeatWrapping;
wood1_rough.repeat.set(3, 3);
wood1_rough.rotation = Math.PI / 2;
wood1_color.colorSpace = THREE.SRGBColorSpace;

const wood2 = new THREE.MeshStandardMaterial();
const wood2_color = textureLoader.load(
  "assets/wood/wood_2/Wood068_2K-JPG_Color.jpg"
);
const wood2_nrml = textureLoader.load(
  "assets/wood/wood_2/Wood068_2K-JPG_NormalGL.jpg"
);
const wood2_rough = textureLoader.load(
  "assets/wood/wood_2/Wood068_2K-JPG_Roughness.jpg"
);
wood2.map = wood2_color;
wood2.normalMap = wood2_nrml;
wood2.roughnessMap = wood2_rough;
wood2_color.wrapS = THREE.RepeatWrapping;
wood2_color.wrapT = THREE.RepeatWrapping;
wood2_color.repeat.set(3, 3);
wood2_color.rotation = Math.PI / 2;
wood2_nrml.wrapS = THREE.RepeatWrapping;
wood2_nrml.wrapT = THREE.RepeatWrapping;
wood2_nrml.repeat.set(3, 3);
wood2_nrml.rotation = Math.PI / 2;
wood2_rough.wrapS = THREE.RepeatWrapping;
wood2_rough.wrapT = THREE.RepeatWrapping;
wood2_rough.repeat.set(3, 3);
wood2_rough.rotation = Math.PI / 2;
wood2_color.colorSpace = THREE.SRGBColorSpace;

const wood3 = new THREE.MeshStandardMaterial();
const wood3_color = textureLoader.load(
  "assets/wood/wood_3/Wood069_2K-JPG_Color.jpg"
);
const wood3_nrml = textureLoader.load(
  "assets/wood/wood_3/Wood069_2K-JPG_NormalGL.jpg"
);
const wood3_rough = textureLoader.load(
  "assets/wood/wood_3/Wood069_2K-JPG_Roughness.jpg"
);
wood3.map = wood3_color;
wood3.normalMap = wood3_nrml;
wood3.roughnessMap = wood3_rough;
wood3_color.wrapS = THREE.RepeatWrapping;
wood3_color.wrapT = THREE.RepeatWrapping;
wood3_color.repeat.set(3, 3);
wood3_color.rotation = Math.PI / 2;
wood3_nrml.wrapS = THREE.RepeatWrapping;
wood3_nrml.wrapT = THREE.RepeatWrapping;
wood3_nrml.repeat.set(3, 3);
wood3_nrml.rotation = Math.PI / 2;
wood3_rough.wrapS = THREE.RepeatWrapping;
wood3_rough.wrapT = THREE.RepeatWrapping;
wood3_rough.repeat.set(3, 3);
wood3_rough.rotation = Math.PI / 2;
// wood3_color.colorSpace = THREE.SRGBColorSpace

const wood4 = new THREE.MeshStandardMaterial();
const wood4_color = textureLoader.load(
  "assets/wood/wood_4/Wood052_2K-JPG_Color.jpg"
);
const wood4_nrml = textureLoader.load(
  "assets/wood/wood_4/Wood052_2K-JPG_NormalGL.jpg"
);
const wood4_rough = textureLoader.load(
  "assets/wood/wood_4/Wood052_2K-JPG_Roughness.jpg"
);
wood4.map = wood4_color;
wood4.normalMap = wood4_nrml;
wood4.roughnessMap = wood4_rough;
wood4_color.wrapS = THREE.RepeatWrapping;
wood4_color.wrapT = THREE.RepeatWrapping;
wood4_color.repeat.set(3, 3);
wood4_color.rotation = Math.PI / 2;
wood4_nrml.wrapS = THREE.RepeatWrapping;
wood4_nrml.wrapT = THREE.RepeatWrapping;
wood4_nrml.repeat.set(3, 3);
wood4_nrml.rotation = Math.PI / 2;
wood4_rough.wrapS = THREE.RepeatWrapping;
wood4_rough.wrapT = THREE.RepeatWrapping;
wood4_rough.repeat.set(3, 3);
wood4_rough.rotation = Math.PI / 2;
// wood4_color.colorSpace = THREE.SRGBColorSpace

const wood5 = new THREE.MeshStandardMaterial();
const wood5_color = textureLoader.load(
  "assets/wood/wood_5/Wood066_2K-JPG_Color.jpg"
);
const wood5_nrml = textureLoader.load(
  "assets/wood/wood_5/Wood066_2K-JPG_NormalGL.jpg"
);
const wood5_rough = textureLoader.load(
  "assets/wood/wood_5/Wood066_2K-JPG_Roughness.jpg"
);
wood5.map = wood5_color;
wood5.normalMap = wood5_nrml;
wood5.roughnessMap = wood5_rough;
wood5_color.wrapS = THREE.RepeatWrapping;
wood5_color.wrapT = THREE.RepeatWrapping;
wood5_color.repeat.set(3, 3);
wood5_color.rotation = Math.PI / 2;
wood5_nrml.wrapS = THREE.RepeatWrapping;
wood5_nrml.wrapT = THREE.RepeatWrapping;
wood5_nrml.repeat.set(3, 3);
wood5_nrml.rotation = Math.PI / 2;
wood5_rough.wrapS = THREE.RepeatWrapping;
wood5_rough.wrapT = THREE.RepeatWrapping;
wood5_rough.repeat.set(3, 3);
wood5_rough.rotation = Math.PI / 2;
wood5_color.colorSpace = THREE.DisplayP3ColorSpace;

const wood6 = new THREE.MeshStandardMaterial();
const wood6_color = textureLoader.load(
  "assets/wood/wood_6/Wood028_2K-JPG_Color.jpg"
);
const wood6_nrml = textureLoader.load(
  "assets/wood/wood_6/Wood028_2K-JPG_NormalGL.jpg"
);
const wood6_rough = textureLoader.load(
  "assets/wood/wood_6/Wood028_2K-JPG_Roughness.jpg"
);
wood6.map = wood6_color;
wood6.normalMap = wood6_nrml;
wood6.roughnessMap = wood6_rough;
wood6_color.wrapS = THREE.RepeatWrapping;
wood6_color.wrapT = THREE.RepeatWrapping;
wood6_color.repeat.set(3, 3);
wood6_color.rotation = Math.PI / 2;
wood6_nrml.wrapS = THREE.RepeatWrapping;
wood6_nrml.wrapT = THREE.RepeatWrapping;
wood6_nrml.repeat.set(3, 3);
wood6_nrml.rotation = Math.PI / 2;
wood6_rough.wrapS = THREE.RepeatWrapping;
wood6_rough.wrapT = THREE.RepeatWrapping;
wood6_rough.repeat.set(3, 3);
wood6_rough.rotation = Math.PI / 2;
wood6_color.colorSpace = THREE.SRGBColorSpace;

const wood_texture = [wood1, wood2, wood3, wood4, wood5, wood6];

// loading marble textures
const marble1 = new THREE.MeshStandardMaterial();
const marble1_color = textureLoader.load(
  "assets/floor/Resource Boy - Marble Textures/10.jpg"
);
const marble1_nrml = textureLoader.load(
  "assets/marble/marble_1/Marble012_2K-JPG_NormalGL.jpg"
);
const marble1_rough = textureLoader.load(
  "assets/marble/marble_1/Marble012_2K-JPG_Roughness.jpg"
);
marble1_color.wrapS = THREE.RepeatWrapping;
marble1_color.wrapT = THREE.RepeatWrapping;
marble1_color.repeat.set(0.5, 1);
marble1.map = marble1_color;
// marble1.normalMap = marble1_nrml;
// marble1.roughnessMap = marble1_rough;
marble1.roughness = 0;
// marble1.metalness = 0.2
marble1_color.colorSpace = THREE.SRGBColorSpace;

const marble2 = new THREE.MeshStandardMaterial();
const marble2_color = textureLoader.load(
  "assets/marble/marble_2/Marble003_2K-JPG_Color.jpg"
);
const marble2_nrml = textureLoader.load(
  "assets/marble/marble_2/Marble003_2K-JPG_NormalGL.jpg"
);
const marble2_rough = textureLoader.load(
  "assets/marble/marble_2/Marble003_2K-JPG_Roughness.jpg"
);
marble2_color.wrapS = THREE.RepeatWrapping;
marble2_color.wrapT = THREE.RepeatWrapping;
marble2_color.repeat.set(1.5, 2.5);
marble2.map = marble2_color;
marble2.normalMap = marble2_nrml;
marble2.roughnessMap = marble2_rough;
marble2_color.colorSpace = THREE.SRGBColorSpace;

const marble3 = new THREE.MeshStandardMaterial();
const marble3_color = textureLoader.load(
  "assets/marble/marble_3/Marble006_2K-JPG_Color.jpg"
);
const marble3_nrml = textureLoader.load(
  "assets/marble/marble_3/Marble006_2K-JPG_NormalGL.jpg"
);
const marble3_rough = textureLoader.load(
  "assets/marble/marble_3/Marble006_2K-JPG_Roughness.jpg"
);
marble3_color.wrapS = THREE.RepeatWrapping;
marble3_color.wrapT = THREE.RepeatWrapping;
marble3_color.repeat.set(1.5, 2.5);
marble3.map = marble3_color;
marble3.normalMap = marble3_nrml;
marble3.roughnessMap = marble3_rough;
marble3_color.colorSpace = THREE.SRGBColorSpace;

const marble4 = new THREE.MeshStandardMaterial();
const marble4_color = textureLoader.load(
  "assets/marble/marble_4/Travertine013_2K-JPG_Color.jpg"
);
const marble4_nrml = textureLoader.load(
  "assets/marble/marble_4/Travertine013_2K-JPG_NormalGL.jpg"
);
const marble4_rough = textureLoader.load(
  "assets/marble/marble_4/Travertine013_2K-JPG_Roughness.jpg"
);
marble4_color.wrapS = THREE.RepeatWrapping;
marble4_color.wrapT = THREE.RepeatWrapping;
marble4_color.repeat.set(1.5, 2.5);
marble4.map = marble4_color;
marble4.normalMap = marble4_nrml;
marble4.roughnessMap = marble4_rough;
marble4_color.colorSpace = THREE.SRGBColorSpace;

const marble5 = new THREE.MeshStandardMaterial();
const marble5_color = textureLoader.load(
  "assets/marble/marble_5/Travertine003_2K-JPG_Color.jpg"
);
const marble5_nrml = textureLoader.load(
  "assets/marble/marble_5/Travertine003_2K-JPG_NormalGL.jpg"
);
const marble5_rough = textureLoader.load(
  "assets/marble/marble_5/Travertine003_2K-JPG_Roughness.jpg"
);
marble5_color.wrapS = THREE.RepeatWrapping;
marble5_color.wrapT = THREE.RepeatWrapping;
marble5_color.repeat.set(1.5, 2.5);
marble5.map = marble5_color;
marble5.normalMap = marble5_nrml;
marble5.roughnessMap = marble5_rough;
marble5_color.colorSpace = THREE.SRGBColorSpace;

const marble_textures = [marble1, marble2, marble3, marble4, marble5];

// loading floor textures
const floor1 = new THREE.MeshStandardMaterial();
const floor1_color = textureLoader.load("assets/floor/Resource Boy - Marble Textures/34.jpg");
floor1.map = floor1_color;
floor1.roughness = 0;
floor1_color.colorSpace = THREE.SRGBColorSpace
floor1_color.wrapS = THREE.RepeatWrapping
floor1_color.wrapT = THREE.RepeatWrapping
floor1_color.repeat.set(0.5, 1)

const floor2 = new THREE.MeshStandardMaterial();
const floor2_color = textureLoader.load("assets/floor/Resource Boy - Marble Textures/21.jpg");
floor2.map = floor2_color;
floor2.roughness = 0;
floor2_color.colorSpace = THREE.SRGBColorSpace
floor2_color.wrapS = THREE.RepeatWrapping
floor2_color.wrapT = THREE.RepeatWrapping
floor2_color.repeat.set(0.5, 1)

const floor3 = new THREE.MeshStandardMaterial();
const floor3_color = textureLoader.load("assets/floor/Resource Boy - Marble Textures/80.jpg");
floor3.map = floor3_color;
floor3.roughness = 0;
floor3_color.colorSpace = THREE.SRGBColorSpace
floor3_color.wrapS = THREE.RepeatWrapping
floor3_color.wrapT = THREE.RepeatWrapping
floor3_color.repeat.set(0.5, 1)

const floor4 = new THREE.MeshStandardMaterial();
const floor4_color = textureLoader.load("assets/floor/Resource Boy - Marble Textures/67.jpg");
floor4.map = floor4_color;
floor4.roughness = 0;
floor4_color.colorSpace = THREE.SRGBColorSpace
floor4_color.wrapS = THREE.RepeatWrapping
floor4_color.wrapT = THREE.RepeatWrapping
floor4_color.repeat.set(0.5, 1)

const floor5 = new THREE.MeshStandardMaterial();
const floor5_color = textureLoader.load("assets/floor/Resource Boy - Marble Textures/66.jpg");
floor5.map = floor5_color;
floor5.roughness = 0;
floor5_color.colorSpace = THREE.SRGBColorSpace
floor5_color.wrapS = THREE.RepeatWrapping
floor5_color.wrapT = THREE.RepeatWrapping
floor5_color.repeat.set(0.5, 1)

const floor6 = new THREE.MeshStandardMaterial();
const floor6_color = textureLoader.load("assets/floor/Resource Boy - Marble Textures/05.jpg");
floor6.map = floor6_color;
floor6.roughness = 0;
floor6_color.colorSpace = THREE.SRGBColorSpace
floor6_color.wrapS = THREE.RepeatWrapping
floor6_color.wrapT = THREE.RepeatWrapping
floor6_color.repeat.set(0.5, 1)

const floor7 = new THREE.MeshStandardMaterial();
const floor7_color = textureLoader.load("assets/floor/Resource Boy - Marble Textures/121.jpg");
floor7.map = floor7_color;
floor7.roughness = 0;
floor7_color.colorSpace = THREE.SRGBColorSpace
floor7_color.wrapS = THREE.RepeatWrapping
floor7_color.wrapT = THREE.RepeatWrapping
floor7_color.repeat.set(0.5, 1)

const floor8 = new THREE.MeshStandardMaterial();
const floor8_color = textureLoader.load("assets/floor/Resource Boy - Marble Textures/185.jpg");
floor8.map = floor8_color;
floor8.roughness = 0;
floor8_color.colorSpace = THREE.SRGBColorSpace
floor8_color.wrapS = THREE.RepeatWrapping
floor8_color.wrapT = THREE.RepeatWrapping
floor8_color.repeat.set(0.5, 1)

const floor_textures = [floor1, floor2, floor3, floor4, floor5, floor6, floor7, floor8];

// loading wall textures
const wall1 = new THREE.MeshStandardMaterial({ color: 0x000000 });
// const wall1_color = textureLoader.load(
//   "assets/wall/wall1/Metal027_2K-JPG_Color.jpg"
// );
const wall1_nrml = textureLoader.load(
  "assets/wall/wall1/Metal027_2K-JPG_NormalGL.jpg"
);
const wall1_rough = textureLoader.load(
  "assets/wall/wall1/Metal027_2K-JPG_Roughness.jpg"
);
// wall1.map = wall1_color;
wall1.normalMap = wall1_nrml;
wall1.roughnessMap = wall1_rough;
// wall1_color.colorSpace = THREE.SRGBColorSpace;

const wall_textures = [wall1];

const plastic = new THREE.MeshStandardMaterial();
const plastic_color = textureLoader.load("assets/plastic/Plastic013A_2K-JPG_Color.jpg")
const plastic_nrml = textureLoader.load("assets/plastic/Plastic013A_2K-JPG_NormalGL.jpg")
const plastic_rough = textureLoader.load("assets/plastic/Plastic013A_2K-JPG_Roughness.jpg")
// plastic.map = plastic_color
// plastic.normalMap = plastic_nrml
// plastic.roughnessMap = plastic_rough
// plastic_color.colorSpace = THREE.SRGBColorSpace

const plastic_ = [plastic]

var gui = new GUI();

var conf = { color: "#000000" };
gui.addColor(conf, "color").onChange((colorValue) => {
  if(wall_selected) wall1.color.set(colorValue);
  else if(cabinet_selected) plastic.color.set(colorValue);
});

var guiEl = gui.domElement;
guiEl.style.display = "none";
guiEl.style.position = "relative"
guiEl.style.top = "20px"
guiEl.style.width = "150px"
sofa_ui.appendChild(guiEl)
console.log(right_frame)

document.addEventListener("click", onMouseClick, false);
function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    if (clickedObject.name == "pointer_1") {
      controls.enabled = false;
      current_viewing = 1;
      calling_pointer[1]();
    }
    if (clickedObject.name == "pointer_2") {
      controls.enabled = false;
      current_viewing = 2;
      calling_pointer[2]();
    }
    if (clickedObject.name == "pointer_3") {
      controls.enabled = false;
      current_viewing = 3;
      calling_pointer[3]();
    }
  }

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    console.log(clickedObject);
    console.log(clickedObject.name);
    console.log(current_viewing);
    if (current_viewing == 1 && sofa.includes(clickedObject.name)) {
      sofa_focus = true;
      sofa_ui.style.display = "block";
      name.innerHTML = "Sofa";
      if (!ui_present) create_ui(sofa_thumbnails, sofa, sofa_textures);
      right_frame.style.display = "block";
    }
    if (current_viewing == 1 && sofa_cushions.includes(clickedObject.name)) {
      sofa_focus = true;
      sofa_ui.style.display = "block";
      name.innerHTML = "Sofa Cushions";
      if (!ui_present) create_ui(sofa_thumbnails, sofa_cushions, sofa_textures);
      right_frame.style.display = "block";
    }
    if(current_viewing == 1 && sofa_table.includes(clickedObject.name)) {
      sofa_focus = true;
      sofa_ui.style.display = "block";
      name.innerHTML = "Sofa Table"
      if (!ui_present) create_ui(wood_thumnails, sofa_table, wood_texture);
      right_frame.style.display = "block";
    }
    if (current_viewing == 2 && dining.includes(clickedObject.name)) {
      sofa_focus = true;
      sofa_ui.style.display = "block";
      name.innerHTML = "Dining Table";
      if (!ui_present) create_ui(wood_thumnails, dining, wood_texture);
      right_frame.style.display = "block";
    }
    if (current_viewing == 2 && dining_seat.includes(clickedObject.name)) {
      sofa_focus = true;
      name.innerHTML = "Chair Fabric";
      sofa_ui.style.display = "block";
      if (!ui_present) create_ui(sofa_thumbnails, dining_seat, sofa_textures);
      right_frame.style.display = "block";
    }
    if (current_viewing == 3 && kitchen_wood.includes(clickedObject.name)) {
      sofa_focus = true;
      sofa_ui.style.display = "block";
      name.innerHTML = "Kitchen Wood";
      if (!ui_present) create_ui(wood_thumnails, kitchen_wood, wood_texture);
      right_frame.style.display = "block";
    }
    if (current_viewing == 3 && kitchen_marble.includes(clickedObject.name)) {
      sofa_focus = true;
      sofa_ui.style.display = "block";
      name.innerHTML = "Kitchen Marble";
      if (!ui_present)
        create_ui(floor_thumbnails,kitchen_marble, floor_textures);
      right_frame.style.display = "block";
    }
    if (current_viewing == 3 && kitchen_cabinet.includes(clickedObject.name)) {
      sofa_focus = true;
      sofa_ui.style.display = "block";
      name.innerHTML = "Kitchen Cabinet";
      if (!ui_present)
        create_ui(plastic_thumbnail, kitchen_cabinet, plastic_);
      cabinet_selected = true;
      guiEl.style.display = "block";
      right_frame.style.display = "block";
    }
    if (current_viewing == 0 && floor.includes(clickedObject.name)) {
      sofa_focus = true;
      sofa_ui.style.display = "block";
      name.innerHTML = "Floor";
      wall_selected = true;
      if (!ui_present) create_ui(floor_thumbnails , floor, floor_textures);
      right_frame.style.display = "block";
    }
    if (current_viewing == 0 && wall.includes(clickedObject.name)) {
      sofa_focus = true;
      sofa_ui.style.display = "block";
      guiEl.style.display = "block";
      name.innerHTML = "Wall";
      wall_selected = true
      if (!ui_present) create_ui(wall_thumbnails, wall, wall_textures);
      right_frame.style.display = "block";
    }
  }
}

const pointer_1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.05, 32, 32),
  new THREE.MeshBasicMaterial()
);
pointer_1.name = "pointer_1";
pointer_1.position.set(1.6, 1.2, 1.4);
scene.add(pointer_1);

const pointer_2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.05, 32, 32),
  new THREE.MeshBasicMaterial()
);
pointer_2.name = "pointer_2";
pointer_2.position.set(-1.5, 0.7, -0.6);
scene.add(pointer_2);

const pointer_3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.05, 32, 32),
  new THREE.MeshBasicMaterial()
);
pointer_3.name = "pointer_3";
pointer_3.position.set(-2.2, 0.8, 0.6);
scene.add(pointer_3);

// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointlight = new THREE.PointLight(0xffffff, 4);
pointlight.position.set(-0.5, 1.8, -0.6);
pointlight.castShadow = true;
pointlight.shadow.mapSize.width = 2048;
pointlight.shadow.mapSize.height = 2048;
pointlight.shadow.bias = -0.001;
pointlight.shadow.camera.near = 0.1;
pointlight.shadow.camera.far = 100;
pointlight.shadow.camera.left = -20;
pointlight.shadow.camera.right = 20;
pointlight.shadow.camera.top = 20;
pointlight.shadow.camera.bottom = -20;
scene.add(pointlight);

// Renderer instancing
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 0.8;
renderer.render(scene, camera);

// Orbital Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// Resizing renderer and camera view with the size of window
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Fullscreen on double click
window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Animate function
function animate(time) {
  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
