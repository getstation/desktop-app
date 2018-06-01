export abstract class Consumer {
  public abstract readonly namespace: string;
  public readonly id: string;

  protected constructor(id: string) {
    this.id = id;
  }
}
