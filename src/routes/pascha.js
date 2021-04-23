
import express from 'express';
import { create, findOne, update, deleteOne, findAll, bookSeat, cancelSeat, exportPascha, searchPascha } from '../controllers/events/pascha';

const router = express.Router();

router.get('/', findAll);
router.get('/search', searchPascha);
router.get('/date', findOne);
router.get('/:id', findOne);
router.post('', create);
router.delete('/:id', deleteOne);
router.put('/', update);
router.post('/bookseat', bookSeat);
router.post('/cancelSeat', cancelSeat);
// router.post('/export', exportPascha);
router.post('/:id/export', exportPascha);

export default router;