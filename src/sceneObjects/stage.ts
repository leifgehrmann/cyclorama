import * as THREE from 'three';

export default class Stage {
  private objects: THREE.Mesh[];
  constructor(
    stageRadius: number,
    stageHeight: number,
    umbrellaRadius: number,
    ceilingHeight: number,
    railingHeight: number,
    railingCount: number,
    railingRadius: number,
    railingOnStageRadius: number,
  ) {
    this.objects = [];

    const stageGeom = new THREE.CylinderGeometry( stageRadius, stageRadius, stageHeight, 60, 1, false);
    const stageMat = new THREE.MeshBasicMaterial( { color: 0x333343 } );
    const stage = new THREE.Mesh( stageGeom, stageMat );
    stage.translateY(stageHeight/2);
    this.objects.push(stage);

    const umbrellaGeom = new THREE.CylinderGeometry( umbrellaRadius, umbrellaRadius, 0.1, 60, 1, false);
    const umbrellaMat = new THREE.MeshBasicMaterial( { color: 0x333343 } );
    const umbrella = new THREE.Mesh( umbrellaGeom, umbrellaMat );
    umbrella.translateY(stageHeight + ceilingHeight)
    this.objects.push(umbrella);

    const railingGeom = new THREE.TorusGeometry( railingOnStageRadius, railingRadius, 16, 100 );
    const railingMat = new THREE.MeshBasicMaterial( { color: 0x222232 } );
    const railing = new THREE.Mesh( railingGeom, railingMat );
    railing.translateY(stageHeight + railingHeight)
    railing.rotateX(Math.PI/2);
    this.objects.push(railing);

    for (let i = 0; i < railingCount; i++) {
      const theta = i / railingCount * Math.PI * 2;
      const railingPostX = Math.sin(theta) * (railingOnStageRadius);
      const railingPostZ = Math.cos(theta) * (railingOnStageRadius);
      const railingPostGeom = new THREE.CylinderGeometry( railingRadius, railingRadius, railingHeight, 16, 1, false);
      const railingPostMat = new THREE.MeshBasicMaterial( { color: 0x222232 } );
      const railingPost = new THREE.Mesh( railingPostGeom, railingPostMat );
      railingPost.translateX(railingPostX)
      railingPost.translateZ(railingPostZ)
      railingPost.translateY(stageHeight + railingHeight/2)
      this.objects.push(railingPost);
    }

    const plankWidth = 0.2;
    for (let i = -stageRadius; i <= stageRadius; i+= plankWidth) {
      const zDistance = Math.sqrt(stageRadius * stageRadius - i * i);
      const points = [];
      points.push( new THREE.Vector3( i, stageHeight+0.001, -zDistance ) );
      points.push( new THREE.Vector3( i, stageHeight+0.001, zDistance ) );

      const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
      const geometry = new THREE.BufferGeometry().setFromPoints( points );
      const line = new THREE.Line( geometry, material );
      line.material.transparent = true;
      line.material.opacity = 0.05;
      this.objects.push(line);
    }
  }

  addToScene(scene: THREE.Scene): void {
    this.objects.map((object) => {
      scene.add(object);
    })
  }
}