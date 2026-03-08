import { createApp } from '../../lib/create-app';
import {
  createUserHandler,
  getUserByIdHandler,
  getUserMeHandler,
  listUsersHandler,
} from './users.handlers';
import {
  createUserRoute,
  getUserByIdRoute,
  getUserMeRoute,
  listUsersRoute,
} from './users.routes';

const usersRouter = createApp();

usersRouter.openapi(listUsersRoute, listUsersHandler);
usersRouter.openapi(getUserMeRoute, getUserMeHandler);
usersRouter.openapi(getUserByIdRoute, getUserByIdHandler);
usersRouter.openapi(createUserRoute, createUserHandler);

export default usersRouter;
