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
│   ├── auth/                     # Authentication and users
│   ├── users/                    # User identity, roles and credentials
│   ├── clients/                  # Client domain
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
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1h
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

### Authentication
- `POST /v1/api/auth/register` - Register a client account.
- `POST /v1/api/auth/login` - Authenticate a user and receive a JWT.

Registration payload:

```json
{
  "name": "Mariam Diongue",
  "email": "mariam.dion@example.com",
  "phone": "773612264",
  "address": "Cité Gadaye",
  "password": "MotDePasse123"
}
```

New registrations receive the `CLIENT` role. The `AGENT` and `ADMIN` roles
are intended for accounts provisioned by an authorized administrator.

Client and log routes require the header:

```text
Authorization: Bearer <token>
```

Role permissions:

- `ADMIN`: full access to client management and logs;
- `AGENT`: read access to logs;
- `CLIENT`: authentication only for now.

The seed creates an administrator using `SEED_ADMIN_NAME`,
`SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`. These values must be changed
outside local development.

### Clients
- `POST /v1/api/clients` - Create a client profile for an existing user.
- `GET /v1/api/clients` - List active clients with pagination, search, filters and sorting.
- `GET /v1/api/clients/:identifier` - Find a client by MongoDB identifier or phone number.
- `PATCH /v1/api/clients/:identifier` - Update a client by MongoDB identifier.
- `DELETE /v1/api/clients/:identifier` - Soft-delete a client by MongoDB identifier.

Supported list query parameters:

```text
page=1
limit=20
search=mariam
isActive=true
sortBy=phone|createdAt|updatedAt
sortOrder=asc|desc
```

Client profile creation payload:

```json
{
  "userId": "68c...",
  "phone": "773612264",
  "address": "Cité Gadaye"
}
```

Deleted clients remain in the database with `isActive=false` and are excluded
from the default list.

### Logs
- `GET /v1/api/logs` - Retrieve all logs.
- `GET /v1/api/logs/:phone` - Retrieve logs filtered by phone number.
- `GET /v1/api/logs/client/:clientId` - Retrieve a client's activity history.

Logs include the related client and, when the action is authenticated, the user
who performed the action.

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
