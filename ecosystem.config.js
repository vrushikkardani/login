module.exports = {
    apps: [
      {
        name: "wow",
        script: "./bin/www",
        watch: true,
        ignore_watch: ["node_modules", "public", "logs"],
        env_local: {
          PORT: 3647,
          NODE_ENV: "local",
          DOMAIN_URL: "http://127.0.0.1:3647", 
          DB_MONGO_URL:"mongodb://localhost:27017/wow",
          JWT_SECRET: "jsonwebtoken",
          SMTP_PORT: 587,
          SMTP_HOST: "smtp.gmail.com",
          SMTP_SECURE_CONNECTION: "",
          SMTP_AUTH_USER: "smtp.devstree2020@gmail.com",
          SMTP_AUTH_PASSWORD: "hpwmqjrhmjtlofrs",
          SMTP_SOURCE_EMAIL: "smtp.devstree2020@gmail.com"
        },
        env: {
          PORT: 3647,
          NODE_ENV: "local",
          DOMAIN_URL: "http://127.0.0.1:3647",
          DB_MONGO_URL:"mongodb://localhost:27017/wow",
          JWT_SECRET: "jsonwebtoken",
          SMTP_PORT: 587,
          SMTP_HOST: "smtp.gmail.com",
          SMTP_SECURE_CONNECTION: "",
          SMTP_AUTH_USER: "smtp.devstree2020@gmail.com",
          SMTP_AUTH_PASSWORD: "hpwmqjrhmjtlofrs",
          SMTP_SOURCE_EMAIL: "smtp.devstree2020@gmail.com"
        },
        env_production: {
          PORT: 3647,
          NODE_ENV: "local",
          DOMAIN_URL: "http://127.0.0.1:3647", 
          DB_MONGO_URL:"mongodb://localhost:27017/wow",
          JWT_SECRET: "jsonwebtoken",
          SMTP_PORT: 587,
          SMTP_HOST: "smtp.gmail.com",
          SMTP_SECURE_CONNECTION: "",
          SMTP_AUTH_USER: "smtp.devstree2020@gmail.com",
          SMTP_AUTH_PASSWORD: "hpwmqjrhmjtlofrs",
          SMTP_SOURCE_EMAIL: "smtp.devstree2020@gmail.com"
        },
        env_staging: {
          PORT: 3647,
          NODE_ENV: "local",
          DOMAIN_URL: "http://172.105.35.50:3647",
          DB_MONGO_URL:"mongodb://localhost:27017/wow",
          JWT_SECRET: "jsonwebtoken",
          SMTP_PORT: 587,
          SMTP_HOST: "smtp.gmail.com",
          SMTP_SECURE_CONNECTION: "",
          SMTP_AUTH_USER: "smtp.devstree2020@gmail.com",
          SMTP_AUTH_PASSWORD: "hpwmqjrhmjtlofrs",
          SMTP_SOURCE_EMAIL: "smtp.devstree2020@gmail.com"
        },
      },
    ],
  };
  