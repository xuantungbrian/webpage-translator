import express from 'express';
const router = express.Router();

import translatorController from '../controllers/translatorController.js';

router.get('/:bookId/:chapterId', translatorController.translateChapter);

export default router;