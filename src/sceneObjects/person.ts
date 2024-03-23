import * as THREE from 'three';
import {setOpacity} from "../utils/meshOpacity.ts";

export default class Person {
  private group: THREE.Group;
  private textureUrl: string;
  private textureWidth: number;
  private textureHeight: number;
  private scale: number;
  private opacity: number;

  constructor(
    textureUrl: string,
    textureWidth: number,
    textureHeight: number,
    textureScale: number = 0.01, // 1px = 1cm,
  ) {
    this.group = new THREE.Group();
    this.textureUrl = textureUrl;
    this.textureWidth = textureWidth;
    this.textureHeight = textureHeight;
    this.scale = textureScale;
    this.opacity = 1;
  }

  addToScene(
    scene: THREE.Scene,
    loadedTextureCallback: () => void,
    loadingTextureFailedCallback: () => void
  ): void {
    new THREE.TextureLoader().load(this.textureUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshBasicMaterial( { map: texture, transparent: true, alphaTest: 0.01, side: THREE.DoubleSide } );
      const geom = new THREE.PlaneGeometry(
        this.textureWidth * this.scale,
        this.textureHeight * this.scale,
      );
      const mesh = new THREE.Mesh( geom, mat );
      this.group.add(mesh);
      scene.add(this.group);
      loadedTextureCallback()
    }, () => {
    }, () => {
      loadingTextureFailedCallback()
    });
  }

  getPosition(): {x: number, y: number, z: number} {
    return {
      x: this.group.position.x,
      y: this.group.position.y - this.textureHeight / 2 * this.scale,
      z: this.group.position.z,
    }
  }

  setPosition(x: number, y: number, z: number): void {
    this.group.position.x = x;
    this.group.position.y = y + this.textureHeight / 2 * this.scale;
    this.group.position.z = z;
  }

  setRotation(value: number): void {
    this.group.rotation.y = value;
  }

  getOpacity(): number {
    return this.opacity;
  }

  setOpacity(value: number): void {
    if (value === this.opacity) {
      return;
    }
    this.opacity = value;
    setOpacity(this.group, value);
    this.group.visible = value !== 0;
  }
}