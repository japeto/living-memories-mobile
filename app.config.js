const appJson = require('./app.json');

module.exports = {
  ...appJson.expo,
  extra: {
    apiBaseUrl: process.env.API_BASE_URL ?? 'http://localhost:8000',
  },
};
