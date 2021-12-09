/* eslint-disable prefer-destructuring */
const fs = require('fs');
const _ = require('lodash');
const winston = require('winston/lib/winston/config');

// Load all the values from the .env file to override the process.env
try {
  let env = fs.readFileSync(`${__dirname}/../.env`, 'utf8');
  env = env.split('\n');

  _.each(env, (key) => {
    const matches = key.match(/^([^=]+)=["']?(.*)["']?$/);
    if (matches) {
      process.env[matches[1]] = matches[2];
    }
  });
} catch (e) {
  winston.info('No .env file found, assuming keys are already present');
}

// Check if we have all the keys that we wanted
const requiredKeys = {
  MONGO_URI: { required: true },
  APP_URL: { required: true },
  // CLOUD_CONVERT_KEY: { required: true },
};

process.env = {...process.env,
"MONGO_URI": "mongodb://localhost:27017/mydbname",
"APP_URL": "localhost:8080",
"JWT_SECRET_TOKEN":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.REDACTED_AWS_SECRET_ACCESS_KEYREDACTED_AWS_SECRET_ACCESS_KEYMzkwMjJ9.REDACTED_AWS_SECRET_ACCESS_KEYXLA",
"AWS_IAM_USER_KEY":"REDACTED_AWS_ACCESS_KEY_ID",
"AWS_IAM_USER_SECRET":"REDACTED_AWS_SECRET_ACCESS_KEY",
"AWS_BUCKET_NAME":"secrettime-cdn",
"AWS_REGION":"eu-west-2"
}
_.each(requiredKeys, (value, key) => {
  if (value.required && !process.env[key]) {
    winston.error(`Environment variable ${key} not found!`);
    process.exit(1);
  }
});
