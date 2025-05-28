import { Router } from 'express';
import contactsRoutes from './contactsRoutes.js';
import authRouter from './auth.js';

const router = Router();
 
router.use('/contacts', contactsRoutes); 
router.use('/auth', authRouter);

export default router;
