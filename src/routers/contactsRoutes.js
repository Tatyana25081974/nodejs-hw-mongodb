// src/routes/contactsRoutes.js

import express from 'express';
import { getAllContacts, getContactById, createContactController, updateContactController, deleteContactController } from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidID } from '../middlewares/isValidID.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
    createContactSchema,
    updateContactSchema
  } from '../validation/contactsSchema.js';


const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getAllContacts)); // GET /contacts
router.get('/:contactId',isValidID,ctrlWrapper(getContactById)); // GET /contacts/:contactId
router.post('/',jsonParser,validateBody(createContactSchema), ctrlWrapper(createContactController));//POST/contacts
router.patch('/:contactId',isValidID,jsonParser,validateBody(updateContactSchema), ctrlWrapper(updateContactController));
router.delete('/:contactId',isValidID, ctrlWrapper(deleteContactController));
export default router;
