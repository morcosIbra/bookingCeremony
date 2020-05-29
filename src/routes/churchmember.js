import express from 'express';
import {findOne} from '../controllers/events/churchmember';

const router = express.Router();

router.get('/:id', findOne);

export default router;