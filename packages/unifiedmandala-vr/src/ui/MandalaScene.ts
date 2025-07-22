import * as THREE from 'three';
import { AvatarManager } from '../core/AvatarManager';

export class MandalaScene {
  private scene = new THREE.Scene();
  private avatarManager = new AvatarManager();

  setupEnvironment() {
    const geometry = new THREE.CircleGeometry(50, 64);
    const material = new THREE.MeshStandardMaterial({ color: '#121212' });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);
  }

  update() {
    this.avatarManager.getAvatars().forEach(() => {
      // future avatar updates
    });
  }

  getScene(): THREE.Scene {
    return this.scene;
  }
}
