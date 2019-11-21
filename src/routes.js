import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import CategoryController from './app/controllers/CategoryController';
import ProductController from './app/controllers/ProductController';
import OrderController from './app/controllers/OrderController';
import RoleController from './app/controllers/RoleController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';

const routes = new Router();

// Auth routes (guest)
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Public routes (signed)
routes.get('/categories', CategoryController.index);
routes.get('/products', ProductController.index);

routes.get('/users/:id/role', RoleController.show);

routes.get('/orders', adminMiddleware.isAdmin, OrderController.index);
routes.post('/orders', OrderController.store);
routes.get('/orders/count', OrderController.getTotalCount);

routes.post('/products/search', ProductController.search);


// admin middleware

routes.use(adminMiddleware.adminOnly);

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.put('/users/:id', UserController.update);

routes.post('/categories', CategoryController.store);
routes.post('/products', ProductController.store);

// Order
routes.put('/orders/:id', OrderController.update);

export default routes;
