export class Lives {
  count: number;
  maxLives: number;

  constructor(initialLives: number) {
    this.count = initialLives;
    this.maxLives = initialLives;
  }

  loseLife() {
    if (this.count > 0) {
      this.count--;
    }
  }

  gainLife() {
    this.count++;
  }

  isEmpty(): boolean {
    return this.count <= 0;
  }

  reset(lives: number) {
    this.count = lives;
    this.maxLives = lives;
  }

  clone(): Lives {
    const l = new Lives(this.maxLives);
    l.count = this.count;
    return l;
  }
}
