import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import CategoryController from './app/controllers/CategoryController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Auth routes
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Categories (public)
routes.get('/categories', CategoryController.index);

// TODO admin middleware

routes.post('/categories', CategoryController.store);

export default routes;
