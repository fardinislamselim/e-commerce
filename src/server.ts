import { createServer, Server } from 'http';
import colors from 'colors';
import prisma from '@app/utils/prisma.js';
import config from '@app/config/index.js';
import app from 'app.js';



let server: Server;
const socketServer = createServer(app);

async function main() {
  await prisma.$connect()
  console.log(colors.italic.green.bold("Connected to database"));

  try {
    server = app.listen(Number(config.port), config.ip as string, () => {
      console.log(
        colors.italic.green.bold(
          `🚀 Server is running on http://${config.ip}:${config.port}`,
        ),
      );
    });
  } catch (err) {
    await prisma.$disconnect()
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', err => {
  console.log(`😈 unhandledRejection detected, shutting down...`, err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException detected, shutting down...`);
  process.exit(1);
});