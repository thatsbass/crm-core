import fs from "fs";
import path from "path";
import yaml from "js-yaml";

type ServiceArgument = string;

interface ServiceDefinition {
  class: string;
  export?: string;
  arguments?: ServiceArgument[];
}

interface ServicesConfig {
  services: Record<string, ServiceDefinition>;
}

type Constructor<T = unknown> = new (...args: unknown[]) => T;

export class ServiceContainer {
  private readonly instances = new Map<string, unknown>();
  private readonly resolving = new Set<string>();

  constructor(
    private readonly definitions: Record<string, ServiceDefinition>,
    private readonly configDirectory: string,
  ) {}

  /**
   * Resolves a configured service and caches its instance for reuse.
   *
   * @param name - Logical service name declared in services.yml.
   * @returns The resolved service instance.
   * @throws If the service or one of its dependencies cannot be resolved.
   */
  get<T>(name: string): T {
    if (this.instances.has(name)) {
      return this.instances.get(name) as T;
    }

    const definition = this.definitions[name];
    if (!definition) {
      throw new Error(`Service "${name}" is not configured.`);
    }

    if (this.resolving.has(name)) {
      throw new Error(`Circular dependency detected while resolving "${name}".`);
    }

    this.resolving.add(name);
    try {
      const ServiceClass = this.loadClass(name, definition);
      const dependencies = (definition.arguments ?? []).map((argument) => {
        if (!argument.startsWith("@")) {
          throw new Error(
            `Invalid argument "${argument}" for service "${name}". Only service references are supported.`,
          );
        }

        return this.get(argument.slice(1));
      });

      const instance = new ServiceClass(...dependencies);
      this.instances.set(name, instance);
      return instance as T;
    } finally {
      this.resolving.delete(name);
    }
  }

  /**
   * Loads and validates the configured class export for a service.
   *
   * @param name - Logical service name used in error messages.
   * @param definition - YAML definition for the service.
   * @returns The constructible class exported by the module.
   */
  private loadClass(name: string, definition: ServiceDefinition): Constructor {
    let moduleExports: Record<string, unknown>;

    try {
      const modulePath = path.resolve(this.configDirectory, definition.class);
      moduleExports = require(modulePath) as Record<string, unknown>;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`Unable to load class for service "${name}": ${reason}`);
    }

    const exportName = definition.export ?? name;
    const ServiceClass = moduleExports[exportName];
    if (typeof ServiceClass !== "function") {
      throw new Error(
        `Export "${exportName}" for service "${name}" is not a constructible class.`,
      );
    }

    return ServiceClass as Constructor;
  }
}

/**
 * Creates a service container from a YAML configuration file.
 *
 * @param configPath - Absolute path to services.yml.
 * @returns A configured service container.
 */
export function loadServiceContainer(configPath: string): ServiceContainer {
  let config: unknown;

  try {
    config = yaml.load(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to read services configuration "${configPath}": ${reason}`);
  }

  if (!isServicesConfig(config)) {
    throw new Error(`Invalid services configuration "${configPath}".`);
  }

  return new ServiceContainer(config.services, path.dirname(configPath));
}

function isServicesConfig(value: unknown): value is ServicesConfig {
  if (!value || typeof value !== "object" || !("services" in value)) {
    return false;
  }

  const services = (value as { services: unknown }).services;
  if (!services || typeof services !== "object") {
    return false;
  }

  return Object.entries(services).every(([name, definition]) => {
    if (!name || !definition || typeof definition !== "object") {
      return false;
    }

    const candidate = definition as Partial<ServiceDefinition>;
    return (
      typeof candidate.class === "string" &&
      (candidate.export === undefined || typeof candidate.export === "string") &&
      (candidate.arguments === undefined ||
        (Array.isArray(candidate.arguments) &&
          candidate.arguments.every((argument) => typeof argument === "string")))
    );
  });
}

/**
 * Returns the services configuration path for the current runtime.
 *
 * @returns Absolute path to services.yml.
 */
export function defaultServicesConfigPath(): string {
  return path.resolve(__dirname, "../config/services.yml");
}
