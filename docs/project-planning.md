# How to Plan a New Project

## Imperative Design

Imperative design comes from the **MVC (Model-View-Controller)** architecture, which breaks a web app into three parts:

```
Model (Database)  +  Controller (API)  +  View (Front-end)
```

The idea is simple: **pick one part and start there**, then build the rest around it.

| Approach           | Where you start                        |
| ------------------ | -------------------------------------- |
| **Database-first** | Design the database schema first       |
| **UI-first**       | Build the screens and wireframes first |
| **API-first**      | Define all the API endpoints first     |

### When to use it

Good fit for **simple CRUD apps** where the main job is reading and writing data:

- Admin dashboards
- Todo apps
- Basic weather apps
- Hobbyist or side projects

### When to avoid it

Imperative design starts to break down when:

- The project is **large**
- There is complex **business logic** (beyond basic CRUD)
- Multiple **teams** are working on the same codebase
- You need to **learn the domain** from domain experts first

In these cases, business rules tend to end up scattered across the codebase, making the project harder to maintain as it grows.

---

## Use-Case Driven Design

Use-case driven design is a way to document the **functional requirements** of a system before writing any code. Instead of thinking about the tech stack first, you think about _what the system needs to do_.

### Core Concepts

**Actor** — a role that interacts with the system (a user type, or an external system).

**Use case** — a single action an actor can perform within the system.

An app is considered complete when all agreed-upon use cases are built and working.

### Commands vs Queries

Every use case is either a **command** or a **query** — never both:

- **Command** — changes state (e.g. `createPost`, `makePurchase`)
- **Query** — reads data (e.g. `getPostById`, `getOrders`)

This separation keeps each use case focused and simple.

### Documenting Business Logic with Given-When-Then

Use **Given-When-Then** to document how the system should behave in different scenarios:

- **Given** — the precondition (what is true before the action)
- **When** — the action taken
- **Then** — the expected outcome

This is detailed enough to translate directly into unit tests.

### Steps to Apply Use-Case Driven Design

**1. Identify the actors**
Who needs to use the system? Define them by their _role_, not just "User".
Role matters because it determines responsibility. Different roles have different use cases, even within the same system.

**2. Understand their goals**
What is each actor trying to achieve? This helps scope the system.

**3. Identify the systems needed**
What needs to be built to help the actors reach their goals?

**4. List all use cases per actor**
For each actor in each system, list every action they need to perform. Label each as a command or query.

### Separating Actors by Subdomain

As you list actors and use cases, patterns will emerge. Group them by **subdomain** to keep things organized.

For example, a forum app might have:

| Subdomain                  | Actor               | Example Use Cases                              |
| -------------------------- | ------------------- | ---------------------------------------------- |
| Users (generic)            | `User`              | `register`, `login`, `logout`                  |
| Forum (core)               | `Member`, `Visitor` | `createPost`, `getPopularPosts`, `postComment` |
| Notifications (supporting) | `Member`            | `getNotifications`                             |

Grouping by subdomain helps you:

- See the boundaries of each part of the system
- Assign the right use cases to the right actors
- Keep diagrams and documents readable

### Connection to API-First Design

API-first design is essentially use-case driven design in disguise — each API endpoint maps to a use case. The difference is that use-case driven design is more explicit about actors, goals, and business logic documentation (e.g. Given-When-Then).

---

## Event Storming

A collaborative modeling workshop where developers and domain experts get together to map out a business domain using sticky notes on a wall or whiteboard.

Invented by **Alberto Brandolini** — originally as an improvisation when he didn't have enough time for a full UML session.

The big value here is alignment. Everyone — technical and non-technical — walks out of the room with the same picture of how the system works.

### Why bother?

Developers don't understand the business as well as the people who work in it every day. When developers design in isolation, they fill in the gaps with assumptions — and those assumptions often turn out to be wrong.

Even worse, different developers end up with different mental models. The codebase starts to reflect several different interpretations of the same domain, which makes it unreliable and hard to maintain.

Event Storming closes that gap by getting everyone in the same room with a shared language.

### The steps

- **Step 0 — Legend** — Define all sticky note types and their colors before starting.
- **Step 1 — Domain Events 🟠** — List everything that _happens_ in the business on orange stickies, left to right in chronological order. Use past tense: `PostCreated`, `UserRegistered`.
- **Step 2 — Commands 🔵** — For each event, add a blue sticky to its left for the command that caused it. Also note the Actor who triggered it: `CreatePost → PostCreated`.
- **Step 3 — Aggregates 🟡** — Place a pale yellow sticky between each Command/Event pair to identify the Aggregate being acted on: `CreatePost → Post → PostCreated`.
- **Step 4 — Boundaries** — Group related stickies into subdomains and bounded contexts. This is the hardest step — apply Conway's Law.
- **Step 5 — Views & Roles** — For each command, identify what the user needs to see (View) and who performs the action (Role).
- **Step 6 (Optional) — Rules & Policies 🔵** — Use neon blue stickies to document preconditions for each command. These become Given-When-Then acceptance tests later.

### What you have at the end

- A timeline of everything that can happen in the system
- Every command that drives those events, with the actors behind them
- The aggregates that handle each command
- A clear map of subdomain and bounded context boundaries
- The views and roles tied to each use case
