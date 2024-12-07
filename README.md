# Storage_SyS

Welcome to the Storage_SyS repository. This project is designed to manage and organize storage systems efficiently.

**Note:** This project is currently a work in progress.

## Project Structure

This project follows a well-organized structure to maintain clarity and separation of concerns, utilizing a layered architecture (also known as N-Tier Architecture). Below is an overview of the main directories and their purposes:

```plaintext
src/
├── config/                 # Configuration files
├── controllers/            # Handles request/response
├── routes/                 # API routes
├── services/               # Business logic and use cases
├── models/                 # Data models and Prisma integration
├── middlewares/            # Express middlewares
├── utils/                  # Helper and utility functions
├── lib/                    # Custom libraries or third-party integrations
├── app.ts                  # App setup and middleware registration
├── server.ts               # Server initialization
└── index.ts                # Entry point for the app
```

### Directories

- **config/**: Contains configuration files for the application, such as environment variables and centralized configuration exports.
- **controllers/**: Manages the request and response logic for different routes.
- **routes/**: Defines the API routes and their corresponding handlers.
- **services/**: Contains the business logic and use cases, encapsulating the core functionality of the application.
- **models/**: Includes data models and Prisma integration files, such as schema definitions and migrations.
- **middlewares/**: Houses Express middlewares for tasks like authentication and error handling.
- **utils/**: Provides helper and utility functions for various tasks like logging, validation, and date manipulation.
- **lib/**: Contains custom libraries or third-party integrations, such as caching utilities, payment gateway integration, and email handling.

### Files

- **app.ts**: Sets up the application and registers middlewares.
- **server.ts**: Initializes and starts the server.
- **index.ts**: The main entry point for the application.

This structure ensures that the codebase is modular, maintainable, and scalable, adhering to the principles of layered architecture.

## Contributing

We welcome contributions to this project. Please see the contributing guidelines in the `/docs/` directory for more information.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
