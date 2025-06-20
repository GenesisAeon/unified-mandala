export class BewusstseinsResonanzComparator {
  compare(bewusstsein: number, resonanz: number): string {
    if (resonanz > bewusstsein) {
      return 'Resonanz übersteigt Bewusstsein';
    }
    if (resonanz < bewusstsein) {
      return 'Bewusstsein über Resonanz';
    }
    return 'Resonanz und Bewusstsein im Gleichgewicht';
  }
}
