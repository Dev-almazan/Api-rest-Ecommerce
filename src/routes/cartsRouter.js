
import express from 'express';
import cartsController from '../controllers/cartsController.js';
const router = express.Router();

router.get('/:cid', cartsController.getCart);
router.post('/',cartsController.createCart);
router.post('/:cid/product/:pid',cartsController.createProductCart);

export default router;