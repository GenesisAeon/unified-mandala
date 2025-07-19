export class VRHapticFeedbackSystem {
  trigger(intensity: number): string {
    return `haptic:${intensity}`;
  }
}
