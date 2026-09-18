import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition: swaggerJSDoc.SwaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "CRM Core API",
    version: "1.0.0",
    description: "Personal CRM API for users, clients and activity logs.",
  },
  servers: [{ url: "/v1/api" }],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a client account",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterPayload" } } },
        },
        responses: {
          "201": { description: "Account created" },
          "400": { description: "Validation error" },
          "409": { description: "Email or phone already exists" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Authenticate a user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AuthCredentials" } } },
        },
        responses: {
          "200": {
            description: "Authenticated",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } },
          },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/clients": {
      post: {
        tags: ["Clients"],
        summary: "Create a client profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ClientProfile" } } },
        },
        responses: { "201": { description: "Client profile created" }, "403": { description: "Forbidden" } },
      },
      get: {
        tags: ["Clients"],
        summary: "List client profiles",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 20 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "isActive", in: "query", schema: { type: "boolean" } },
          { name: "sortBy", in: "query", schema: { type: "string", enum: ["phone", "createdAt", "updatedAt"] } },
          { name: "sortOrder", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
        ],
        responses: { "200": { description: "Paginated client profiles" }, "403": { description: "Forbidden" } },
      },
    },
    "/clients/{identifier}": {
      parameters: [{ name: "identifier", in: "path", required: true, schema: { type: "string" } }],
      get: {
        tags: ["Clients"],
        summary: "Get a client profile by ID or phone",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Client profile" }, "404": { description: "Client not found" } },
      },
      patch: {
        tags: ["Clients"],
        summary: "Update a client profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ClientProfile" } } },
        },
        responses: { "200": { description: "Client profile updated" }, "403": { description: "Forbidden" } },
      },
      delete: {
        tags: ["Clients"],
        summary: "Deactivate a client profile",
        security: [{ bearerAuth: [] }],
        responses: { "204": { description: "Client profile deactivated" }, "403": { description: "Forbidden" } },
      },
    },
    "/logs": {
      get: {
        tags: ["Logs"],
        summary: "List activity logs",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Activity logs" }, "403": { description: "Forbidden" } },
      },
    },
    "/logs/{phone}": {
      get: {
        tags: ["Logs"],
        summary: "Get the latest log for a phone number",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "phone", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Activity log" }, "404": { description: "Log not found" } },
      },
    },
    "/logs/client/{clientId}": {
      get: {
        tags: ["Logs"],
        summary: "Get a client's activity history",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "clientId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Client activity history" }, "403": { description: "Forbidden" } },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      AuthCredentials: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password", minLength: 8 },
        },
      },
      RegisterPayload: {
        allOf: [
          { $ref: "#/components/schemas/AuthCredentials" },
          {
            type: "object",
            required: ["name", "phone", "address"],
            properties: {
              name: { type: "string", minLength: 2 },
              phone: { type: "string", pattern: "^\\d{9,15}$" },
              address: { type: "string", minLength: 2 },
            },
          },
        ],
      },
      ClientProfile: {
        type: "object",
        required: ["userId", "phone", "address"],
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          phone: { type: "string" },
          address: { type: "string" },
          isActive: { type: "boolean" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string", format: "email" },
              role: { type: "string", enum: ["CLIENT", "AGENT", "ADMIN"] },
            },
          },
          token: { type: "string" },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: [],
});
