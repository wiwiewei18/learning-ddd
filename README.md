# Domain-Driven Design (DDD)

From my learning, Domain-Driven Design (DDD) is primarily about reducing the communication gap between software engineers and domain experts.

Instead of designing software around technical concerns such as databases, frameworks, or APIs, DDD encourages developers to focus on the business domain and model real-world business concepts directly in the code.

The goal is to create a domain model that is rich in business knowledge and terminology. To achieve this, the domain layer should remain independent of external dependencies so that business rules can be expressed clearly and evolve without being affected by infrastructure changes.

To protect this domain model, DDD is often combined with Clean Architecture. Clean Architecture helps keep the domain layer isolated from frameworks, databases, and other technical concerns, ensuring that business logic remains the core of the system.

## DDD Building Blocks

The main building blocks commonly used in DDD are:

- **[Entity](docs/ddd-building-blocks.md#entity)** – Objects with a unique identity.
- **[Value Object](docs/ddd-building-blocks.md#value-object)** – Objects defined by their values rather than identity.
- **[Aggregate](docs/ddd-building-blocks.md#aggregate)** – A consistency boundary that groups related entities and value objects.
- **[Domain Service](docs/ddd-building-blocks.md#domain-service)** – Domain logic that does not naturally belong to a single entity.
- **[Repository](docs/ddd-building-blocks.md#repository)** – An abstraction for retrieving and persisting domain objects.
- **[Factory](docs/ddd-building-blocks.md#factory)** – Responsible for creating complex domain objects.
- **[Domain Event](docs/ddd-building-blocks.md#domain-event)** – Represents significant events that occur within the domain.
- **[Subdomain](docs/ddd-building-blocks.md#subdomain)** – Logical divisions of the business domain
- **[Bounded Context](docs/ddd-building-blocks.md#bounded-context)** – A boundary within which a particular domain model and terminology are valid.

## Project Planning

How to approach planning a new project before writing code:

- **[How to Plan a New Project](docs/project-planning.md)** – Imperative design (Database-first, UI-first, API-first) vs Declarative design (Use-Case Driven Design, Event Storming).
