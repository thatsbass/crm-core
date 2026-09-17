# CRM CORE

REST API for Orange customer management and log centralization, built with Node.js, Express, and TypeScript.

## TABLE OF CONTENTS

- [Stack](#stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## CORES STACK

- Node.js
- Express
- TypeScript
- Docker & Docker Compose

## PREREQUISITES

- Node.js (v18 or higher recommended)
- Docker and Docker Compose
- npm (or yarn)

## PROJECT STRUCTURE

```text
src/
├── app.ts                 # Express application configuration
├── server.ts              # Server entry point
├── modules/               # Functional modules
│   ├── routes.ts         # Main router
│   ├── clients/           # Client management module
│   │   ├── client.controller.ts
│   │   ├── client.service.ts
│   │   ├── client.routes.ts
│   │   └── client.model.ts
│   └── logs/              # Log management module
│       ├── log.controller.ts
│       ├── log.service.ts
│       ├── log.routes.ts
│       └── logModel.ts
└── shared/                # Shared resources
    ├── common/            # Global middlewares and exceptions
    │   ├── errorMiddleware.ts
    │   └── exceptions/
    ├── config/            # Application configurations
    │   ├── database.ts
    │   ├── seed.ts
    │   └── services.yml
    ├── helpers/           # Utility functions and validators
    │   ├── constant.ts
    │   ├── records.ts
    │   └── validators.ts
    └── types/             # Shared TypeScript types
        └── type.ts
```

## INSTALLATION & SETUP

1. Clone the repository:
```bash
git clone https://github.com/thatsbass/crm-core.git
cd crm-core
```

2. Install dependencies:
```bash
npm install
```

3. Environment configuration:
Create a `.env` file in the root directory based on `.env.example` and define the required variables.

## USAGE

### Development
Start the application with hot-reload:
```bash
npm run dev
```

### Production
Build the TypeScript source files and start the production server:
```bash
npm run build
npm start
```

### Docker
Launch the complete infrastructure using Docker Compose:
```bash
docker-compose up -d
```

### Database Seeding
Populate the database with initial dummy data:
```bash
npm run seed:clients
```

## API ENDPOINTS

The API is versioned and prefixed with `/v1/api`.

### Clients
- `GET /v1/api/clients/:phone` - Find a client by phone number.

### Logs
- `GET /v1/api/logs` - Retrieve all logs.
- `GET /v1/api/logs/:phone` - Retrieve logs filtered by phone number.

## License

This project is licensed under the [MIT](LICENSE) License.
