# CRM CORE

Personal CRM REST API for user authentication, client profile management and
activity log centralization, built with Node.js, Express, TypeScript and MongoDB.

## TABLE OF CONTENTS

- [Stack](#stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [License](#license)

## CORE STACK

- Node.js
- Express
- TypeScript
- MongoDB / Mongoose
- JWT authentication with bcrypt password hashing
- Zod request validation
- Swagger/OpenAPI documentation
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
│   ├── swagger.ts                 # OpenAPI specification
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
    ├── constants/                 # Shared constants
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
SEED_ADMIN_NAME=CRM Administrator
SEED_ADMIN_EMAIL=admin@crm.local
SEED_ADMIN_PASSWORD=ChangeMeAdmin123!
SEED_CLIENT_PASSWORD=ChangeMe123!
```

Never use the example JWT secret or seed passwords outside local development.

## USAGE

### Development
Start the application with hot-reload:
```bash
npm run dev
```

Swagger UI is available at:

```text
http://localhost:3000/docs
```

The raw OpenAPI document is available at `/docs/json`.

## DEPLOYMENT

The project uses GitHub Actions to run `npm ci`, `npm run build` and `npm test`
on pushes and pull requests. The production image is built with Docker and is
designed for deployment on Render with MongoDB Atlas.

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
Populate the database with an administrator, client users, client profiles and
empty activity logs:
```bash
npm run seed:clients
```

The seed resets the `users`, `clients` and `loggers` collections and
synchronizes indexes to remove obsolete indexes from previous schemas.

For production, do not run the destructive seed. Provision only the admin
account with:

```bash
npm run create:admin
```

After a production build, use:

```bash
npm run create:admin:compiled
```

### Tests
Run the unit and integration tests:

```bash
npm test
```

Run Vitest in watch mode during development:

```bash
npm run test:watch
```

## API ENDPOINTS

The API is versioned and prefixed with `/v1/api`.

### Authentication
- `POST /v1/api/auth/register` - Register a client account.
- `POST /v1/api/auth/login` - Authenticate a user and receive a JWT.
- `POST /v1/api/auth/setup-admin` - Create the first administrator with the bootstrap code.

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

To create the first administrator, configure `ADMIN_SETUP_ENABLED=true` and
`ADMIN_SETUP_KEY` in the deployment environment, then call:

```bash
curl -X POST https://YOUR-SERVICE.onrender.com/v1/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{
    "accessCode": "YOUR_ADMIN_SETUP_KEY",
    "name": "CRM Administrator",
    "email": "admin@example.com",
    "password": "A-strong-admin-password"
  }'
```

The endpoint is refused once an `ADMIN` already exists. After the first
successful creation, set `ADMIN_SETUP_ENABLED=false` in Render.

An existing administrator can create additional administrators with its JWT:

```bash
curl -X POST https://YOUR-SERVICE.onrender.com/v1/api/users/admins \
  -H "Authorization: Bearer ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Second Administrator",
    "email": "admin2@example.com",
    "password": "AnotherStrongPassword123!"
  }'
```

Only users with the `ADMIN` role can use this route. It never creates a
client profile and ignores any `role` field supplied by the caller.

Client and log routes require the header:

```text
Authorization: Bearer <token>
```

Use the token returned by `/auth/login` as `Authorization: Bearer <jwt-token>`.

Role permissions:

The header format is `Bearer` followed by the JWT returned by the login
endpoint.

- `ADMIN`: full access to client management and logs;
- `AGENT`: read access to logs;
- `CLIENT`: authentication only for now.

The seed creates an administrator using `SEED_ADMIN_NAME`,
`SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`. Client seed accounts use
`SEED_CLIENT_PASSWORD`.

### Clients
- `POST /v1/api/clients` - Create a client profile for an existing user (`ADMIN`).
- `GET /v1/api/clients` - List active clients with pagination, search, filters and sorting (`ADMIN`).
- `GET /v1/api/clients/:identifier` - Find a client by ID or phone (`ADMIN`).
- `PATCH /v1/api/clients/:identifier` - Update a client profile (`ADMIN`).
- `DELETE /v1/api/clients/:identifier` - Soft-delete a client profile (`ADMIN`).

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
- `GET /v1/api/logs` - Retrieve all logs (`ADMIN`, `AGENT`).
- `GET /v1/api/logs/:phone` - Retrieve the latest log for a phone number (`ADMIN`, `AGENT`).
- `GET /v1/api/logs/client/:clientId` - Retrieve a client's activity history (`ADMIN`, `AGENT`).

Logs include the related client and, when the action is authenticated, the user
who performed the action.

## DATA MODEL

Authentication data and CRM data are separated:

```text
User
├── name
├── email
├── password
├── role: CLIENT | AGENT | ADMIN
└── isActive

Client
├── userId
├── phone
├── address
└── isActive
```

A client account is represented by a `User` with the `CLIENT` role and an
associated `Client` profile. Administrators and agents do not need a client
profile.

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
