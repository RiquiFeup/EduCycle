# EduCycle Development Report

Welcome to the documentation of **EduCycle**!

This Software Development Report, tailored for LEIC-ES-2025-26, provides comprehensive details about EduCycle, starting from a high-level vision and going into low-level implementation decisions.

It is organised by the following activities:

- [Business Modelling](#Business-Modelling)
  - [Product Vision](#Product-Vision)
  - [Features and Assumptions](#Features-and-Assumptions)
- [Requirements](#Requirements)
  - [User Stories](#User-Stories)
  - [Domain Model](#Domain-Model)
  - [User Interfaces](#User-Interfaces)
- [Architecture and Design](#Architecture-and-Design)
  - [Logical Architecture](#Logical-Architecture)
  - [Physical Architecture](#Physical-Architecture)
  - [Functional Prototype](#Functional-Prototype)
- [Project Management](#Project-Management)
  - [Sprint 0](#Sprint-0)
  - [Sprint 1](#Sprint-1)
  - [Sprint 2](#Sprint-2)
  - [Sprint 3](#Sprint-3)
  - [Final Release](#Final-Release)

Contributions are expected to be made exclusively by the initial team, but we may open them to the community, after the course, in all areas and topics: requirements, technologies, development, experimentation, testing, etc.

Please contact us!

Thank you!

- team member name and email
- team member name and email
- team member name and email
- team member name and email
- team member name and email

---

## Business Modelling

### Product Vision

> _"To make access to school supplies fairer, more affordable, and sustainable for all students."_

**For students, families and educators who need affordable school and academic materials, EduCycle is a peer-to-peer marketplace that allows users to buy, sell, trade and lend used educational items — unlike general second-hand platforms, EduCycle is built exclusively for the academic journey, organised by school level, discipline and institution.**

---

### Features and Assumptions

#### Features

- **Feature SELL** — List any used school or academic item for sale, individually or as a pack, with photos, condition rating and price.
- **Feature TRADE** — Propose a direct item-for-item trade with another user, without any monetary exchange.
- **Feature LEND** — Make an item available for a defined loan period, so other students can use it temporarily.
- **Feature SCHOOL LEVELS** — Browse and filter all listings by education level: Escola Básica (1st–9th), Escola Secundária (10th–12th), or Faculdade / Ensino Superior.
- **Feature ORGANISATIONS** — Create or join private community spaces tied to a specific school or institution, accessible via invite code.
- **Feature CHAT** — Send direct messages between buyer and seller to negotiate, clarify details or arrange delivery.
- **Feature WISHLIST** — Save desired items and receive automatic alerts when a matching listing becomes available.
- **Feature PACKS & DISCOUNTS** — Group multiple items into a single listing with a bundled price, or apply percentage discounts to individual listings.
- **Feature FILTERS & SEARCH** — Search by title, ISBN, author or subject; filter by level, year, subject, condition, price range, location and transaction mode.
- **Feature PAYMENTS & ESCROW** — Secure integrated payments (card, MB Way, Multibanco reference) held in escrow until delivery is confirmed.
- **Feature RATINGS & REVIEWS** — Rate and review the other party after each completed transaction to build trust in the community.
- **Feature SUPPORT CHAT** — Contact the EduCycle support team directly from within the app.
- **Feature SHIPPING** — Generate pre-paid shipping labels and track deliveries natively in the app.

#### Assumptions

- Users are assumed to have a smartphone or web browser and a valid email address to register.
- Payment processing depends on integration with a third-party payment provider (e.g. Stripe or similar).
- Shipping label generation depends on integration with carrier APIs (e.g. CTT, DPD).
- Organisation administrators are responsible for managing their own community spaces; EduCycle provides the tooling.
- The platform assumes good faith from its users, supported by the escrow system, ratings and moderation tools.

---

## Requirements

### User Stories

Below is a concise summary of all user stories for EduCycle, grouped by area. Each user story is created and tracked as an item in the GitHub Project with the label **"user story"**.

---

* **User Registration (Account)**
  > **As a** student, **I want to** create an account using my email, **so that** I can have a verified identity on the platform.

* **Publishing a Listing (Issuing)**
  > **As a** seller, **I want to** create a listing with a photo, title, and price, **so that** I can put my school materials up for sale or swap.

* **Browsing Materials (Discovery)**
  > **As a** buyer, **I want to** browse a feed of recently added items, **so that** I can discover school materials I might need.

* **Advanced Search & Filters (Discovery)**
  > **As a** buyer, **I want to** search for specific keywords and filter by academic year, **so that** I can quickly find the exact study materials I need.

* **Chat & Negotiation (Transactions)**
  > **As a** user, **I want to** send direct messages to other users, **so that** I can easily negotiate prices and arrange safe deliveries.

---

### Domain Model

<!--
UML class diagram with key domain concepts and relationships.
Key entities: User, Listing, Transaction, Chat, Message, Organisation, Review, Wishlist, Pack, Shipment.

<p align="center">
  <img src="images/DomainModel.png"/>
</p>
-->

_Domain model diagram to be added._

---

### User Interfaces

<!-- Mockups and UI drafts to be added per user story. -->

_User interface mockups to be added._

---

## Architecture and Design

### Logical Architecture

<!--
UML package diagram showing the logical view of the system.
Suggested layers:
- Presentation Layer (Flutter UI)
- Application/Business Logic Layer (use cases, state management)
- Data Layer (repositories, local cache)
- External Services (Payment API, Shipping API, Firebase)

<p align="center">
  <img src="images/LogicalArchitecture.png"/>
</p>
-->

_Logical architecture diagram to be added._

---

### Physical Architecture

<!--
UML deployment diagram showing nodes, artifacts and connections.
Suggested nodes:
- User Device (Flutter mobile/web app)
- Backend Server (REST API)
- Database (PostgreSQL / Firebase Firestore)
- External: Payment Gateway, Shipping API, Push Notification Service

<p align="center">
  <img src="images/PhysicalArchitecture.png"/>
</p>
-->

_Physical architecture diagram to be added._

**Technology choices:**

- **Frontend:** Flutter (cross-platform mobile and web)
- **Backend:** Node.js / Firebase Functions
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Payments:** Stripe or similar
- **Notifications:** Firebase Cloud Messaging (FCM)
- **Shipping:** CTT / DPD API integration

---

### Functional Prototype

<!-- Description and screenshot of the initial thin vertical slice implemented. -->

_Functional prototype to be added after initial implementation sprint._

---

## Project Management

- Backlog management: Product backlog and Sprint backlog in a [GitHub Projects board](#)
- Release management: v0, v1, v2, v3, ...
- Sprint planning and retrospectives:
  - Plans: screenshots of GitHub Projects board at beginning and end of each Sprint
  - Retrospectives: meeting notes addressing — _Did well_, _Do differently_, _Puzzles_, _Improvements for next Sprint_

---

### Sprint 0

_Sprint 0 plan and retrospective to be added._

---

### Sprint 1

_Sprint 1 plan and retrospective to be added._

---

### Sprint 2

_Sprint 2 plan and retrospective to be added._

---

### Sprint 3

_Sprint 3 plan and retrospective to be added._

---

### Sprint 4

_Sprint 4 plan and retrospective to be added._

---

### Final Release

_Final release notes and retrospective to be added._
