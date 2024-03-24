import './style.css';
let language = "english";
const iframe = document.querySelector("iframe");

function resizeIframe() {
  iframe.style.height = iframe.contentWindow.document.documentElement.scrollHeight +10+ 'px';
}

window.addEventListener("DOMContentLoaded", resizeIframe);
iframe.addEventListener("change", resizeIframe);
document.getElementById("hebrew").addEventListener("click",()=>{
 if (language!="hebrew") {
  iframe.src = "./resume/hebrew.html"
  language = "hebrew";
 }
});

document.getElementById("english").addEventListener("click",()=>{
  if (language!="english") {
    iframe.src = "./resume/english.html"
   language = "english";
  }
});

window.addEventListener("resize", ()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  resizeIframe();
})

var dialog = document.querySelector('dialog');
if (!dialog) {
  dialogPolyfill.registerDialog(dialog);
}

import * as THREE from 'three';
import {DragControls} from 'three/examples/jsm/controls/DragControls';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const randrange = THREE.MathUtils.randFloat;
const pie = Math.PI, rand = Math.random;


const raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2;
let selected;
let camera_degree=0,camera_speed=0;
const to_camera = [];


const canvas = document.querySelector('#bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(0,10,10);
camera.lookAt(0,7,0);

const light = new THREE.PointLight(0xFFFFFF,100,0,1);
scene.add(light);
light.position.set(0,10,15);
scene.add(new THREE.AmbientLight(0xFFFFFF,0.7));


const sun = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({color: 0xFFFF00}));
sun.position.set(0,10,15);
scene.add(sun);

const balls = Array(200).fill().map(randomball); 

const fontloader = new FontLoader();
fontloader.load("./droid_sans_bold.typeface.json", function (font) {
  make_text(font,"Portfolio - Shalev Argaman");
})

const plane1 = photo_plane([100, 100], "./python_logo.png");
plane1.position.set(-77,0,-200);
const plane2 = photo_plane([100, 100], "./C_logo.png");
plane2.position.set(77,0,-200);
const plane3 = photo_plane([100, 100], "./Csharp_Logo.png");
plane3.position.set(-175,0,-122);
const plane4 = photo_plane([100, 100], "./js_logo.png");
plane4.position.set(175,0,-122  );

function photo_plane([width, height], photo_path) {
  const texture = new THREE.TextureLoader().load(photo_path);
  const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      color : 0xffffff
  });
  const plane =  new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  to_camera.push(plane);
  scene.add(plane);
  return plane;
}

function make_text(font,message){
  const matLite = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  });
  
  const geometry = new TextGeometry(message, {
    font: font,
    size: 50,
    height: 0.1,
    curveSegments: 12,
  });

  geometry.computeBoundingBox();
  const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
  geometry.translate(xMid, 0, 0);

  const text = new THREE.Mesh(geometry, matLite);
  text.position.z = -550;
  text.position.y = 130;
  scene.add(text);
  return text;
}

function pos_outof_sphere(mindistance,maxdistance, minheight, maxheight, degree_start, degree_range){
  const degree = degree_start + degree_range*rand();
  const distance = mindistance + rand()*(maxdistance-mindistance);
  return [distance*Math.sin(degree), randrange(minheight, maxheight), Math.cos(degree)*distance];
}

function randomball(){
  const ball = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshLambertMaterial({color : 0x444444 + (0xAAAAAA * Math.random())}));
  ball.position.set(...pos_outof_sphere(10,15,-2,2.5,0,2*pie));
  ball.rotation.set(1.57*rand(),1.57*rand(),1.57*rand());
  ball.scale.set(rand()+1,rand()+1,rand()+1);
  scene.add(ball);
  return ball;
}

const drag = new DragControls(balls, camera, canvas);
drag.addEventListener("dragstart", ()=>{
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersect = raycaster.intersectObjects(scene.children, false);
  if(intersect.length && balls.includes(intersect[0].object)){
    selected = intersect[0].object;
    selected.material.emissive.set(0x999999);
  }
})
drag.addEventListener("dragend", ()=>{
  if(selected) selected.material.emissive.set(0);
})


document.addEventListener("keydown",(ev)=>{
  switch (ev.code) {
    case "ArrowLeft":
    case "KeyA":
      if(camera_speed<100){
        if(camera_speed<20){
          camera_speed+=4;
        }else{{
          camera_speed+=2;
        }}
      }
      break;
    case "ArrowRight":
    case "KeyD":
      if(camera_speed>-100){
        if(camera_speed>-20){
          camera_speed-=4;
        }else{{
          camera_speed-=2;
        }}
      }
      break;
  }
});
let last_time=0;
function render_loop(time){
  requestAnimationFrame(render_loop);
  const delta_time = time - last_time;
  last_time = time;
  camera_degree+= camera_speed/30_000*delta_time;
  camera.position.set(Math.sin(camera_degree)*10,10,Math.cos(camera_degree)*10);
  camera.lookAt(0,7,0);
  if (camera_speed!=0) {
    console.log(delta_time);
    if (camera_speed<0) {
      camera_speed+=1;
    } else{
      camera_speed-=1;
    }
    
  }
  to_camera.forEach((obj)=>{
    obj.lookAt(camera.position)
  });
  renderer.render(scene,camera);
}
requestAnimationFrame(render_loop);

function starGeometry(innerRadius, outerRadius, numPoints){
  // Create a shape representing the star
  const starShape = new THREE.Shape();
  for (let i = 0; i < numPoints * 2; i++) {
      const radius = i % 2 === 0 ? innerRadius : outerRadius;
      const angle = (i / numPoints) * Math.PI;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
          starShape.moveTo(x, y);
      } else {
          starShape.lineTo(x, y);
      }
  }
  
  const extrudeSettings = {
      steps: 1,
      depth: 1,
      bevelEnabled: false
  };
  return new THREE.ExtrudeGeometry(starShape, extrudeSettings);
}
function randomstar(){
  const star = new THREE.Mesh(new starGeometry(1,2.5,5), new THREE.MeshLambertMaterial({color: 0xffd700}));
  star.position.set(...pos_outof_sphere(28,48,5,15,1.5*pie,pie));
  star.scale.set(rand()+1,rand()+1,rand()+1);
  star.lookAt(0,7,0);
  scene.add(star);
  return star;
}
const stars = Array(20).fill().map(randomstar); 
