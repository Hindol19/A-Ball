import "./style.css";

import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//SCENE:
const scene = new THREE.Scene();

//Creating our Sphere:
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.5,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
//Now we have a scene with a sphere:

//SIZES:
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//LIGHT:
const light = new THREE.PointLight(0xffffff, 1, 100);
light.intensity = 1.25;
light.position.set(0, 10, 10);
scene.add(light);

//CAMERA:
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

//RENDERER:
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//Controls:
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 8;

//Resize in real time:
window.addEventListener("resize", () => {
  //Update Sizes:
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update Camera:
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //Update Renderer:
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

//Timeline Magic:
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });


let mousedown = false;
let rgb = [];
window.addEventListener("mousedown", () => {
  mousedown = true;
});
window.addEventListener("mouseup", () => {
  mousedown = false;
});
window.addEventListener("mousemove", (e) => {
  if (mousedown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.width) * 255),
      150,
    ];

    //Lets Animate:
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
