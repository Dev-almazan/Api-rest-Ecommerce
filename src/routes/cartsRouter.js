
import express from 'express';
import cartsController from '../controllers/cartsController.js';
const router = express.Router();

router.get('/:cid', cartsController.getCart);
router.post('/',cartsController.createCart);
router.post('/:cid/product/:pid',cartsController.createProductCart);
//router.put('/:cid/'); Se actualiza el esquema en mongosee para que por default le genere el array de products al crear un cart
router.put('/:cid/product/:pid', cartsController.updateProductCart);
router.delete('/:cid/product/:pid',cartsController.deleteProductCart);
router.delete('/:cid',cartsController.emptyCart);

export default router;