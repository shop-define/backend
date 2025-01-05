export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  app: {
    port: process.env.PORT || 3000,
    apiPrefix: process.env.API_PREFIX || '/api',
    swaggerPath: process.env.SWAGGER_PATH || '/api/docs',
    originUrls: process.env.ORIGIN_URLS || '*',
  },
  dev: {
    authCode: process.env.DEV_AUTH_CODE || '12345',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret',
  },
  mail: {
    client: process.env.SMTP_CLIENT || 'gmail',
    server: process.env.SMTP_SERVER || 'smtp.gmail.com',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
  },
  database: {
    url: process.env.DATABASE_URL || '',
  },
  awsStorage: {
    url: process.env.S3_ENDPOINT || '',
    accessKey: process.env.S3_ACCESS_KEY || '',
    secretKey: process.env.S3_SECRET_KEY || '',
    region: process.env.S3_REGION || '',
    bucketName: process.env.S3_BUCKET_NAME || '',
    newsBucketName: process.env.S3_NEWS_BUCKET_NAME || '',
  },
  privatePrefix: '/private',
};
