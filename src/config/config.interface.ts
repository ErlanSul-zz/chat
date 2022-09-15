export interface ConfigInterface {
  [key: string]: string | number | boolean;

  NODE_ENV: string;
  SERVER_HOST: string;
  SERVER_PORT: number;

  DATABASE_CONNECTION_NAME: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  DATABASE_SYNCHRONIZE: boolean;
  DATABASE_LOGGING: boolean;
  DATABASE_CACHE: boolean;
  DATABASE_CONNECTION_TIMEOUT: number;
}
