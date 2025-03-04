


import productsModel from "../models/products.js";
import cartsModel from "../models/cart.js";

class cartsController {


       async createCart(req, res) {

                    try {
                        const { products = [] } = req.body;
                        let result = await cartsModel.insert(products);// Ejecutamos el método que guardará el producto
                        if (result) {
                            return res.status(201).send({ 'status': 'success', 'message': 'Se añadió un nuevo carrito' });
                        } else {
                            return res.status(400).send({ 'status': 'error', 'message': 'Hubo un problema al añadir el carrito' });
                        }
                    } catch (e) {
                        console.log(e)
                        return res.status(400).send({ 'status': 'error', 'message': e });
                    }
    }


    async createProductCart(req, res) {
        
        try {
            const { pid, cid } = req.params;
            //buscamos el producto por su id
            let product = await productsModel.find(pid); 
            if (!product) {
                return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'Producto no encontrado' })
            }
            //buscamos el carrito por su id
            let cart = await cartsModel.find(cid); 
            if (!cart) {
                return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'No existe el id de carrito' })
            }

                let carData = cart.products;
                //buscamos si el carrito contiene el producto
            let searchProduct = carData.length > 0 ? carData.filter(result => result.product.id == pid || result.product._id == pid) : []
                if (searchProduct.length > 0) // si existe el producto actualizar cantidad
                {
                    let result = await cartsModel.updateProduct(cart._id,product._id,searchProduct[0].quantity + 1);
                    if (!result) {
                      
                        return res.status(400).send({ 'status': 'error', 'message': 'Hubo un problema al actualizar cantidad del producto en el carrito' });
                    }
                    return res.status(201).send({ 'status': 'success', 'message': 'Se actualizo cantidad del producto en el carrito' });
                }
                else //si no existe agregar al carrito
                {
                    let result = await cartsModel.insertProductINCart(cart._id, {
                        "product": product._id,
                        "quantity": 1
                    });// Ejecutamos el método que guardará el producto
                    if (!result) {
                        return res.status(400).send({ 'status': 'error', 'message': 'Hubo un problema al añadir el producto en el carrito' });
                    }
                    return res.status(201).send({ 'status': 'success', 'message': 'Se añadió un nuevo producto al carrito' });
                }
           
        } catch (e) {
            console.log(e)
            return res.status(400).send({ 'status': 'error', 'message': e });
        }

    }

    async deleteProductCart(req, res) {

        try {
            const { pid, cid } = req.params;

            //buscamos el carrito por su id
            let cart = await cartsModel.find(cid);
            if (!cart) {
                return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'Carrito no encontrado' })
            }

            //buscamos el producto por su id
            let product = await productsModel.find(pid);
            if (!product) {
                return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'Producto no encontrado' })
            }

            let carData = cart.products;
            //buscamos si el producto esta en el carrito
            let searchProduct = carData.length > 0 ? carData.filter(result => result.product.id == pid) : []
            if (searchProduct.length > 0) // si existe el producto 
            {
                //ejecutamos metodo que eliminara producto del carrito
                let result = await cartsModel.deleteProductInCart(cart._id,product._id);
                if (!result) {
                    return res.status(400).send({ 'status': 'error', 'message': 'Hubo un problema al eliminar el producto del carrito' });
                }
                return res.status(200).send({ 'status': 'success', 'message': 'Se elimino producto del carrito' });
            }
            else{
                return res.status(400).send({ 'status': 'error', 'message': 'No existe el producto en el carrito' });   
            }
        
        } catch (e) {
            console.log(e)
            return res.status(400).send({ 'status': 'error', 'message': e });
        }

    }

    async updateProductCart(req, res) {

        //validamos que la solicitud contenga parametro quantity
        const quantity = req.body.quantity
        if (!req.body || typeof quantity  === 'undefined') {
            return res.status(400).send({ 'status': 'error', 'message': 'Favor de incluir la propiedad quantity en el cuerpo de la solicitud.' });
        }

        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).send({ 'status': 'error', 'message': 'La propiedad quantity debe ser un número mayor que cero.' });
        }

        try {
            const { pid, cid } = req.params;

            //buscamos el carrito por su id
            let cart = await cartsModel.find(cid);
            if (!cart) {
                return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'Carrito no encontrado' })
            }

            //buscamos el producto por su id
            let product = await productsModel.find(pid);
            if (!product) {
                return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'Producto no encontrado' })
            }

            let carData = cart.products;
            //buscamos si el producto esta en el carrito
            let searchProduct = carData.length > 0 ? carData.filter(result => result.product.id == pid) : []
            if (searchProduct.length > 0) // si existe el producto 
            {
                
                //procedemos actualizar la cantidad del producto en el carrrito
                let result = await cartsModel.updateProduct(cart._id, product._id,quantity);
                if (!result) {

                    return res.status(400).send({ 'status': 'error', 'message': 'Hubo un problema al actualizar cantidad del producto en el carrito' });
                }
                return res.status(201).send({ 'status': 'success', 'message': 'Se actualizo cantidad del producto en el carrito' });
            }
            else {
                return res.status(400).send({ 'status': 'error', 'message': 'No existe el producto en el carrito' });
            }

        } catch (e) {
            console.log(e)
            return res.status(400).send({ 'status': 'error', 'message': e });
        }

    }

    async emptyCart(req, res) {

        try {
            const { cid } = req.params;
            //buscamos el carrito por su id
            let cart = await cartsModel.find(cid);
            if (!cart) {
                return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'Carrito no encontrado' })
            }
            //buscamos si el carrito cuenta con productos
            if (cart.products.length > 0) // si existen productos
            {
                //ejecutamos metodo que vaciara el carrito
                let result = await cartsModel.emptyCart(cart._id);
                if (!result) {
                    return res.status(400).send({ 'status': 'error', 'message': 'Hubo un problema al vaciar el  carrito' });
                }
                return res.status(200).send({ 'status': 'success', 'message': 'Se eliminaron productos del carrito' });
            }
            else {
                return res.status(400).send({ 'status': 'error', 'message': 'El carrito se encuentra vacio' });
            }

        } catch (e) {
            console.log(e)
            return res.status(400).send({ 'status': 'error', 'message': e });
        }

    }

    async getCart(req,res){
        try {
            const cartId = req.params.cid;
            let result = await cartsModel.find(cartId);// Ejecutamos método que obtendra  productos
            if (result) {
                return res.status(200).send({ 'status': 'success', 'playload': [result] })
            } 
        } catch (e) {
            console.log(e)
            return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'No se encontro producto' })
        }
    }

}

export default new cartsController();