require('dotenv').config();
const app = require('./app');

const port = process.env.APP_PORT || 3000;
if (process.env.APP_IP && process.env.APP_PATH) {
  const ip = process.env.APP_IP;
  const path = process.env.APP_PATH;
  app.listen(port, ip, () => {
    console.log(`Server listening on port ${port} and ip ${ip}`);
  });
} else {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
