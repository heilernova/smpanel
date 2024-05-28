declare  {
    namespace NodeJS {
      interface ProcessEnv {
        readonly NODE_ENV?: 'development' | 'production';
        readonly PORT: string;
        readonly DB_TYPE: "PostgreSQL" | "MariaDB",
        readonly DB_HOSTNAME: string;
        readonly DB_USERNAME: string,
        readonly DB_PASSWORD: string,
        readonly DB_DATABASE: string,
        readonly DB_PORT?: string;
      }
    }
  }