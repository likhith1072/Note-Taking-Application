import express from 'express';
import { verifyToken } from '../utils/verifyUser';
import {
    create,
    getnote,
    getnotes,
    deletenote,
    updatenote
} from '../controllers/note.controller';


const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getnotes', verifyToken, getnotes);
router.get('/getnote/:noteId', verifyToken, getnote);
router.delete('/deletenote/:noteId', verifyToken, deletenote);
router.put('/updatenote/:noteId', verifyToken, updatenote);

export default router;