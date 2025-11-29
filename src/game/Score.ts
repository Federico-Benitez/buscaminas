export class Score {
  value: number;

  constructor(initialScore: number = 0) {
    this.value = initialScore;
  }

  add(points: number) {
    this.value += points;
  }

  reset() {
    this.value = 0;
  }

  clone(): Score {
    return new Score(this.value);
  }
}
