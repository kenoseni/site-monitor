const environments = {};

environments.staging = {
  httpPort: 6316,
  httpsPort: 6317,
  envName: "staging",
};

environments.production = {
  httpPort: 8702,
  httpsPort: 8703,
  envName: "production",
};

const currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

const environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
