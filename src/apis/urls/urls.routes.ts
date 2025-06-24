import express from 'express';

const router = express.Router();

import { shorten, redirect, deleteUrl } from './urls.controllers';

router.post('/shorten/:userId', shorten);
router.get('/:code', redirect);
router.delete('/:code', deleteUrl);

export default router;