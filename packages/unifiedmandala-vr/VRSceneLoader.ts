export class VRSceneLoader {
  load(url: string): Promise<string> {
    return Promise.resolve(`loaded:${url}`);
  }
}
