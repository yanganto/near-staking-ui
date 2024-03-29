import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { routes } from './routes/collector.routes.js';
import './helpers/syncedCron.js';
import './helpers/passport.js';

process.env.TZ = 'Etc/Universal';
mongoose.set('strictQuery', false);
await mongoose.connect(process.env.MONGO);

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.static(path.dirname(fileURLToPath(import.meta.url)) + '/../public')
);
routes(app);

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});

process.on('uncaughtException', (error, origin) => {
  console.log('----- Uncaught exception -----');
  console.log(error);
  console.log('----- Exception origin -----');
  console.log(origin);

  if (
    error.file === 'postgres.c' ||
    error.message.includes('Connection terminated unexpectedly') ||
    error.code === '08P01' || //server conn crashed
    (error.message.includes(
      "Cannot read properties of null (reading 'name')"
    ) &&
      error.stack.includes('/pg/lib/client.js:380:26'))
  )
    console.log('uncaught Exception');
  else process.exit(1);
});
