import { preview } from 'vite';

const server = await preview({
  configFile: 'vite.config.ts',
});

server.printUrls();
