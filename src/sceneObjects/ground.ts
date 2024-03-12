import * as THREE from 'three';

export default class Ground {
  private objects: THREE.Mesh[];

  constructor(
    panoramaRadius: number,
    panoramaGroundY: number,
    groundYStart: number,
    groundYEnd: number,
    groundColor: THREE.Color,
  ) {
    this.objects = [];

    const groundGeom = new THREE.CylinderGeometry(panoramaRadius + 0.05, panoramaRadius + 0.05, groundYStart - panoramaGroundY, 60, 1, true);
    const groundMat = new THREE.MeshBasicMaterial( { color: groundColor, side: THREE.FrontSide } );
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.geometry.scale(-1, -1, -1)
    ground.geometry.rotateZ(Math.PI)
    ground.geometry.translate(0, (groundYStart - panoramaGroundY) / 2, 0);
    this.objects.push(ground);

    const fadeGeom = new THREE.CylinderGeometry(panoramaRadius - 0.01, panoramaRadius - 0.01, groundYEnd - groundYStart, 60, 1, true);
    const fadeMat = new THREE.ShaderMaterial({
      uniforms: {
        color1: {
          value: groundColor.clone().convertLinearToSRGB()
        },
        color2: {
          value: groundColor.clone().convertLinearToSRGB()
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

      gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0 - vUv.y);
    }
  `
    });
    fadeMat.transparent = true;
    const fade = new THREE.Mesh(fadeGeom, fadeMat);
    fade.geometry.scale(-1, -1, -1)
    fade.geometry.rotateZ(Math.PI)
    fade.geometry.translate(0, (groundYEnd - groundYStart) / 2 + groundYStart, 0);
    this.objects.push(fade);

    const panoramaGroundGeom = new THREE.PlaneGeometry(
      (panoramaRadius + 0.05) * 2,
      (panoramaRadius + 0.05) * 2
    );
    const panoramaGroundMat = new THREE.MeshBasicMaterial( { color: groundColor, side: THREE.BackSide } );
    const panoramaGround = new THREE.Mesh(panoramaGroundGeom, panoramaGroundMat);
    panoramaGround.geometry.rotateX(Math.PI/2);
    panoramaGround.geometry.translate(0, panoramaGroundY, 0);
    this.objects.push(panoramaGround);
  }

  addToScene(scene: THREE.Scene): void {
    this.objects.map((object) => {
      scene.add(object);
    })
  }
}