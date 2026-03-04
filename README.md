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

#### 👤 Authentication & Profile

| ID    | User Story                                                                                                                             |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------- |
| US-01 | As a new user, I want to register with email or Google, so that I can access the platform quickly.                                     |
| US-02 | As a user, I want to set up my profile with name, photo, school level and institution, so that others can identify and trust me.       |
| US-03 | As a user, I want to view my transaction history (purchases, sales, trades), so that I have full visibility over my activity.          |
| US-04 | As a buyer, I want to view another user's public profile with ratings and active listings, so that I can decide whether to trust them. |

---

#### 🛍️ Listing & Publishing

| ID    | User Story                                                                                                                              |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------- |
| US-05 | As a seller, I want to create a listing with title, photos, description, condition and price, so that I can present my item clearly.    |
| US-06 | As a seller, I want to choose whether my listing is for sale, trade or loan, so that it appears in the correct section of the platform. |
| US-07 | As a seller, I want to select the school level and subject of my item, so that it reaches the right audience.                           |
| US-08 | As a seller, I want to create a pack bundling several items together, so that I can sell multiple things at once at a discounted price. |
| US-09 | As a seller, I want to apply a percentage discount to a listing, so that I attract more buyers and sell faster.                         |
| US-10 | As a seller, I want to edit or remove a listing at any time, so that I keep my listings accurate and up to date.                        |
| US-11 | As a seller, I want to be notified when someone shows interest in my item, so that I can respond quickly and not miss the sale.         |

---

#### 🔍 Search & Discovery

| ID    | User Story                                                                                                                                |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| US-12 | As a buyer, I want to search for items by title, ISBN, author or subject, so that I find exactly what I need quickly.                     |
| US-13 | As a buyer, I want to filter results by school level, year, subject, condition, price and location, so that I only see relevant listings. |
| US-14 | As a buyer, I want to filter by transaction mode (sale, trade or loan), so that I only see the type of offer I am looking for.            |
| US-15 | As a user, I want to sort results by price, recency or popularity, so that I can prioritise results according to my needs.                |
| US-16 | As a user, I want a personalised feed based on my profile and history, so that I discover relevant items without having to search.        |

---

#### ❤️ Wishlist & Alerts

| ID    | User Story                                                                                                                                |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| US-17 | As a buyer, I want to add items to my wishlist, so that I can save them for later.                                                        |
| US-18 | As a buyer, I want to be automatically notified when an item matching my wishlist becomes available, so that I never miss an opportunity. |
| US-19 | As a user, I want to follow a specific seller, so that I am notified whenever they publish a new listing.                                 |

---

#### 🔁 Trade & Loan

| ID    | User Story                                                                                                             |
| ----- | ---------------------------------------------------------------------------------------------------------------------- |
| US-20 | As a user, I want to propose a trade directly to another user via chat, so that we can exchange items without money.   |
| US-21 | As a user, I want to list an item for loan with a defined return date, so that another student can use it temporarily. |
| US-22 | As a borrower, I want to receive a reminder before the return date, so that I remember to return the item on time.     |

---

#### 💬 Communication

| ID    | User Story                                                                                                                                             |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| US-23 | As a buyer, I want to send a direct message to the seller before purchasing, so that I can clarify details about the item's condition or availability. |
| US-24 | As a user, I want to send images in the chat, so that I can share additional details or evidence about an item.                                        |
| US-25 | As a user, I want to receive real-time notifications for new messages, so that the conversation flows without delays.                                  |
| US-26 | As a user with a problem, I want to contact EduCycle support via chat, so that I can resolve issues without leaving the app.                           |

---

#### 💰 Payments & Transactions

| ID    | User Story                                                                                                                                            |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-27 | As a buyer, I want to pay securely by card, MB Way or Multibanco reference, so that I have flexibility in my payment method.                          |
| US-28 | As a buyer, I want my payment held in escrow until I confirm receipt, so that I am protected if something goes wrong.                                 |
| US-29 | As a seller, I want to receive the payment in my EduCycle wallet after delivery confirmation, so that I have assurance the transaction is complete.   |
| US-30 | As a seller, I want to withdraw my wallet balance to my bank account, so that I can access the money from my sales.                                   |
| US-31 | As a buyer, I want to use my EduCycle wallet credits to pay for purchases, so that I can spend earnings from previous sales directly on the platform. |

---

#### 📦 Logistics & Shipping

| ID    | User Story                                                                                                                                   |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| US-32 | As a seller, I want to generate a pre-paid shipping label from within the app, so that I don't have to handle shipping logistics manually.   |
| US-33 | As a buyer, I want to track my shipment directly in the app, so that I know exactly where my order is.                                       |
| US-34 | As a user, I want to arrange in-person handover via chat, so that I avoid shipping costs when both parties are nearby or at the same school. |

---

#### ⭐ Ratings & Trust

| ID    | User Story                                                                                                                                    |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| US-35 | As a buyer, I want to rate the seller and leave a review after receiving the item, so that other buyers know what to expect.                  |
| US-36 | As a seller, I want to rate the buyer after the transaction, so that the community knows they are a trustworthy user.                         |
| US-37 | As a user, I want to see the average rating and comments on another user's profile, so that I can make informed decisions before transacting. |
| US-38 | As a user, I want to verify my identity to receive a verified badge, so that others trust my listings and profile more.                       |

---

#### 🏫 Organisations & Communities

| ID    | User Story                                                                                                                                                        |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-39 | As a school administrator, I want to create a private community for my school on EduCycle, so that students can exchange materials in a safe and organised space. |
| US-40 | As a student, I want to join my school's community using an invite code, so that I can access listings from my peers.                                             |
| US-41 | As a community member, I want to publish a listing visible only within my organisation, so that I trade with people I know.                                       |
| US-42 | As an organisation manager, I want to moderate and remove inappropriate listings in my community, so that the space remains safe and relevant.                    |
| US-43 | As an organisation manager, I want to view activity metrics for my community, so that I understand how students are using the platform.                           |

---

#### 🛡️ Safety & Moderation

| ID    | User Story                                                                                                                                             |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| US-44 | As a user, I want to report a suspicious or fraudulent listing, so that the EduCycle team can investigate and protect the community.                   |
| US-45 | As a user, I want to block another user, so that I no longer receive unwanted messages or proposals from them.                                         |
| US-46 | As a buyer, I want to open a dispute if an item does not match its description, so that support can review the case and issue a refund if appropriate. |

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
