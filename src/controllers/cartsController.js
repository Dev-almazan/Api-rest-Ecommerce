

import fileManager from "../manager/filesManager.js";
import carts from "../utils/carts.js";

class cartsController {


        createCart(req, res) {
        //validamos la solicitud
        if (Object.keys(req.body).length !== 0) {
            //desestructuramos cuerpo de la solicitud
            const { products = []  } = req.body;
            let data =  fileManager.readFileJson('./src/data/carts.json', res); //obtenemos los datos del archivo
            const producto = new carts(carts.getNextId(data),products); //creamos un nuevo objeto producto con su id autoincremntal
            data.push(producto) //agregamos nuevo producto al array que contiene los productos del archivo
            if (fileManager.writeFilesJson('./src/data/carts.json', JSON.stringify(data, null, 2),res)) //ejecutamos metodo que sobrescribira el archivo con los productosActualizadosz m{}
            {
                res.status(201).send({ 'status': 'success', 'message': 'Carrito añadido correctamente' })
            }
        }
        res.status(404).send({ 'status': 'error', 'message': 'Favor de completar propiedades del producto' })
    }


    createProductCart(req, res) {
        const { pid , cid } = req.params  ;
        const carts =  fileManager.readFileJson('./src/data/carts.json', res); 
        let cart = carts.filter(result => result.id == cid)//buscamos el carrito por su id
        if (cart.length > 0) // si existe el carrito
        {
            //procedemos a traernos los productos para compararlos contra el id del producto
            const products =  fileManager.readFileJson('./src/data/products.json', res); 
            const product = products.filter(result => result.id == pid ) //buscamos que el id de producto este dado de alta para obtener su id
            if (product.length > 0) // si encontro el id del producto entonces procedemos a buscar ese id dentro del cart products
            {
                let productInCart = cart[0].products.find(result => result.id == pid);  // Verificamos si se encontró el producto en el carrito
                productInCart ? productInCart.quantity++ : cart[0].products.push({ "id": product[0].id, "quantity": 1 });  // si existe incrementar la cantidad si no agregar 1
                 
                if(fileManager.writeFilesJson('./src/data/carts.json', JSON.stringify(carts, null, 2), res)) //ejecutamos metodo que sobrescribira el archivo con los productosActualizadosz m{}
                {
                    res.status(201).send({ 'status': 'success', 'message': 'Producto añadido correctamente al carrito' })
                } 
            }
                res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'Producto no encontrado' })  
        }
        res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'Cart no encontrado'})  
    }

    getCart(req,res){
        const cartId = req.params.cid  ;
        const data =  fileManager.readFileJson('./src/data/carts.json', res); 
        const dataFilter = data.filter(result => result.id == cartId )
        if(dataFilter.length > 0)
        {
            res.status(200).send({ "products": dataFilter[0].products } )  
        }
        res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'Cart no encontrado' })  
    }


}

export default new cartsController();