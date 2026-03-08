import { cors } from 'hono/cors';
import { configureOpenAPI } from './lib/configure-open-api';
import { createApp } from './lib/create-app';
import { openauthMiddleware } from './middlewares/openauth';
import indexRouter from './routes/index.route';
import usersRouter from './routes/users/users.index';

const app = createApp();

configureOpenAPI(app);
app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);
app.use('/api/*', openauthMiddleware);

app.route('/', indexRouter);
app.route('/api', usersRouter);

export { app };
