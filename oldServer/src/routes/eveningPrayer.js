
import express from 'express';
import { create, findOne, update, deleteOne, findAll, bookSeat, cancelSeat, exportEveningPrayer, searchEveningPrayer } from '../controllers/events/eveningPrayer';

const router = express.Router();

router.get('/', findAll);
router.get('/search', searchEveningPrayer);
router.get('/date', findOne);
router.get('/:id', findOne);
router.post('', create);
router.delete('/:id', deleteOne);
router.put('/', update);
router.post('/bookseat', bookSeat);
router.post('/cancelSeat', cancelSeat);
// router.post('/export', exportEveningPrayer);
router.post('/:id/export', exportEveningPrayer);

export default router;