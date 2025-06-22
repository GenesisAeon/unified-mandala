import { RegionArchive } from './region-archive-service';
import { generateReflection } from './reflection-engine';
import { HabitWeaver } from './adaptation-service';
import { computeMetrics } from './relationship-meter';

export class MemoryMesh {
  private archive: RegionArchive;
  private habits: HabitWeaver;

  constructor(archive = new RegionArchive(), habits = new HabitWeaver()) {
    this.archive = archive;
    this.habits = habits;
  }

  process(region: string, message: string) {
    this.archive.log(region, message);
    this.habits.observe('message');
    const reflection = generateReflection(message);
    const metrics = computeMetrics(this.archive.list(region));
    return { reflection, metrics };
  }

  getHabits() {
    return this.habits.getHabits();
  }

  history(region: string) {
    return this.archive.list(region);
  }
}
