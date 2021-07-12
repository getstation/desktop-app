declare namespace NodeJS {
  interface Process extends EventEmitter {
    worker: boolean;
  }

  // Defined and ensured by `dotenv-safe`
  interface ProcessEnv {
    APP_STORE_MANIFEST_URL: string;
  }
}
