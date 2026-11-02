import { Router } from 'express';
import userRoutes from 'modules/user/users.routes.js';

const router: ReturnType<typeof Router> = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;