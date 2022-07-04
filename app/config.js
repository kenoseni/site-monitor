const environments = {};

environments.staging = {
  port: 6316,
  envName: "staging",
};

environments.production = {
  port: 8702,
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
