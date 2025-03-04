

import productsModel from "../models/products.js";
class productsController {

    async createProduct(req, res) {
        if (Object.keys(req.body).length === 0) // Validamos la solicitud
        {
            return res.status(404).send({ 'status': 'error', 'message': 'Favor de completar propiedades del producto' });
        }
        try {
            const data = req.body;
            let result = await productsModel.insert(data);// Ejecutamos el método que guardará el producto
            if (result) {
                return res.status(201).send({ 'status': 'success', 'message': 'Se añadió un nuevo producto' });
            } else {
                return res.status(400).send({ 'status': 'error', 'message': 'Hubo un problema al añadir el producto' });
            }
        } catch (e) {
            console.log(e)
            return res.status(400).send({ 'status': 'error', 'message': e });
        }
    }


    async getProductsAll(req,res){
        try {

            //1- configuramos parametros de la paginacion
            const { limit = 10, page = 1, sort  , query } = req.query;
            const orden = sort == 'asc' ? 1 : -1; 
            const options = { page: page, // page param
                limit: limit, //limit param
                sort: sort ? { price: orden } : {} // si existe el parametro sort ordenar por price
            };
            // Filtro por categoria o stock
            const filter = query ? {
                $or: [
                    { category: query }, // Filtro por categoría
                    { status: query === 'true' ? true : query === 'false' ? false : null } // Filtro por status
                ]
            } : {};
            //2- Ejecutamos método que obtendra productos de acuerdo a los parametrosa de la paginacion
            let result = await productsModel.findAll(filter,options);
            if (result.docs.length > 0) {
                const url = req.protocol + '://' + req.get('host') + '/api/products/';
                return res.status(200).send({
                    'status': 'success', 'results': result.docs.length, 'playload': result.docs, 
                    'totalPages': result.totalPages,
                    'prevPage': result.prevPage,
                    'nextPage': result.nextPage,
                    'page': result.page,
                    'hasPrevPage': result.hasPrevPage,
                    'hasNextPage': result.hasNextPage,
                    'prevLink': result.prevPage ? `${url}?page=${result.prevPage}` : null,
                    'nextLink': result.nextPage  ? `${url}?page=${result.nextPage}` : null
                }) 
            } else {
                return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'No hay productos disponibles' }) 
            }
        } catch (e) {
            console.log(e)
            return res.status(400).send({ 'status': 'error', 'message': e });
        }
    }

    async getProduct(req,res){
        try {
            const productId = req.params.pid;
            let result = await productsModel.find(productId);// Ejecutamos método que obtendra  productos
            if (!result) {
                return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'Producto no encontrado' })
            } 
            return res.status(200).send({ 'status': 'success', 'playload': result })
        } catch (e) {
            console.log(e)
            return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'No se encontro producto' })
        }
    }


    async updateProduct(req, res) {
        try {
            const productId = req.params.pid;
            let search = await productsModel.find(productId);// Ejecutamos método que busca el producto 
            const id_product = search._id.toString(); //obtenemos el id del product
            if (search) //si encuentra el producto
            {
                if (Object.keys(req.body).length === 0) // Validamos que el body no venga vacio
                {
                    return res.status(404).send({ 'status': 'error', 'message': 'Favor de completar propiedades del producto' });
                }
                const data = req.body;
                let result = await productsModel.update(id_product,data)  //procedemos a actualizar propiedades del producto
                if (result) {
                    return res.status(200).send({ 'status': 'success', 'message': 'El producto ha sido actualizado' })
                } else {
                    return res.status(400).send({ 'status': 'error', 'results': 0, 'message': 'Hubo un problema al actualizar el producto' })
                }
            }
        } catch (e) {
          
            return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'No se encontro producto' })
        }
    }


   async deleteProduct(req, res) {
        try {
            const productId = req.params.pid;
            let result = await productsModel.delete(productId);// Ejecutamos método que eliminara productos
            if (result.deletedCount === 0) {
                return res.status(404).send({ 'status': 'success', 'message': 'Error al eliminar producto : Validar ID','results': result.length, 'data': result })
            }
            else{
                return res.status(200).send({ 'status': 'success', 'message': 'Producto eliminado Correctamente', 'results': result.length, 'data': result })
            }
        } catch (e) {
            console.log(e)
            return res.status(404).send({ 'status': 'error', 'results': 0, 'message': e })
        }
    }

}

export default new productsController();