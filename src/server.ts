import app from './app';
import { config } from './config';

const PORT = config.server.port;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
