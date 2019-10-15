import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import CategoryController from './app/controllers/CategoryController';
import ProductController from './app/controllers/ProductController';
import OrderController from './app/controllers/OrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Auth routes (guest)
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Public routes (signed)
routes.get('/categories', CategoryController.index);
routes.get('/products', ProductController.index);

// TODO admin middleware
routes.post('/categories', CategoryController.store);
routes.post('/products', ProductController.store);

// Order
routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.get('/orders/count', OrderController.getTotalCount);

export default routes;
