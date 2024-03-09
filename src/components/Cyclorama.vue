<script setup lang="ts">
import * as THREE from 'three';
import {ref, onMounted, defineProps, defineEmits} from 'vue'
import Stage from "../sceneObjects/stage.ts";
import Sky from "../sceneObjects/sky.ts";
import Ground from "../sceneObjects/ground.ts";
import Person from "../sceneObjects/person.ts";
import Panorama from "../sceneObjects/panorama.ts";
import {ControlState} from "../utils/types.ts";

const props = defineProps<{
  camera: THREE.PerspectiveCamera,
  controlState: ControlState
}>()

const emit = defineEmits(['progressUpdate'])

const canvas = ref(null as null | HTMLDivElement)

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000)

const mode = 'edinburgh-2' as
    | 'treport'
    | 'trafalgar'
    | 'lausanne'
    | 'london'
    | 'horner'
    | 'barker'
    | 'edinburgh'
    | 'edinburgh-2'
    | 'blondon'
    | 'alps'
    | 'constantinople'
    | 'constantinople-2'
    | 'constantinople-4'
    | 'waterloo'
    | 'montmartre'
    | 'cairo'
    | 'naples'
    | 'malta'
    | 'lisbon'
    | 'berlin'
    | 'badajoz'
    | 'paris'
    | 'elba'
    | 'vittoria'
    | 'new-york'
    | 'cornwallis'
    | 'blondon2';

const ft2m = (feet: number): number => {
  return 0.3048 * feet;
}

let panoramaUrls: string[];
let panoramaUrlHeights: number[];
let panoramaRadius: number;
let panoramaHeight: number;
let panoramaCeilingY: number;
let groundColor: THREE.Color = new THREE.Color(0x000000);
let groundYStart: number;
let groundYEnd: number;
let skyColor: THREE.Color;
let skyYStart: number;
let skyYEnd: number;
let panoramaY: number;
let stageRadius = ft2m(30/2);
let stageHeight = 0;
let umbrellaRadius = ft2m(50/2);
let ceilingHeight = 4;
let initialCameraYaw = 0;
// noinspection JSUnreachableSwitchBranches
switch (mode) {
  case 'treport': {
    panoramaUrls = ['1982,U.3982-panorama.jpg'];
    skyColor = new THREE.Color(0xF3D3AC);
    groundColor = new THREE.Color(0xF3D3AC);
    const imageWidth = 9334;
    const imageHeight = 1249;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.4;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight + 0.05
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'trafalgar': {
    panoramaUrls = ['40348i-panorama.jpg'];
    skyColor = new THREE.Color(0xCABAAB);
    groundColor = new THREE.Color(0x939E95);
    const imageWidth = 26112;
    const imageHeight = 2974;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.1;
    skyYStart = panoramaY + panoramaHeight - 4
    skyYEnd = panoramaY + panoramaHeight -3
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'lausanne': {
    panoramaUrls = ['2010,7081.7379-panorama.jpg'];
    skyColor = new THREE.Color(0xFFFBDA);
    groundColor = new THREE.Color(0xFFFBDA);
    const imageWidth = 7941;
    const imageHeight = 619;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.3;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight + 0.05
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'vittoria': {
    panoramaUrls = ['1886,0111.23.1-panorama.jpg'];
    skyColor = new THREE.Color(0xF1D4AC);
    groundColor = new THREE.Color(0xF1D4AC);
    const imageWidth = 27595;
    const imageHeight = 2488;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.3;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight + 0.05
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'elba': {
    panoramaUrls = ['1886,0111.23.2-panorama.jpg'];
    skyColor = new THREE.Color(0xF1D4AC);
    groundColor = new THREE.Color(0xF1D4AC);
    const imageWidth = 20797;
    const imageHeight = 1134;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.1;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight + 0.05
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'waterloo': {
    panoramaUrls = ['1886,0111.23.3-panorama.jpg'];
    skyColor = new THREE.Color(0xF6DAB1);
    groundColor = new THREE.Color(0xD1B594);
    const imageWidth = 22996;
    const imageHeight = 1526;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.2;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.2;
    break;
  }
  case 'paris': {
    panoramaUrls = ['1886,0111.23.4-panorama.jpg'];
    skyColor = new THREE.Color(0xF2D8B5);
    groundColor = new THREE.Color(0xF1D4AC);
    const imageWidth = 22782;
    const imageHeight = 1812;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.35;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'badajoz': {
    panoramaUrls = ['1886,0111.23.5-panorama.jpg'];
    skyColor = new THREE.Color(0xF2D8B5);
    groundColor = new THREE.Color(0x000000);
    const imageWidth = 22782;
    const imageHeight = 1812;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.35;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'berlin': {
    panoramaUrls = ['1886,0111.23.6-panorama.jpg'];
    skyColor = new THREE.Color(0xF2D8B5);
    groundColor = new THREE.Color(0xF1D4AC);
    const imageWidth = 21312;
    const imageHeight = 1936;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.65;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'cairo': {
    panoramaUrls = ['1886,0111.23.9-panorama.jpg'];
    skyColor = new THREE.Color(0xF2D8B5);
    groundColor = new THREE.Color(0x1E1F22);
    const imageWidth = 20671;
    const imageHeight = 1800;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.3;
    skyYStart = panoramaY + panoramaHeight - 0.5
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.2;
    break;
  }
  case 'lisbon': {
    panoramaUrls = ['1886,0111.23.10-panorama.jpg'];
    skyColor = new THREE.Color(0xF2D8B5);
    groundColor = new THREE.Color(0xE9C9A1);
    const imageWidth = 22556;
    const imageHeight = 1158;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.01;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'malta': {
    panoramaUrls = ['1886,0111.23.11-panorama.jpg'];
    skyColor = new THREE.Color(0xF6DFB6);
    groundColor = new THREE.Color(0xE9C9A1);
    const imageWidth = 22946;
    const imageHeight = 1742;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.35;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'naples': {
    panoramaUrls = ['1886,0111.23.12-panorama.jpg'];
    skyColor = new THREE.Color(0xF2D8B5);
    groundColor = new THREE.Color(0xE9C9A1);
    const imageWidth = 15909;
    const imageHeight = 1206;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.2;
    skyYStart = panoramaY + panoramaHeight - 0.25
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.1;
    break;
  }
  case 'montmartre': {
    panoramaUrls = ['1886,0111.23.13-panorama.jpg'];
    skyColor = new THREE.Color(0xF2D8B5);
    groundColor = new THREE.Color(0x1E1F22);
    const imageWidth = 24190;
    const imageHeight = 2224;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.4;
    skyYStart = panoramaY + panoramaHeight - 0.5
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.2;
    break;
  }
  case 'blondon2': {
    panoramaUrls = [
      'yale-orbis-205530-stitch-00.jpg',
      'yale-orbis-205530-stitch-01.jpg',
      'yale-orbis-205530-stitch-02.jpg',
      'yale-orbis-205530-stitch-03.jpg',
      'yale-orbis-205530-stitch-04.jpg',
      'yale-orbis-205530-stitch-05.jpg',
      'yale-orbis-205530-stitch-06.jpg',
      'yale-orbis-205530-stitch-07.jpg',
      'yale-orbis-205530-stitch-08.jpg',
      'yale-orbis-205530-stitch-09.jpg',
      'yale-orbis-205530-stitch-10.jpg',
      'yale-orbis-205530-stitch-11.jpg',
      'yale-orbis-205530-stitch-12.jpg',
      'yale-orbis-205530-stitch-13.jpg',
      'yale-orbis-205530-stitch-14.jpg',
      'yale-orbis-205530-stitch-15.jpg',
      'yale-orbis-205530-stitch-16.jpg',
      'yale-orbis-205530-stitch-17.jpg',
    ];
    skyColor = new THREE.Color(0xC2C2BF);
    groundColor = new THREE.Color(0x1E1F22);
    const imageWidth = 34684;
    const imageHeight = 4559;
    panoramaUrlHeights = [2280, 2279];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.4;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.2;
    break;
  }
  case 'blondon': {
    panoramaUrls = ['blondon.jpg'];
    skyColor = new THREE.Color(0xC2C2BF);
    groundColor = new THREE.Color(0x1E1F22);
    const imageWidth = 6219;
    const imageHeight = 790;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.4;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.2;
    break;
  }
  case 'constantinople': {
    panoramaUrls = ['Constantinople.jpg'];
    skyColor = new THREE.Color(0xD8CFC8);
    groundColor = new THREE.Color(0x000000);
    const imageWidth = 1875;
    const imageHeight = 319;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.4;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 2;
    break;
  }
  case 'constantinople-2': {
    panoramaUrls = ['1982,U.350-panorama.jpg'];
    skyColor = new THREE.Color(0xFFFBC4);
    groundColor = new THREE.Color(0xFFFBC4);
    const imageWidth = 24165;
    const imageHeight = 2258;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.46;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.5;
    break;
  }
  case 'constantinople-4': {
    panoramaUrls = [
      'constantinople-color-small-00.jpg',
      'constantinople-color-small-01.jpg',
      'constantinople-color-small-02.jpg',
      'constantinople-color-small-03.jpg',
      'constantinople-color-small-04.jpg',
      'constantinople-color-small-05.jpg',
      'constantinople-color-small-06.jpg',
    ];
    skyColor = new THREE.Color(0xD8CFC8);
    groundColor = new THREE.Color(0x000000);
    const imageWidth = 25172;
    const imageHeight = 3136;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.5;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 0.25;
    break;
  }
  case 'alps': {
    panoramaUrls = ['alps.jpg'];
    skyColor = new THREE.Color(0xD8CFC8);
    groundColor = new THREE.Color(0x000000);
    const imageWidth = 4096;
    const imageHeight = 1491;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(227 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.4;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 10;
    break;
  }
  case 'edinburgh': {
    panoramaUrls = ['lanorama.jpg'];
    skyColor = new THREE.Color(0xD8CFC8);
    const imageWidth = 4000;
    const imageHeight = 544;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.45;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 1;
    break;
  }
  case 'horner': {
    panoramaUrls = [
      '1880,1113.1214.jpg',
    ];
    skyColor = new THREE.Color(0xFFFEDF);
    groundColor = new THREE.Color(0xFFFEDF);
    const imageWidth = 12786;
    const imageHeight = 1090;
    panoramaUrlHeights = [imageHeight];
    panoramaRadius = ft2m(130 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.65;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd + 0.3;
    groundYStart = panoramaY;
    groundYEnd = panoramaY;
    break;
  }
  case 'london': {
    panoramaUrls = [
        'london-00.jpg',
        'london-01.jpg',
        'london-02.jpg',
        'london-03.jpg',
        'london-04.jpg',
    ];
    panoramaUrlHeights = [2904];
    skyColor = new THREE.Color(0xAACCED);
    groundColor = new THREE.Color(0x111121);
    panoramaRadius = ft2m(130 / 2);
    panoramaHeight = ft2m(130 / 2);
    panoramaY = -panoramaHeight * 0.7;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 2;
    break;
  }
  default: {
    panoramaUrls = [
        'barker-00.jpg',
        'barker-01.jpg',
        'barker-02.jpg',
        'barker-03.jpg',
        'barker-04.jpg',
    ];
    skyColor = new THREE.Color(0xDCD7B7);
    groundColor = new THREE.Color(0x212111);
    const imageWidth = 18237;
    const imageHeight = 2248;
    panoramaRadius = ft2m(84 / 2);
    panoramaUrlHeights = [imageHeight];
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.5;
    stageRadius = ft2m(27/2);
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 1;
    initialCameraYaw = Math.PI * 0.8;
    break;
  }
}

const railingHeight = 0.9;
const railingCount = Math.round(stageRadius * Math.PI * 8);
const railingRadius = 0.02;
const railingPostOffset = 0.1;
const railingOnStageRadius = stageRadius - railingPostOffset - railingRadius;

const averageHeight = 1.70; // Average height for UK in the 1800s.
const breathingRatePerMin = 15; // Usually between 12-18 breaths per minute.
const breathingBobHeight = 0.02;

const renderer = new THREE.WebGLRenderer({antialias: true});

let cameraFov = 50;
let cameraPosX = props.camera.position.x;
let cameraPosZ = props.camera.position.z;
let cameraSagittalVel = 0;
let cameraSagittalVelDecel = 0.7;
let cameraSagittalAcc = 0;
let cameraFrontalVel = 0;
let cameraFrontalVelDecel = 0.7;
let cameraFrontalAcc = 0;
let cameraYaw = initialCameraYaw;
let cameraYawVel = 0;
let cameraYawAcc = 0;
let cameraPitch = 0;
let cameraPitchVel = 0;
let cameraPitchAcc = 0;
let cameraRoll = 0;
let cameraRollVel = 0;
let cameraRollVelDecel = 0.8;
let cameraRollAcc = 0;
let cameraZoom = 1;
let cameraZoomMin = cameraZoom - 0.25;
let cameraZoomMax = cameraZoom + 1.75;
let cameraZoomVel = 0;
let cameraZoomVelDecel = 0.8;
let cameraZoomAcc = 0;
let cameraHeight = 0;
let cameraHeightAcc = 0;
let cameraHeightVel = 0;
let cameraHeightVelDecel = 0.8;
let cameraHeightMin = cameraHeight - 1.0;
let cameraHeightMax = cameraHeight + 1.0;

let totalItemsToLoad = panoramaUrls.length + 4;
let itemsLoaded = 0;
const loadedTextureCallback = () => {
  itemsLoaded += 1;
  emit('progressUpdate', [itemsLoaded/totalItemsToLoad])
}

new Panorama(
    scene,
    panoramaUrls,
    panoramaUrlHeights,
    panoramaRadius,
    panoramaHeight,
    panoramaY,
    loadedTextureCallback
);

const stage = new Stage(
    stageRadius,
    stageHeight,
    umbrellaRadius,
    ceilingHeight,
    railingHeight,
    railingCount,
    railingRadius,
    railingOnStageRadius
);
stage.addToScene(scene)

const sky = new Sky(
    panoramaRadius,
    panoramaCeilingY,
    skyYStart,
    skyYEnd,
    skyColor,
);
sky.addToScene(scene)

const ground = new Ground(
    panoramaRadius,
    groundYStart,
    groundYEnd,
    groundColor,
);
ground.addToScene(scene)

const person1 = new Person(
    'person-1.png',
    425,
    880,
    0.01 / 5
)
person1.setPosition(stageRadius - 0.7, stageHeight, 0)
person1.addToScene(scene, loadedTextureCallback);

const person2 = new Person(
    'person-2.png',
    500,
    925,
    0.01 / 5
)
person2.setPosition(0, stageHeight, stageRadius - 1)
person2.addToScene(scene, loadedTextureCallback);

const person3 = new Person(
    'person-3.png',
    855,
    950,
    0.01 / 5
)
person3.setPosition(0, stageHeight, (stageRadius - 0.7) * -1)
person3.addToScene(scene, loadedTextureCallback);

const person4 = new Person(
    'person-4.png',
    350,
    865,
    0.01 / 5
)
person4.setPosition((stageRadius - 0.7) * -1, stageHeight, 0)
person4.addToScene(scene, loadedTextureCallback);
let people = [person1, person2, person3, person4];

props.camera.position.y = stageHeight + 1;

function resizeRendererToDisplaySize(renderer: THREE.Renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width  = window.innerWidth  * pixelRatio | 0;
  const height = window.innerHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

let lastRenderTime = new Date();

function animate() {
  requestAnimationFrame( animate );

  // Update View
  cameraYawAcc = props.controlState.yawAcc;
  cameraYawVel *= props.controlState.yawVelDeceleration;
  cameraYawVel += cameraYawAcc;

  cameraPitchAcc = props.controlState.pitchAcc;
  cameraPitchVel *= props.controlState.pitchVelDeceleration;
  cameraPitchVel += cameraPitchAcc;

  cameraRollAcc = props.controlState.rollAcc;
  cameraRollVel *= cameraRollVelDecel;
  cameraRollVel += cameraRollAcc;

  cameraZoomAcc = props.controlState.zoomAcc;
  cameraZoomVel *= cameraZoomVelDecel;
  cameraZoomVel += cameraZoomAcc;

  cameraHeightAcc = props.controlState.heightAcc;
  cameraHeightVel *= cameraHeightVelDecel;
  cameraHeightVel += cameraHeightAcc;

  cameraRoll += cameraRollVel;
  cameraZoom += cameraZoomVel;
  cameraHeight += cameraHeightVel;

  if (props.controlState.yawVel !== null) {
    cameraYawVel = 0;
    cameraYaw += props.controlState.yawVel
  } else {
    cameraYaw += cameraYawVel;
  }

  if (props.controlState.pitchVel !== null) {
    cameraPitchVel = 0;
    cameraPitch += props.controlState.pitchVel
  } else {
    cameraPitch += cameraPitchVel;
  }

  if (!props.controlState.boundaryBreak) {
    cameraPitch = THREE.MathUtils.clamp(cameraPitch, -Math.PI / 2, Math.PI / 2);
    cameraRoll = THREE.MathUtils.clamp(cameraRoll, -Math.PI / 2, Math.PI / 2);
    cameraZoom = THREE.MathUtils.clamp(cameraZoom, cameraZoomMin, cameraZoomMax);
    cameraHeight = THREE.MathUtils.clamp(cameraHeight, cameraHeightMin, cameraHeightMax);
  }

  // Update movement
  cameraSagittalAcc = props.controlState.sagittalAcc;
  cameraSagittalVel *= cameraSagittalVelDecel;
  cameraSagittalVel += cameraSagittalAcc;

  cameraFrontalAcc = props.controlState.frontalAcc;
  cameraFrontalVel *= cameraFrontalVelDecel;
  cameraFrontalVel += cameraFrontalAcc;

  cameraPosX -= Math.sin(-cameraYaw) * cameraSagittalVel + Math.sin(-cameraYaw - Math.PI / 2) * cameraFrontalVel;
  cameraPosZ -= Math.cos(-cameraYaw) * cameraSagittalVel + Math.cos(-cameraYaw - Math.PI / 2) * cameraFrontalVel;

  // Prevent out of bounds by resetting position to railing radius
  if (!props.controlState.boundaryBreak) {
    const angleFromCenter = Math.atan2(cameraPosX, cameraPosZ)
    const maxDistAtRailingX = Math.abs(Math.sin(angleFromCenter) * railingOnStageRadius);
    const maxDistAtRailingZ = Math.abs(Math.cos(angleFromCenter) * railingOnStageRadius);
    cameraPosX = THREE.MathUtils.clamp(cameraPosX, -maxDistAtRailingX, maxDistAtRailingX)
    cameraPosZ = THREE.MathUtils.clamp(cameraPosZ, -maxDistAtRailingZ, maxDistAtRailingZ)
  }

  resizeRendererToDisplaySize(renderer);
  props.camera.setRotationFromEuler(new THREE.Euler(
      -cameraPitch,
      -cameraYaw,
      -cameraRoll,
      'YZX'
  ))
  props.camera.position.x = cameraPosX;
  props.camera.position.z = cameraPosZ;
  props.camera.position.y = stageHeight + averageHeight + cameraHeight + Math.sin(new Date().getTime() / (60 / breathingRatePerMin * 1000) * Math.PI) * breathingBobHeight / 2;
  props.camera.fov = cameraFov * (1 / cameraZoom);
  props.camera.updateProjectionMatrix();

  people.forEach((person) => {
    const personDistance = Math.hypot(
        props.camera.position.x - person.getPosition().x,
        props.camera.position.z - person.getPosition().z,
    );
    const personTheta = Math.atan2(
        props.camera.position.x - person.getPosition().x,
        props.camera.position.z - person.getPosition().z,
    );
    person.setRotation(personTheta);
    let newOpacity: number;
    if (personDistance > stageRadius) {
      newOpacity = Math.min(1, person.getOpacity() + (new Date().getTime() - lastRenderTime.getTime()) / 1000 / 0.3)
    } else {
      newOpacity = Math.max(0, person.getOpacity() - (new Date().getTime() - lastRenderTime.getTime()) / 1000 / 0.3)
    }
    person.setOpacity(newOpacity);
  });
  renderer.render( scene, props.camera );
  lastRenderTime = new Date();
}
animate();

function updateSize() {
  if (canvas.value === null) {
    return;
  }
  const rect = canvas.value.parentElement?.getBoundingClientRect();
  const width = rect?.width ?? 1;
  const height = rect?.height ?? 1;
  // @ts-ignore
  props.camera.aspect = width / height;
  // @ts-ignore
  props.camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.render(scene, props.camera);
}

onMounted(() => {
  if (canvas.value === null) {
    return;
  }
  canvas.value.appendChild(renderer.domElement);
  updateSize();

  window.addEventListener('resize', () => {
    updateSize();
  });
  // When the element is hidden and displayed, we need to
  // make sure the canvas is correctly sized.
  const resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(updateSize);
  });
  if (canvas.value.parentElement !== null) {
    resizeObserver.observe(canvas.value.parentElement);
  }
})
</script>

<template>
  <div id="canvas" ref="canvas" class="absolute"></div>
</template>

<style scoped>
</style>
