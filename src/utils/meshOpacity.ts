import * as THREE from "three";

export function setOpacity( obj: THREE.Group | THREE.Mesh, opacity: number ) {
  if (obj.children) {
    obj.children.forEach((child: THREE.Object3D): void => {
      setOpacity(child, opacity);
    });
  }
  if ( obj.material ) {
    obj.material.opacity = opacity;
  }
}