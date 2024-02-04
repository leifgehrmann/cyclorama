import * as THREE from 'three';

export function getAngularDifferenceFromPointers(
  camera: THREE.Camera,
  pointerStart: Touch | MouseEvent,
  pointerEnd: Touch | MouseEvent,
  interactiveBlock: HTMLDivElement,
): {yaw: number, pitch: number} {
  const raycaster = new THREE.Raycaster();
  const coords = new THREE.Vector2();
  const { width, height } = interactiveBlock.getBoundingClientRect();

  coords.x = ( pointerStart.clientX / width ) * 2 - 1;
  coords.y = - ( pointerStart.clientY / height ) * 2 + 1;
  raycaster.setFromCamera( coords, camera );
  const directionStart = raycaster.ray.direction.clone();

  coords.x = ( pointerEnd.clientX / width ) * 2 - 1;
  coords.y = - ( pointerEnd.clientY / height ) * 2 + 1;
  raycaster.setFromCamera( coords, camera );
  const directionEnd = raycaster.ray.direction.clone();

  const yawEnd = Math.atan2(
    directionEnd.z,
    directionEnd.x
  )
  const yawStart = Math.atan2(
    directionStart.z,
    directionStart.x
  )
  const pitchEnd = Math.atan2(
    Math.hypot(directionEnd.x, directionEnd.z),
    directionEnd.y
  )
  const pitchStart = Math.atan2(
    Math.hypot(directionStart.x, directionStart.z),
    directionStart.y
  )
  return {
    yaw: Math.sign(pointerEnd.clientX - pointerStart.clientX) * (Math.PI - Math.abs(Math.abs(yawEnd-yawStart) - Math.PI)),
    pitch: Math.sign(pointerEnd.clientY - pointerStart.clientY) * (Math.PI - Math.abs(Math.abs(pitchEnd-pitchStart) - Math.PI)),
  }
}

export default function getTouchById(touches: TouchList, id: number): Touch | null {
  for (let i = 0; i < touches.length; i += 1) {
    if (touches[i].identifier === id) {
      return touches[i];
    }
  }
  return null;
}