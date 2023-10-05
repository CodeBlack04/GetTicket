import express from 'express';

import { currentuser } from '@cbgetticket/common';
import { requireAuth } from '@cbgetticket/common';

const router = express.Router();

router.get('/api/users/currentuser', currentuser, async (req, res) => {
    res.send({ currentuser: req.currentuser || null })
})

export { router as currentuserRouter };