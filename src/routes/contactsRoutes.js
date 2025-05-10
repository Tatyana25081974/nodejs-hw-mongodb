// src/routes/contactsRoutes.js

import express from 'express';
import { getAllContacts, getContactById } from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', getAllContacts); // GET /contacts
router.get('/:contactId', getContactById); // GET /contacts/:contactId

export default router;
