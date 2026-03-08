import { createApp } from '../../lib/create-app';
import {
  createUserHandler,
  getUserByIdHandler,
  listUsersHandler,
} from './users.handlers';
import {
  createUserRoute,
  getUserByIdRoute,
  listUsersRoute,
} from './users.routes';

const usersRouter = createApp();

usersRouter.openapi(listUsersRoute, listUsersHandler);
usersRouter.openapi(getUserByIdRoute, getUserByIdHandler);
usersRouter.openapi(createUserRoute, createUserHandler);

export default usersRouter;
