import { Router } from 'express';
import transactionsRouter from './transactions.routes';
import usersRouter from './users.routes';
import categoriesRouter from './categories.routes';
import sessionsRouter from './sessions.routes';

const routes = Router();

routes.use('/transactions', transactionsRouter);
routes.use('/users', usersRouter);
routes.use('/categories', categoriesRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
