import * as THREE from 'three';
import {setOpacity} from "../utils/meshOpacity.ts";
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

export default class Person {
  private group: THREE.Group;
  private svgUrl: string;
  private svgHeight: number;
  private svgScale: number;
  private opacity: number;

  constructor(
    svgUrl: string,
    svgHeight: number,
    svgScale: number = 0.01, // 1px = 1cm,
  ) {
    this.group = new THREE.Group();
    this.svgUrl = svgUrl;
    this.svgHeight = svgHeight;
    this.svgScale = svgScale;
    this.opacity = 1;
  }

  addToScene(
    scene: THREE.Scene,
    loadedTextureCallback: () => void
  ): void {
    const loader = new SVGLoader();
    loader.load( this.svgUrl, ( data ) => {
      this.group.scale.multiplyScalar( this.svgScale );
      this.group.position.y = this.svgHeight;
      this.group.rotation.y = Math.PI;
      this.group.scale.y *= - 1;

      let renderOrder = 0;

      for ( const path of data.paths ) {

        const fillColor = path.userData.style.fill;

        if ( fillColor !== undefined && fillColor !== 'none' ) {

          const material = new THREE.MeshBasicMaterial( {
            color: new THREE.Color().setStyle( fillColor ),
            opacity: path.userData.style.fillOpacity,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
          } );

          const shapes = SVGLoader.createShapes( path );

          for ( const shape of shapes ) {

            const geometry = new THREE.ShapeGeometry( shape );
            const mesh = new THREE.Mesh( geometry, material );
            mesh.renderOrder = renderOrder ++;

            this.group.add( mesh );

          }

        }

        const strokeColor = path.userData.style.stroke;

        if ( strokeColor !== undefined && strokeColor !== 'none' ) {

          const material = new THREE.MeshBasicMaterial( {
            color: new THREE.Color().setStyle( strokeColor ),
            opacity: path.userData.style.strokeOpacity,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
          } );

          for ( const subPath of path.subPaths ) {

            const geometry = SVGLoader.pointsToStroke( subPath.getPoints(), path.userData.style );

            if ( geometry ) {

              const mesh = new THREE.Mesh( geometry, material );
              mesh.renderOrder = renderOrder ++;

              this.group.add( mesh );

            }

          }

        }

      }

      scene.add( this.group );
      loadedTextureCallback()
    });
  }

  getPosition(): {x: number, y: number, z: number} {
    return {
      x: this.group.position.x,
      y: this.group.position.y - this.svgHeight,
      z: this.group.position.z,
    }
  }

  setPosition(x: number, y: number, z: number): void {
    this.group.position.x = x;
    this.group.position.y = y + this.svgHeight;
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