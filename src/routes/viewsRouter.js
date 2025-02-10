
import express from 'express';
import viewsController from '../controllers/viewsController.js';
const router = express.Router();

router.get('/products/',viewsController.viewProducts); 

export default router;