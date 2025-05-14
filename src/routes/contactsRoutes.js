// src/routes/contactsRoutes.js

import express from 'express';
import { getAllContacts, getContactById, createContactController, updateContactController, deleteContactController } from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContacts)); // GET /contacts
router.get('/:contactId', ctrlWrapper(getContactById)); // GET /contacts/:contactId
router.post('/', ctrlWrapper(createContactController));//POST/contacts
router.patch('/:contactId', ctrlWrapper(updateContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactController));
export default router;
