# EduCycle — Development Report

Welcome to the documentation of **EduCycle**!

This Software Development Report, tailored for **LEIC-ES-2025-26 (Group T3)**, covers the full lifecycle of EduCycle — from high-level product vision down to low-level implementation decisions, sprint management, and architecture.

It is organised by the following activities:

- [Team](#team)
- [Business Modelling](#business-modelling)
  - [Product Vision](#product-vision)
  - [Features and Assumptions](#features-and-assumptions)
- [Requirements](#requirements)
  - [User Stories](#user-stories)
  - [Domain Model](#domain-model)
  - [User Interfaces](#user-interfaces)
- [Architecture and Design](#architecture-and-design)
  - [Logical Architecture](#logical-architecture)
  - [Physical Architecture](#physical-architecture)
  - [Functional Prototype](#functional-prototype)
- [Project Management](#project-management)
  - [Sprint 0](#sprint-0)
  - [Sprint 1](#sprint-1)
  - [Sprint 2](#sprint-2)
  - [Sprint 3](#sprint-3)
  - [Final Release](#final-release)

---

## Team

| Name | Email |
|------|-------|
| Afonso Cabral | up202405418@up.pt |
| Artur Ferro | up202404762@up.pt |
| Guilherme Nunes | up202404656@up.pt |
| Henrique Pereira | up202404170@up.pt |
| João Leppanen | up200202572@up.pt |

> Contributions are expected to be made exclusively by the initial team. After the course ends, we may open contributions to the community across all areas: requirements, technologies, development, experimentation, testing, etc.
>
> **Please contact us if you'd like to get involved!**

---

## Business Modelling

### Product Vision

> _"To make access to school supplies fairer, more affordable, and sustainable for all students."_

**For students, families and educators who need affordable school and academic materials. EduCycle is a peer-to-peer marketplace that allows users to buy, sell, trade and lend used educational items. Unlike general second-hand platforms, EduCycle is built exclusively for the academic journey, organised by school level, discipline and institution.**

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

<p align="center">
  <img src="docs/imgs/Domain.png" alt="Domain Model" width="800"/>
</p>

---

### User Interfaces

_User interface mockups — see [Architecture and Design > User Interface Mockups](#user-interface-mockups) below._

---

## Architecture and Design

### Logical Architecture

<p align="center">
  <img src="docs/imgs/Logical.drawio.svg" alt="Logical Architecture" width="800"/>
</p>

---

### Physical Architecture

<p align="center">
  <img src="docs/imgs/Physical.png" alt="Physical Architecture" width="800"/>
</p>

**Technology choices:**

- **Frontend:** Flutter (cross-platform mobile and web)
- **Backend:** Node.js / Firebase Functions
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Payments:** Stripe or similar
- **Notifications:** Firebase Cloud Messaging (FCM)
- **Shipping:** CTT / DPD API integration

---

### User Interface Mockups

UI mockups designed for each key screen of the EduCycle application:

#### Welcome & Authentication

<p align="center">
  <img src="docs/imgs/mockups/WelcomePage.png" alt="Welcome Page" width="250"/>
  &nbsp;&nbsp;
  <img src="docs/imgs/mockups/LoginPage.png" alt="Login Page" width="250"/>
  &nbsp;&nbsp;
  <img src="docs/imgs/mockups/CreateAccountPage.png" alt="Create Account Page" width="250"/>
</p>

#### Browsing & Discovery

<p align="center">
  <img src="docs/imgs/mockups/HomePage.png" alt="Home Page" width="250"/>
  &nbsp;&nbsp;
  <img src="docs/imgs/mockups/ItemPage.png" alt="Item Page" width="250"/>
</p>

#### Listings & Shopping

<p align="center">
  <img src="docs/imgs/mockups/ListingPage.png" alt="Listing Page" width="250"/>
  &nbsp;&nbsp;
  <img src="docs/imgs/mockups/ShoppingCartPage.png" alt="Shopping Cart Page" width="250"/>
</p>

#### Community & Chat

<p align="center">
  <img src="docs/imgs/mockups/HubPage.png" alt="Hub Page" width="250"/>
  &nbsp;&nbsp;
  <img src="docs/imgs/mockups/ChatPage.png" alt="Chat Page" width="250"/>
</p>

#### Profile

<p align="center">
  <img src="docs/imgs/mockups/EditProfilePage.png" alt="Edit Profile Page" width="250"/>
  &nbsp;&nbsp;
  <img src="docs/imgs/mockups/ProfileViewPage.png" alt="Profile View Page" width="250"/>
</p>

---

### Functional Prototype

_Functional prototype to be added after the initial implementation sprint._

---

## Project Management

- Backlog management: Product backlog and Sprint backlog in a [GitHub Projects board](#)
- Release management: v0, v1, v2, v3, …
- Sprint planning and retrospectives:
  - **Plans:** screenshots of GitHub Projects board at beginning and end of each Sprint
  - **Retrospectives:** meeting notes addressing — _Did well_, _Do differently_, _Puzzles_, _Improvements for the next Sprint_

---

### Sprint 0

#### Scrum Board

<p align="center">
  <img src="docs/imgs/Sprint0_ScrumBoard.png" alt="Sprint 0 Scrum Board" width="900"/>
</p>

#### Retrospective

**What went well**
The team successfully set up the project repository, aligned on the product vision, and produced a first draft of the backlog with core user stories. Communication and task distribution were smooth throughout the sprint.

**What to do differently**
User stories should be drafted and refined earlier in the sprint to leave room for discussion before the deadline.

**Open questions**
The expected scope of the functional prototype for Sprint 1 still needs clarification from the teaching staff.

**Improvements for next sprint**
- Discuss requirements and design decisions earlier in the sprint to avoid last-minute blockers
- Set up a shared document for meeting notes so decisions are not lost after calls
- Review each other's pull requests within 24 hours to avoid merge delays

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

### Final Release

_Final release notes and retrospective to be added._
