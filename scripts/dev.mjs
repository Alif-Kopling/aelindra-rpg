import { createServer } from 'vite';

const server = await createServer({
  configFile: 'vite.config.ts',
});

await server.listen();
server.printUrls();
