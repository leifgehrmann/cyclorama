export interface ControlState {
  sagittal: number; // forwards-backward
  frontal: number; // crab-walk, left-right
  yaw: number; // turning left-right
  pitch: number; // looking up-down
  yawOverride: number | null;
  yawVelOverride: number | null;
  pitchOverride: number | null;
  pitchVelOverride: number | null;
  zoom: number; // zoom in-out
}