export interface VRObject {
  id: string;
  type: string;
  position: { x: number; y: number; z: number };
}

export class VirtualSpace {
  private objects: VRObject[] = [];

  addObject(obj: VRObject) {
    this.objects.push(obj);
  }

  getObjects(): VRObject[] {
    return this.objects;
  }
}
