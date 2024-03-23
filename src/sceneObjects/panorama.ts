import * as THREE from 'three';

export default class Panorama {
  constructor(
    scene: THREE.Scene,
    panoramaUrls: string[],
    panoramaImageHeights: number[],
    panoramaRadius: number,
    panoramaHeight: number,
    panoramaY: number,
    loadedTextureCallback: () => void,
    loadingTextureFailedCallback: () => void,
  ) {
    const imageHeightSum = panoramaImageHeights.reduce((s, h) => s + h, 0);
    panoramaUrls.map((panoramaUrl, index) => {
      new THREE.TextureLoader().load(panoramaUrl, (texture) => {
        texture.colorSpace = 'srgb'

        const rowIndex = Math.floor(index / (panoramaUrls.length / panoramaImageHeights.length))
        const colIndex = index % (panoramaUrls.length / panoramaImageHeights.length);
        const thetaLength = Math.PI * 2 / (panoramaUrls.length / panoramaImageHeights.length);
        const thetaStart = thetaLength * colIndex

        const panoramaSectionHeight = panoramaHeight * panoramaImageHeights[rowIndex] / imageHeightSum;
        const panoramaSectionY = panoramaHeight * (panoramaImageHeights.slice(rowIndex + 1, panoramaImageHeights.length + 1).reduce((s, h) => s + h, 0) / imageHeightSum)

        const panoramaGeom = new THREE.CylinderGeometry( panoramaRadius, panoramaRadius, panoramaSectionHeight, 60, 1, true, thetaStart, thetaLength);
        const panoramaMat = new THREE.MeshBasicMaterial( { map: texture } );
        const panorama = new THREE.Mesh( panoramaGeom, panoramaMat );

        panorama.geometry.scale(-1, -1, -1)
        panorama.geometry.rotateZ(Math.PI)
        panorama.geometry.translate(0, panoramaSectionHeight / 2 + panoramaY + panoramaSectionY, 0);
        scene.add( panorama );
        loadedTextureCallback();
      }, () => {
      }, () => {
        loadingTextureFailedCallback()
      });
    })
  }
}