
import express from 'express';
import productsController from '../controllers/productsController.js';
const router = express.Router();

router.get('/',productsController.getProductsAll); 
router.get('/:pid', productsController.getProduct);
router.post('/', productsController.createProduct);
router.put('/:pid', productsController.updateProduct);
router.delete('/:pid', productsController.deleteProduct);

export default router;