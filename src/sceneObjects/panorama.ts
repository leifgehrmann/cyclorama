import * as THREE from 'three';

export default class Panorama {
  constructor(
    scene: THREE.Scene,
    panoramaUrl: string,
    panoramaRadius: number,
    panoramaHeight: number,
    panoramaY: number,
  ) {
    new THREE.TextureLoader().load(panoramaUrl, (texture) => {
      texture.colorSpace = 'srgb'

      const panoramaGeom = new THREE.CylinderGeometry( panoramaRadius, panoramaRadius, panoramaHeight, 60, 1, true);
      const panoramaMat = new THREE.MeshBasicMaterial( { map: texture } );
      const panorama = new THREE.Mesh( panoramaGeom, panoramaMat );

      panorama.geometry.scale(-1, -1, -1)
      panorama.geometry.rotateZ(Math.PI)
      panorama.geometry.translate(0, panoramaHeight / 2 + panoramaY, 0);
      scene.add( panorama );
    });
  }
}