
import express from 'express';
import { create,findOne, update,deleteOne,findAll,bookSeat, cancelSeat } from '../controllers/events/holymass';

const router = express.Router();

router.get('/', findAll);
router.get('/:id', findOne);
router.post('', create); 
router.delete('/:id', deleteOne);
router.put('/', update);
router.post('/bookseat', bookSeat);
router.delete('/cancelbook/:holymassId/:churchMemberId', cancelSeat);

export default router;