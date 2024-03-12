import * as THREE from 'three';

export default class Sky {
  private objects: THREE.Mesh[];

  constructor(
    panoramaRadius: number,
    panoramaCeilingY: number,
    skyYStart: number,
    skyYEnd: number,
    skyColor: THREE.Color,
  ) {
    this.objects = [];

    const skyGeom = new THREE.CylinderGeometry(panoramaRadius + 0.05, panoramaRadius + 0.05, panoramaCeilingY - skyYStart, 60, 1, true);
    const skyMat = new THREE.MeshBasicMaterial( { color: skyColor, side: THREE.FrontSide } );
    const sky = new THREE.Mesh(skyGeom, skyMat);
    sky.geometry.scale(-1, -1, -1)
    sky.geometry.rotateZ(Math.PI)
    sky.geometry.translate(0, (panoramaCeilingY - skyYStart) / 2 + skyYStart, 0);
    this.objects.push(sky);

    const fadeGeom = new THREE.CylinderGeometry(panoramaRadius - 0.01, panoramaRadius - 0.01, skyYEnd - skyYStart, 60, 1, true);
    const fadeMat = new THREE.ShaderMaterial({
      uniforms: {
        color1: {
          value: skyColor.clone().convertLinearToSRGB()
        },
        color2: {
          value: skyColor.clone().convertLinearToSRGB()
        }
      },
      vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
      fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;

    varying vec2 vUv;

    void main() {

      gl_FragColor = vec4(mix(color1, color2, vUv.y), vUv.y);
    }
  `
    });
    fadeMat.transparent = true;
    const fade = new THREE.Mesh(fadeGeom, fadeMat);
    fade.geometry.scale(-1, -1, -1)
    fade.geometry.rotateZ(Math.PI)
    fade.geometry.translate(0, (skyYEnd - skyYStart) / 2 + skyYStart, 0);
    this.objects.push(fade);

    const panoramaCeilingGeom = new THREE.PlaneGeometry(
      (panoramaRadius + 0.05) * 2,
      (panoramaRadius + 0.05) * 2
    );
    const panoramaCeilingMat = new THREE.MeshBasicMaterial( { color: skyColor, side: THREE.FrontSide } );
    const panoramaCeiling = new THREE.Mesh(panoramaCeilingGeom, panoramaCeilingMat);
    panoramaCeiling.geometry.rotateX(Math.PI / 2);
    panoramaCeiling.geometry.translate(0, panoramaCeilingY, 0);
    this.objects.push(panoramaCeiling);
  }

  addToScene(scene: THREE.Scene): void {
    this.objects.map((object) => {
      scene.add(object);
    })
  }
}