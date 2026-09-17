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

## CORE STACK

- Node.js
- Express
- TypeScript
- MongoDB / Mongoose
- YAML service configuration
- Docker & Docker Compose

## PREREQUISITES

- Node.js (v18 or higher recommended)
- Docker and Docker Compose
- npm (or yarn)

## PROJECT STRUCTURE

```text
src/
├── app.ts                         # Express application entry point
├── server.ts                      # Database and HTTP server startup
├── bootstrap/
│   ├── container.ts               # YAML-driven dependency container
│   ├── composition.ts             # Application service composition root
│   └── create-app.ts              # Express composition root
├── config/
│   ├── env.ts                     # Environment configuration
│   └── services.yml               # Service declarations and dependencies
├── modules/
│   ├── clients/                   # Client domain
│   └── logs/                      # Log domain
├── infrastructure/
│   ├── database/                  # MongoDB connection and seed
│   └── http/                      # HTTP error middleware
└── shared/
    ├── errors/                    # Shared application errors
    ├── helpers/                   # Validators and response helpers
    └── types/                     # Shared TypeScript types
```

The application uses a lightweight dependency container. Services are declared in
`src/config/services.yml`. The generic container is implemented in
`src/bootstrap/container.ts`, while `src/bootstrap/composition.ts` assembles the
application controllers. Express setup remains isolated in
`src/bootstrap/create-app.ts`, and business modules do not read the YAML file
directly.

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

```env
MONGO_URI=mongodb://localhost:27017/crm
PORT=3000
```

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

The build copies `services.yml` to `dist/config` and rewrites TypeScript path
aliases so the compiled application can run directly with Node.js.

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

## SERVICE CONFIGURATION

Services use logical names and reference dependencies with the `@serviceName`
syntax:

```yaml
services:
  clientController:
    class: '../modules/clients/client.controller'
    export: ClientController
    arguments:
      - '@clientService'
```

The container validates the YAML structure and reports missing services,
unresolvable dependencies, missing classes, invalid exports, and circular
dependencies explicitly.

## License

This project is licensed under the [MIT](LICENSE) License.
