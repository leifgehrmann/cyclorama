export interface ControlState {
  sagittal: number; // forwards-backward
  frontal: number; // crab-walk, left-right
  yaw: number; // turning left-right
  pitch: number; // looking up-down
  zoom: number; // zoom in-out
}