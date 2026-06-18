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

> 🚧 Notes coming soon.
