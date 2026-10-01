import { EnterpriseAPIServer } from './server.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const server = new EnterpriseAPIServer(PORT);

server.listen(PORT).catch((err) => {
  console.error('Failed to start API server:', err);
  process.exit(1);
});
