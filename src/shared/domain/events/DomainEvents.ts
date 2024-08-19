import { AggregateRoot } from '../AggregateRoot';
import { UniqueEntityID } from '../UniqueEntityID';
import { DomainEvent } from './DomainEvent';

type EventHandler = (event: DomainEvent) => void;

type HandlerMap = { [key: string]: Array<EventHandler> };

export class DomainEvents {
  private static handlersMap: HandlerMap = {};
  private static markedAggregates: AggregateRoot<unknown>[] = [];

  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>): void {
    const isAggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!isAggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>): void {
    aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event));
  }

  private static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<unknown>): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));
    this.markedAggregates.splice(index, 1);
  }

  private static findMarkedAggregateByID(id: UniqueEntityID): AggregateRoot<unknown> | null {
    const found = this.markedAggregates.find((aggregate) => aggregate.id.equals(id)) || null;
    return found;
  }

  public static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  public static register(callback: (event: DomainEvent) => void, eventClassName: string): void {
    if (!Object.hasOwn(this.handlersMap, eventClassName)) {
      this.handlersMap[eventClassName] = [];
    }

    this.handlersMap[eventClassName].push(callback);
  }

  public static clearHandlers(): void {
    this.handlersMap = {};
  }

  public static clearMarkedAggregates(): void {
    this.markedAggregates = [];
  }

  private static dispatch(domainEvent: DomainEvent): void {
    const eventClassName: string = domainEvent.constructor.name;

    if (Object.hasOwn(this.handlersMap, eventClassName)) {
      const handlers: EventHandler[] = this.handlersMap[eventClassName];
      handlers.forEach((handler) => {
        handler(domainEvent);
      });
    }
  }

  static getHandlers(): HandlerMap {
    return this.handlersMap;
  }

  static getHandler(eventClassName: string): EventHandler[] {
    return this.handlersMap[eventClassName];
  }

  static getMarkedAggregates(): AggregateRoot<unknown>[] {
    return this.markedAggregates;
  }
}
