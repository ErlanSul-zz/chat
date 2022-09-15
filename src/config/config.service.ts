import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigInterface } from './config.interface';

export interface EnvConfigRaw {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: ConfigInterface;

  constructor(filePath?: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  get(key: string): string | number | boolean {
    return this.envConfig[key];
  }

  get env(): string {
    return this.envConfig.NODE_ENV;
  }

  get serverHost(): string {
    return this.envConfig.SERVER_HOST;
  }

  get serverPort(): number {
    return this.envConfig.SERVER_PORT;
  }

  get databaseConnectionName(): string {
    return this.envConfig.DATABASE_CONNECTION_NAME;
  }

  get databaseHost(): string {
    return this.envConfig.DATABASE_HOST;
  }

  get databasePort(): number {
    return this.envConfig.DATABASE_PORT;
  }

  get databaseName(): string {
    return this.envConfig.DATABASE_NAME;
  }

  get databaseUser(): string {
    return this.envConfig.DATABASE_USER;
  }

  get databasePassword(): string {
    return this.envConfig.DATABASE_PASSWORD;
  }

  get databaseSynchronize(): boolean {
    return this.envConfig.DATABASE_SYNCHRONIZE;
  }

  get databaseLogging(): boolean {
    return this.envConfig.DATABASE_LOGGING;
  }

  get databaseCache(): boolean {
    return this.envConfig.DATABASE_CACHE;
  }

  get databaseConnectionTimeout(): number {
    return this.envConfig.DATABASE_CONNECTION_TIMEOUT;
  }

  private validateInput(envConfig: EnvConfigRaw): ConfigInterface {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string().default('development'),

      SERVER_HOST: Joi.string().allow('', null),
      SERVER_PORT: Joi.number().allow('', null),

      DATABASE_CONNECTION_NAME: Joi.string().required(),
      DATABASE_HOST: Joi.string().required(),
      DATABASE_PORT: Joi.number().required(),
      DATABASE_NAME: Joi.string().required(),
      DATABASE_USER: Joi.string().required(),
      DATABASE_PASSWORD: Joi.string().required(),
      DATABASE_LOGGING: Joi.boolean(),
      DATABASE_SYNCHRONIZE: Joi.boolean(),
      DATABASE_CACHE: Joi.boolean(),
      DATABASE_CONNECTION_TIMEOUT: Joi.number().required(),
    });

    const validationResult = envVarsSchema.validate(envConfig, {
      allowUnknown: true,
    });

    if (validationResult.error !== undefined) {
      throw new Error(
        `Config validation error: ${validationResult.error.message}`,
      );
    }

    return validationResult.value as ConfigInterface;
  }
}
