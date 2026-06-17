# DDD Building Blocks

## Entity

An Entity is a domain object that has a unique identity and can change over time. Even if some of its attributes change, it is still considered the same object as long as its identity remains the same. Examples include User, Customer, Order, or Product. Entities are responsible for enforcing business rules that are directly related to themselves and their lifecycle. In DDD, we usually compare entities by their identity rather than by the values of their attributes.

## Value Object

A Value Object is an object that is defined entirely by its attributes and has no identity of its own. If two value objects contain the same values, they are considered equal. Examples include Email, Address, Money, PhoneNumber, or ProductName. Value Objects help make the domain model more expressive and safer by encapsulating validation and business rules related to a specific concept. They are typically immutable, meaning they cannot be modified after creation.

## Aggregate

An Aggregate is a cluster of related domain objects that are treated as a single consistency boundary. Every Aggregate has an Aggregate Root, which acts as the entry point for interacting with objects inside the Aggregate. External code should only communicate with the Aggregate Root and never directly modify internal entities. This allows the Aggregate to enforce business invariants and maintain consistency throughout a transaction. Examples include an Order Aggregate containing OrderItems or a Bank Account Aggregate containing Transactions.

## Domain Service

A Domain Service contains domain logic that does not naturally belong to a specific Entity or Value Object. Sometimes a business operation requires collaboration between multiple domain objects, and forcing that logic into a single Entity would make the model unnatural. In such cases, the behavior is placed inside a Domain Service. Examples include calculating shipping costs, transferring money between accounts, or matching buyers and sellers in a marketplace. Domain Services should focus purely on business logic and remain independent of infrastructure concerns.

## Repository

A Repository provides an abstraction for accessing and persisting Aggregates. Instead of allowing the domain layer to communicate directly with databases or external storage systems, Repositories provide a collection-like interface for retrieving and saving domain objects. This separation allows the domain model to remain independent from database technology. For example, an application can switch from MySQL to PostgreSQL or even an in-memory implementation without affecting the domain logic.

## Factory

A Factory is responsible for creating complex domain objects. As a system grows, object creation often requires validation, initialization of multiple Value Objects, or enforcement of business rules. Rather than spreading this logic throughout the codebase, a Factory centralizes the creation process and ensures that every object is created in a valid state. Factories help keep constructors simple and prevent invalid domain objects from being instantiated.

## Domain Event

A Domain Event represents something significant that has happened within the domain and that the business cares about. Examples include OrderPlaced, PaymentCompleted, ProductReserved, or MemberRegistered. Domain Events allow different parts of the system to react to business events without creating tight coupling between components. Instead of directly calling multiple services from one place, an Aggregate can publish a Domain Event and allow interested components to handle their responsibilities independently. This approach improves scalability, maintainability, and separation of concerns.

## Subdomain

A Subdomain is a logical division of the overall business problem space. Large businesses often deal with many different concerns, and DDD encourages separating them into smaller areas of responsibility. Examples in an e-commerce system might include Catalog, Orders, Payments, Shipping, and Notifications. Subdomains help teams understand the business more clearly and prevent unrelated concepts from becoming mixed together.

## Core Subdomain

The Core Subdomain contains the business capabilities that provide the organization's competitive advantage. It is the most valuable and strategically important part of the system. This is typically where the company invests the most effort because it contains unique business knowledge that cannot easily be purchased or outsourced.

## Supporting Subdomain

Supporting Subdomains are important to the business but do not provide direct competitive differentiation. They often contain business-specific functionality that still needs to be developed internally because off-the-shelf solutions are not sufficient. Examples might include custom inventory management or specialized shipping workflows.

## Generic Subdomain

Generic Subdomains solve common problems that many organizations face and are often available as commercial products or external services. Examples include authentication, billing, notifications, or email delivery. Since these areas rarely provide strategic advantage, organizations often choose to buy or integrate existing solutions rather than build them from scratch.

## Bounded Context

A Bounded Context defines the boundary within which a specific domain model and language are valid. The same business term can have different meanings in different parts of an organization, and a Bounded Context prevents those meanings from conflicting. For example, the concept of a "Customer" may represent a payer in a Billing context but a recipient in a Shipping context. By clearly defining boundaries, teams can create models that accurately represent their business area without being influenced by unrelated concerns from other contexts.
