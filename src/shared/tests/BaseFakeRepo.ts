export abstract class BaseFakeRepo<T> {
  protected _items: T[];

  constructor() {
    this._items = [];
  }

  public addFakeItem(t: T): void {
    const isFound = this._items.some((item) => this.compareFakeItems(item, t));
    if (!isFound) {
      this._items.push(t);
    }
  }

  public removeFakeItem(t: T): void {
    this._items = this._items.filter((item) => !this.compareFakeItems(item, t));
  }

  public getItems(): T[] {
    return this._items;
  }

  abstract compareFakeItems(a: T, b: T): boolean;
}
