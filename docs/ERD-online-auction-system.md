# ERD (Engineering Requirements Document ) for : Online Auction System

This document explores the design of online-auction-system, a website where users could exchange goods in auctions manner.

We'll use a basic client/server architecture, where a single server is deployed on a cloud provider next to a NoSql database, and serving HTTP traffic from a public endpoint.

## Storage

We'll use a NoSql database to fast retrieval of data.
Data will be stored on the server on a separate, backed up volume for resilience. There will be no replication or sharding of data at this early stage.

### Schema:

We'll need at least the following entities to implement the service:

1. [User](#user)
   1.1. [Admin](#admin)
   1.2. [Employee](#employee)
   1.3. [Seller](#seller)
   1.4. [Buyer/Bidder](#buyer)
2. [Category](#category)
3. [Item](#item)
4. [Auction](#auction)

### **User**:

| Column       |    Type    |
| ------------ | :--------: |
| \_id         |  ObjectId  |
| name         |   string   |
| email        |   string   |
| password     |   string   |
| refreshToken |   string   |
| role         | Roles enum |

### **Admin**

| Column | Type |
| ------ | :--: |

### **Employee**

| Column | Type |
| ------ | :--: |

### **Seller**

| Column   |   Type    |
| -------- | :-------: |
| auctions | Auction[] |

### **Buyer**

| Column | Type |
| ------ | :--: |

### **Category**

| Column | Type |
| ------ | :--: |

### **Item**

| Column                |   Type   |
| --------------------- | :------: |
| \_id                  | ObjectId |
| name                  |  string  |
| shortDescription      |  string  |
| detailedDescription   |  string  |
| brand                 |  string  |
| color                 |  string  |
| investigationLocation |  string  |

### **Auction**:

| Column            |    Type     |
| ----------------- | :---------: |
| \_id              |  ObjectId   |
| item              |    Item     |
| basePrice         |   number    |
| startDate         |    Date     |
| endDate           |    Date     |
| chairCost         |   number    |
| minimumBidAllowed |   number    |
| currentBid        |   number    |
| numOfBids         |   number    |
| extensionTime     |   number    |
| seller            |   Seller    |
| winningBidder     |    Buyer    |
| status            | Status enum |
| category          |  Category   |

## Server

A simple HTTP server is responsible for authentication, serving stored data, and potentially ingesting and serving analytics data.

- Node.js is selected for implementing the server for speed of development.
- Nest.js is the web server framework.
- Mongoose to be used as an ORM.

### Auth

For v1, a simple JWT-based auth mechanism is to be used, with passwords
hashed and stored in the database.
OAuth is to be added later for Google + Facebook and maybe others (Github?).

### API

The following is the basic required endpoints for the application:

1. [Authentication](#auth)
2. [Users](#users)
   2.1. [Admin](#admin)
   2.2. [Employee](#employee)
   2.3. [Seller](#seller)
   2.4. [Buyer](#buyer)

### **Authentication**:

```bash
# Sign up 🤘🏻
/register  [POST]
# Sign in 🖖🏻
/login  [POST]
# Sign out 👋🏻
/logout [POST]
# Issue new refresh token 🆕
/refresh-token [POST]
# Get current logged in user data
/profile [GET]
```

### **Users**:

```bash
# Manage users 👥
# List all users
/users  [GET]
# Get user details
/users/:id  [GET]
# Update user by id
/users/:id [PATCH]
# Delete user by id
/users/:id [DELETE]
```

### **Admin**:

```bash
# Manage Employees 👨🏻‍💼
# Add Employee
/admin/employee [POST]
# List Employees
/admin/employee [GET]
#remove Employee
/admin/employee/:id [DELETE]

# Manage Categories 🐱‍👤
# Add Category
/admin/category [POST]
# Get Single Category
/admin/category/:id [GET]
# List all Categories
/admin/category [GET]
# Update Category
/admin/category/:id [PATCH]
# Delete Category
/admin/category/:id [DELETE]
```

### **Employee**

```bash

```

### **Seller**

```bash
# Add auction
/seller/auction [POST]
# List all auctions
/seller/auction [GET]
# Edit auction
/seller/auction/:id [PATCH]
# Remove auction
/seller/auction/:id [DELETE]
```

### **Buyer**

```bash

```

## Auction definition and Rules

### Bidding Increment Rules

This site is setup for whole dollar bidding only (no cents allowed, e.g $15).
| Current Price | Bid Increment |
|:--------:|:------:|
| $1 - $49 | 5$ |
| $50 - $99 | 10$ |
| $100 - $249 | 15$ |
| $250 - $399 | 25$ |
| $400 - $749 | 50$ |
| $750 - $1999 | 100$ |
| $2,000 - $4,999 | 200$ |
| $5,000 - $9,999	 | 250$ |
| $10,000+	 | 400$ |

## Definitions

1. [Absolute Bid](#absolute-bid)
2. [Bid](#bid)
3. [Bidder](#Bidder)
4. [Bidding](#Bidding)
5. [Bidholder | High Bidder | Winning Bidder](#bidholder)
6. [Bid Form](#bid-form)
7. [Counterbid](#counterbid)
8. [Opening Bid](#Opening-Bid)
9. [Current Bid](#current-bid)
10. [Bid Increment](#bid-increment)
11. [Minimum Bid](#Minimum-Bid)
12. [Extended Bidding](#extended-bidding)
13. [Invoice](#Invoice)

### Absolute Bid

An Absolute Bid, sometimes referred to as traditional bid, represents the fixed amount the Bidder is committing to pay for the item on which he/she bids.

### Bid

The amount a Registered User submits, and is therefore willing to pay for an item, via the bidding feature contained within the web site.

### Bidder

Any Registered User who places a Bid on a Bidding.

### Bidding

The process by which a Bidder places a Bid on a listing.

### Bidholder

The Bidholder (may also be referred to as `High Bidder`, `Winning Bidder`) is the person who holds the Current Bid on a particular listing. If the auction is closed,
the Bidholder is called the `Winning Bidder`.

### Bid Form

The Bid Form (also referred to as item detail or description page) is the web page which contains details related to a particular listing. This page provides item, seller, high bidder and closing information. Bids are submitted by the bidder from this page.

### Counterbid

When an existing Bidder, places another Bid on an Item in response to being out bid (i.e. Current bid is raised) by another Bidder.

### Opening Bid

The Opening Bid, also referred to as **Starting Bid**, is the minimum amount required to place the first bid on a Listing. If the Opening Bid is $100, the first bidder must bid $100 (or greater) to start the bidding.

### Current Bid

The Current Bid, sometimes referred to as **High Bid**, is the amount at which the [Bidholder](#bidholder) (i.e. Current Bidder) holds the Bid. Once the listing is closed, the Current Bid is known as the **Winning Bid**.

### Bid Increment

The Bid Increment, or minimum raise, is minimum acceptable amount that the Current Bid must be raised by the next bidder as dictated by the system wide [Bidding Increment Rules.](#bidding-increment-rules)
In general, the `Current Bid + Bid Increment = Minimum Bid`.
However, when there are **no bids** on an item, the `Minimum Bid` is equal to the `Opening Bid` (i.e. there is no _Bid Increment_).

Bid increments are always based on the current bid. Therefore, the bid increment may be different if the current bid is $10 versus when it is $250.

For example, if Bidder A holds the Current Bid at $130 and the bid increment at that level is $10, then Bidder B must bid at least $140.

### Minimum Bid

The minimum acceptable amount that is required for a [bidder](#bidder) to place a [Bid](#bid) on an Item. The **Minimum Bid** is calculated using the [Bidding Increment Rules](#bidding-increment-rules) and the [Current Bid](#current-bid).
For example, if the **Current Bid** is $100 and the **Bid Increment** is $10 at the $100 level, then the **Minimum Bid** is $110.

**Notes**:

- The Minimum Bid is equal to [the Starting Bid](#opening-bid) when the Bidding begins. Therefore, a Bidder is only required to bid the Starting Bid amount if he/she is the first bidder.

### Extended Bidding

A dynamic feature which allows the system to automatically extend the closing time of a listing based on bidding activity within a designated period prior to the scheduled closing time.

**Extended bidding is on and set to 180 seconds (3 minutes).**

### Invoice

A summarized list of Item(s) won via bidding, or purchased outright (e.g. Limited Time Offer), by a particular Registered User. Typically, Invoices are created by the web site administrator after the close of an event, or generated periodically (e.g. each day). An Invoice serves as a "bill" and customer payments are applied to it accordingly. If applicable, Invoices may be accessed via the My Account console.

## Clients

For now we'll start with a single web client, possibly adding mobile clients later.

The web client will be implemented in React.js.

## Hosting

The code will be hosted on Github, PRs and issues welcome.

The web client will be hosted using any free web hosting platform such as firebase or netlify. A domain will be purchased for the site, and configured to point to the web host's server public IP.

We'll deploy the server to a (likely shared) VPS for flexibility. The VM will have HTTP/HTTPS ports open, and we'll start with a manual deployment, to be automated later using Github actions or similar. The server will have closed CORS policy except for the domain name and the web host server.

## Implement Real-time Protocol

### What’s WebSocket?

WebSocket is a computer communications protocol, providing full-duplex communication channels over a single TCP connection. The WebSocket protocol was standardized by the IETF as RFC 6455, and the WebSocket API in Web IDL is being standardized by the W3C. WebSocket is distinct from HTTP.

### What’s Socket.IO?

Socket.IO is a JavaScript library for realtime web applications. It enables realtime, bi-directional communication between web clients and servers. It has two parts: a client-side library that runs in the browser, and a server-side library for Node.js.

### What’s Redis Pub/Sub?

Redis Pub/Sub implements the messaging system where the senders (in redis terminology called publishers). The pub-sub pattern allows senders of messages, called publishers to publish messages to receivers called subscribers through a channel without knowledge of which subscribers exist — if any. All subscribers exist at the time the message received can receive the message at the same time.

### Why use Redis for WebSocket communication?

Actually, using Websocket is enough as the transport protocol to communicate between the clients. But there is some scenario that makes our chat realtime application struggle.
Let’s consider a chat application. When a user first connects, a corresponding WebSocket connection is created within the application (WebSocket server) and it is associated with the specific application instance. This WebSocket connection is what empowers the medium to enables us to broadcast chat messages between users. Now, if a new user comes in, they may be connected to a new instance. So we have a scenario where different users (hence their respective WebSocket connections) are associated with different instances. As a result, they will not be able to exchange messages with each other — this is unacceptable, even for our toy chat application. So, we need to use Redis Pub/Sub events to makes those things run-in smoothly.

## User wallet using stripe

### Steps to follow

1. A user creates an account through our NestJS API. Under the hood, we create a Stripe customer for the user and save the id for later.

2. The user provides the details of the credit card through the React application. We send it straight to the Stripe API.

3. Stripe API responds with a payment method id. Our frontend app sends it to our NestJS API.

4. Our NestJS API gets the request and charges the user using the Stripe API.

### Bidding websockets events

#### Listeners

- `place-bid` --> Place new bid in specific auction.
- `get-winner` --> Return auction's winner.
- `leave-auction` --> Retreat from auction

#### Emitting events

- `message-to-client` --> Listen for any message from server to client
- `room-data` --> Get updates about room details (bidders, current bid, etc)
- `new-bid` --> Listen for any new bid from bidders
- `auction-ended` --> Fires when auction ended.
- `winner-bidder` --> To display who is the winner of the auction if exists.
- `exception` --> General event fires when there is an error

## References

- [Auction related definitions and rules](https://auction.wgbh.org/networkinfo.taf?_function=glossary#OpeningBid)

- [Payment with stripe](https://wanago.io/2021/06/14/api-nestjs-stripe-react/)
