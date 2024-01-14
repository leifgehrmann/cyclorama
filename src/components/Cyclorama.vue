<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ref, onMounted } from 'vue'

// Todo list:
// * Arrange cylinders
// * Render image on panorama
// * WASD + QERF Camera controls

//var texture1 = new THREE.TextureLoader().load( 'public/London_360_from_St_Paul\'s_Cathedral_-_Sept_2007.jpg' );
var texture1 = new THREE.TextureLoader().load( 'public/Barker_Panorama.jpg' );

const scene = new THREE.Scene();
// scene.background = new THREE.Color( 0xAACCED );
scene.background = new THREE.Color( 0xF8EFE8 );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

const ft2m = (feet: number): number => {
  return 0.3048 * feet;
}

// const panoramaRadius = ft2m(130/2);
// const panoramaHeight = ft2m(130/2);
// const panoramaY = -5;
const panoramaRadius = ft2m(130/2);
const panoramaHeight = ft2m(50.3);
const panoramaY = 0;

const panoramaGeom = new THREE.CylinderGeometry( panoramaRadius, panoramaRadius, panoramaHeight, 60, 1, true);

const panoramaMat = new THREE.MeshBasicMaterial( { map: texture1 } );
const panorama = new THREE.Mesh( panoramaGeom, panoramaMat );

panorama.geometry.scale(-1, -1, -1)
panorama.geometry.rotateZ(Math.PI)
panorama.geometry.translate(0, panoramaY, 0);

scene.add( panorama );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableZoom = false;

camera.position.z = 1;

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
animate();

const canvas = ref(null)

onMounted(() => {
  canvas.value.appendChild(renderer.domElement);
})
</script>

<template>
  <div ref="canvas"></div>
</template>

<style scoped>
</style>
