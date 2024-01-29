export interface ControlState {
  sagittalAcc: number; // forwards-backward (acceleration)
  frontalAcc: number; // crab-walk, left-right (acceleration)
  yawAcc: number; // turning left-right (acceleration)
  pitchAcc: number; // looking up-down (acceleration)
  yawVel: number | null; // turning left-right (velocity)
  pitchVel: number | null; // looking up-down (velocity)
  zoomAcc: number; // zoom in-out (acceleration)
  heightAcc: number;
  rollAcc: number;
  boundaryBreak: boolean;
}