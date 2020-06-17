import express from 'express';
const churchmember = require('../controllers/events/churchmember');


const router = express.Router();

router.get('/:id', churchmember.findOne);
router.delete('/:id', churchmember.delete);

export default router;