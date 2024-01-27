import * as THREE from 'three';

export default class Panorama {
  constructor(
    scene: THREE.Scene,
    panoramaUrls: string[],
    panoramaRadius: number,
    panoramaHeight: number,
    panoramaY: number,
  ) {
    panoramaUrls.map((panoramaUrl, index) => {
      new THREE.TextureLoader().load(panoramaUrl, (texture) => {
        texture.colorSpace = 'srgb'

        const thetaLength = Math.PI * 2 / panoramaUrls.length;
        const thetaStart = thetaLength * index

        const panoramaGeom = new THREE.CylinderGeometry( panoramaRadius, panoramaRadius, panoramaHeight, 60, 1, true, thetaStart, thetaLength);
        const panoramaMat = new THREE.MeshBasicMaterial( { map: texture } );
        const panorama = new THREE.Mesh( panoramaGeom, panoramaMat );

        panorama.geometry.scale(-1, -1, -1)
        panorama.geometry.rotateZ(Math.PI)
        panorama.geometry.translate(0, panoramaHeight / 2 + panoramaY, 0);
        scene.add( panorama );
      });
    })
  }
}