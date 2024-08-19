import { WatchedList } from './WatchedList';

class TestWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b;
  }
}

describe('WatchedList', () => {
  let watchedList: TestWatchedList;

  beforeEach(() => {
    watchedList = new TestWatchedList([1, 2, 3]);
  });

  it('should initialize with the correct items', () => {
    expect(watchedList.getItems()).toEqual([1, 2, 3]);
  });

  it('should add a new item', () => {
    watchedList.add(4);
    expect(watchedList.getItems()).toEqual([1, 2, 3, 4]);
    expect(watchedList.getNewItems()).toEqual([4]);
  });

  it('should not add an existing item', () => {
    watchedList.add(2);
    expect(watchedList.getItems()).toEqual([1, 2, 3]);
    expect(watchedList.getNewItems()).toEqual([]);
  });

  it('should not add an item that was added initially', () => {
    watchedList = new TestWatchedList([1, 2, 3]);
    watchedList.add(1);
    expect(watchedList.getItems()).toEqual([1, 2, 3]);
    expect(watchedList.getNewItems()).toEqual([]);
  });

  it('should remove an existing item', () => {
    watchedList.remove(2);
    expect(watchedList.getItems()).toEqual([1, 3]);
    expect(watchedList.getRemovedItems()).toEqual([2]);
  });

  it('should not remove a non-existing item', () => {
    watchedList.remove(4);

    expect(watchedList.getItems()).toEqual([1, 2, 3]);
    expect(watchedList.getRemovedItems()).toEqual([]);
  });
});
