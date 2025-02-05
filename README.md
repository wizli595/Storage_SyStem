# Storage_SyS

Welcome to the **Storage_SyS** repository! This project is designed to efficiently manage and organize storage systems using a well-structured, scalable architecture.

**Note:** This project is currently a work in progress.

## 📁 Project Structure

This project follows a **layered architecture (N-Tier Architecture)** to ensure clarity, maintainability, and scalability.

```plaintext
src/
├── config/                 # Configuration files
├── controllers/            # Handles request/response
├── core/                   # Core logic (Base classes & shared functionalities)
├── repositories/           # Data access layer (Repository Pattern)
├── routes/                 # API routes
├── services/               # Business logic and use cases
├── models/                 # Data models and Prisma integration
├── middlewares/            # Express middlewares
├── utils/                  # Helper and utility functions
├── validators/             # Input validation logic
├── logs/                   # Log files
├── app.ts                  # App setup and middleware registration
├── server.ts               # Server initialization
└── index.ts                # Entry point for the app
```

## 🗂 Directories

- **`config/`**: Contains configuration files for environment variables and centralized configurations.
- **`controllers/`**: Manages the request and response logic for different API routes.
- **`core/`**: Contains shared base classes such as `BaseController.ts` and `BaseService.ts` for code reusability.
- **`repositories/`**: Implements the Repository Pattern, acting as the data access layer for managing database interactions.
- **`routes/`**: Defines API endpoints and connects them with controllers.
- **`services/`**: Houses the business logic, encapsulating use cases and domain logic.
- **`models/`**: Includes Prisma ORM integration, schema definitions, and database management.
- **`middlewares/`**: Express middleware for authentication, logging, and error handling.
- **`utils/`**: Provides helper functions for logging, error handling, and other utilities.
- **`validators/`**: Contains input validation logic.
- **`logs/`**: Stores application logs for debugging and monitoring.

## 📜 Files

- **`app.ts`**: Configures the Express app and registers middlewares.
- **`server.ts`**: Initializes and starts the server.
- **`index.ts`**: The main entry point for the application.

This structure ensures the project is **modular, scalable, and maintainable**, following best practices for large-scale backend applications.

---

## 🚀 Features

- ✅ **Layered Architecture** for better separation of concerns.
- ✅ **Repository Pattern** for structured database interactions.
- ✅ **Centralized Error Handling** to maintain consistency.
- ✅ **Logging System** for better debugging and monitoring.
- ✅ **Input Validation** to ensure data integrity.

---

## 🛠 Installation & Setup

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/wizli595/Storage_SyStem.git
cd Storage_SyStem
```

## 2️⃣ Install Dependencies

```sh
yarn install
```

## 3️⃣ Set Up Environment Variables

Create a `.env` file in the `src/config/` directory and define the necessary environment variables.

## 4️⃣ Start the Application

```sh
yarn dev
```

## 📜 Backend Workflow

This is the step-by-step **flow of how the backend works**:

1️⃣ **Create an Item** → Add storage ingredients/products (e.g., Chicken, Flour, Rice).  
2️⃣ **Create a Plate** → Define a meal that customers can order (e.g., Fried Chicken Meal).  
3️⃣ **Link Ingredients to a Plate** → Assign required ingredients to each meal.  
4️⃣ **Place an Order** → Deduct stock automatically when an order is placed.  
5️⃣ **Request More Stock** → The kitchen requests additional stock when levels are low.  
6️⃣ **Approve Stock Request** → The admin approves the request for replenishment.  
7️⃣ **Issue Stock** → The approved stock is sent to the kitchen and logged.  
8️⃣ **Stock Logs** → Every stock movement (orders, issues, approvals) is recorded for tracking.

✅ **This ensures efficient stock management and prevents missing inventory.** 🚀

## Contributing

We welcome contributions to this project. Please see the contributing guidelines in the `/docs/` directory for more information.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
