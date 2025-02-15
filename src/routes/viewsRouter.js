
import express from 'express';
import viewsController from '../controllers/viewsController.js';
const router = express.Router();

router.get('/products',viewsController.viewProducts); 
router.get('/', viewsController.viewProducts);
router.get('/realtimeproducts', viewsController.viewProductsRealTime);

export default router;