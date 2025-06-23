export class HapticService {
  static async trigger(pattern: string): Promise<void> {
    // stub for web BLE or vibration API
    console.log(`Haptic trigger: ${pattern}`);
  }
}
