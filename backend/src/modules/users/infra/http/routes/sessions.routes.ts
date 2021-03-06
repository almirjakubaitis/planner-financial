import { Router } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
// removido pela injeção de dependência
// import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  // removido pela injeção de dependência
  // const usersRepository = new UsersRepository();

  const { email, password } = request.body;

  const authenticateUser = container.resolve(AuthenticateUserService);

  // removido pela injeção de dependência
  // new AuthenticateUserService(usersRepository);

  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
