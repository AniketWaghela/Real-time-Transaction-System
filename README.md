# Real-time Transaction & Audit Log System

## Project Overview
This project is a full-stack banking application designed to simulate real-time financial transactions with high integrity and security. The system allows users to transfer funds instantly while maintaining an immutable audit log of every action.

**Implementation Approach:**
- **Backend**: Built with **Java & Spring Boot** to ensure robust transaction management using `@Transactional`.
- **Database**: Uses **H2 In-Memory Database** for easy setup and persistence during the session, with strict relational integrity.
- **Frontend**: Developed with **React.js and Tailwind CSS** to provide a responsive, modern user interface.
- **Real-time**: Implements **WebSockets (STOMP protocol)** to push balance updates and transaction history to the client instantly, eliminating the need for page refreshes.

## Setup/Run Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- Maven

### Step 1: Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    *The server will start on port 8080.*

### Step 2: Frontend Setup
1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open http://localhost:5173 to view the application.

## API Documentation
The core API is RESTful and handles transaction processing and history retrieval.

| Method | Endpoint | Description | Payload / Params |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/transfer` | Initiates a fund transfer between two accounts. | `{ "senderId": 1, "receiverId": 2, "amount": 100.00 }` |
| **GET** | `/api/history/{userId}` | Retrieves the transaction history for a specific user. | `userId` (Path Variable) |
| **WS** | `/ws` | WebSocket endpoint for real-time connection. | N/A |

## Database Schema
The database consists of two primary tables designed for relational integrity.

### 1. Users Table (`users`)
Stores account information.
- **id** (BIGINT, PK): Unique identifier for the user.
- **name** (VARCHAR): Full name of the user.
- **balance** (DECIMAL): Current account balance.
- **email** (VARCHAR): Contact email.

### 2. Audit Log Table (`audit_log`)
Immutable record of all transactions.
- **id** (BIGINT, PK): Unique transaction ID.
- **sender_id** (BIGINT, FK): ID of the user sending funds.
- **receiver_id** (BIGINT, FK): ID of the user receiving funds.
- **amount** (DECIMAL): The value transferred.
- **status** (VARCHAR): Transaction outcome (SUCCESS/FAILED).
- **timestamp** (TIMESTAMP): Exact time of the transaction.

## AI Tool Usage Log (MANDATORY)

| Task | AI-Assisted Tasks | Effectiveness Score | Justification |
| :--- | :--- | :--- | :--- |
| **Backend Boilerplate** | Generated Spring Boot `pom.xml`, `Entity` classes, and `Repository` interfaces. | **5/5** | Saved ~2 hours of repetitive setup; code was error-free and ready to run. |
| **Transaction Logic** | Wrote the `TransferService` with `@Transactional` ensures atomicity and rollback on failure. | **4/5** | Logic was correct, though I had to manually tune the exception handling for better error messages. |
| **Frontend UI** | Generated Tailwind CSS classes for the responsive data table and transaction forms. | **5/5** | Produced a professional-looking UI instantly, which would have taken hours to style manually. |
| **WebSocket Integration** | Provided the `WebSocketConfig` and React `stompjs` hooks for real-time updates. | **5/5** | Complex protocol details were handled correctly on the first try, enabling instant real-time features. |
| **Documentation** | Drafted the Project Overview and Installation steps for this README. | **5/5** | ensured all submission guidelines were clearly met and formatted correctly. |

## Submission Details
- **Code Repository**: [https://github.com/AniketWaghela/Real-time-Transaction-System](https://github.com/AniketWaghela/Real-time-Transaction-System)
- **Video Demo**: [Insert Link to Video/Screen Recording Here]
