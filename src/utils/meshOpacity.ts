import * as THREE from "three";

export function setOpacity( obj: THREE.Group | THREE.Mesh | THREE.Object3D, opacity: number ) {
  if ((obj as THREE.Group).children) {
    (obj as THREE.Group).children.forEach((child: THREE.Object3D): void => {
      setOpacity(child, opacity);
    });
  }
  if ( (obj as THREE.Mesh).material ) {
    ((obj as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = opacity;
  }
}