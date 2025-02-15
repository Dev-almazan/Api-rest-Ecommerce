

import fileManager from "../manager/filesManager.js";
import Products from "../utils/products.js";

class productsController {

     getProductsAll(req,res){
        const data =  fileManager.readFileJson('./src/data/products.json',res); 
        data.length > 0 ? 
        res.status(200).send({ 'status': 'success', 'results': data.length, 'data': data }) :
        res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'No hay productos disponibles' })  
    }

     getProduct(req,res){
        const productId = req.params.pid  ;
        const data =  fileManager.readFileJson('./src/data/products.json', res); 
        const dataFilter = data.filter(result => result.id == productId )
        if(dataFilter.length > 0)
        {
            res.status(200).send({ 'status': 'success', 'results': 1, 'data': [dataFilter[0]] })  
        }
            res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'Producto no encontrado' })  
    }


     createProduct(req, res) {
        //validamos la solicitud
        if (Object.keys(req.body).length !== 0) {
            //desestructuramos cuerpo de la solicitud
            const { title = '',description = '',code = '',price = 0,status = true,stock = 0,category = '', thumbnail = []  } = req.body;
            let data =  fileManager.readFileJson('./src/data/products.json', res); //obtenemos los datos del archivo
            const producto = new Products(Products.getNextId(data), title, description, code, price, status, stock, category, thumbnail); //creamos un nuevo objeto producto con su id autoincremntal
            data.push(producto) //agregamos nuevo producto al array que contiene los productos del archivo
            if ( fileManager.writeFilesJson('./src/data/products.json', JSON.stringify(data, null, 2),res)) //ejecutamos metodo que sobrescribira el archivo con los productosActualizadosz m{}
            {
                res.status(201).send({ 'status': 'success', 'message': 'Producto Agregado Correctamente' })
            }
        }
        res.status(404).send({ 'status': 'error', 'message': 'Favor de completar propiedades del producto' })
    }


    updateProduct(req, res) {
        const productId = req.params.pid;
        const data = fileManager.readFileJson('./src/data/products.json', res);   //obtenemos los datos del archivo
        const valorBuscado = data.filter(result => result.id == productId); //validamos si existe el Idproducto 
        if (valorBuscado.length > 0) {
            if (Object.keys(req.body).length !== 0) {
                //desestructuramos cuerpo de la solicitud
                const { title = '', description = '', code = '', price = 0, status = true, stock = 0, category = '', thumbnail = [] } = req.body;
                let dataActualizada = data.filter(result => result.id !== valorBuscado[0].id); //buscamos los productos sin contemplar el id
                const producto = new Products(valorBuscado[0].id, title, description, code, price, status, stock, category, thumbnail); //creamos un nuevo objeto producto con las propi
                dataActualizada.push(producto) //agregamos nuevo producto al array que contiene los productos del archivo
                if (fileManager.writeFilesJson('./src/data/products.json', JSON.stringify(dataActualizada, null, 2), res)) //ejecutamos metodo que sobrescribira el archivo con los productosActualizadosz m{}
                {
                    res.status(201).send({ 'status': 'success', 'message': 'Producto Actualizado Correctamente' })
                }
            }
            res.status(404).send({ 'status': 'error', 'message': 'Favor de completar propiedades del producto' })
            
        }
        res.status(404).send({ 'status': 'error', 'message': 'Producto no encontrado' })
    }


    deleteProduct(req, res) {
        const productId = req.params.pid;
        const data = fileManager.readFileJson('./src/data/products.json', res);   //obtenemos los datos del archivo
        const valorBuscado = data.filter(result => result.id == productId); //validamos si existe el producto 
        if (valorBuscado.length > 0) {
            const dataActualizada = data.filter(result => result.id !== valorBuscado[0].id); //buscamos los productos sin contemplar el id
            const productosActualizados = JSON.stringify(dataActualizada, null, 2); // damos el formato requerido
            if (fileManager.writeFilesJson('./src/data/products.json', productosActualizados, res)) //ejecutamos metodo que sobrescribira el archivo con los productosActualizadosz m{}
            {
               return res.status(200).send({ 'status': 'error', 'message': 'Producto Eliminado Correctamente' })
            }
        }
        return res.status(404).send({ 'status': 'error', 'message': 'Producto no encontrado' })
    }

}

export default new productsController();