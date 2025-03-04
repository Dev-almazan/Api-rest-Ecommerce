import productsModel from "../models/products.js";
import cartsModel from "../models/cart.js";

class viewsController {

   async viewProducts(req,res){
           try {
        
                    //1- configuramos parametros de la paginacion
                    const { limit = 10, page = 1, sort  , query } = req.query;
                    const orden = sort == 'asc' ? 1 : -1; 
                    const options = { page: page, // page param
                        limit: limit, //limit param
                        sort: sort ? { price: orden } : {},
                        lean: true 
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
                         res.render("index",{
                             'docs': result.docs, 
                            'totalPages': result.totalPages,
                            'prevPage': result.prevPage,
                            'nextPage': result.nextPage,
                            'page': result.page,
                            'hasPrevPage': result.hasPrevPage,
                            'hasNextPage': result.hasNextPage,
                        }) 
                        
                    } else {
                        return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'No hay productos disponibles' }) 
                    }
                } catch (e) {
                    console.log(e)
                    return res.status(400).send({ 'status': 'error', 'message': e });
                }
        
    }

    async viewCart(req, res) {


        try {

            //2- Ejecutamos método que obtendra productos de acuerdo a los parametrosa de la paginacion
            const cartId = req.params.cid;
            let result = await cartsModel.findLean(cartId);// Ejecutamos método que obtendra  productos
            let productsInCart = result.products  
            console.log(result.products)
            if (productsInCart.length > 0) {
                res.render("cart", { productsInCart, cartId })

            } else {
                return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'No hay productos disponibles' })
            }
        } catch (e) {
            console.log(e)
            return res.status(400).send({ 'status': 'error', 'message': e });
        }

    }

    async viewProduct(req, res) {
        try {

            //1- configuramos parametros de la paginacion
            const { pid = 0 } = req.params;
            // Crear el filtro dinámicamente
            const filter = {};

            // Filtro por ID (si se proporciona `pid`)
            if (pid) {
                filter._id = pid; // Filtra por el campo `_id`
            }

            //2- Ejecutamos método que obtendra productos de acuerdo a los parametrosa de la paginacion
            let result = await productsModel.findAll(filter, {
                limit: 1,
                lean: true
            });
            
            if (result.docs.length > 0) {
                res.render("detail", {
                    'docs': result.docs
                })
                
            } else {
                return res.status(404).send({ 'status': 'error', 'results': 0, 'message': 'No hay productos disponibles' })
            }
        } catch (e) {
            console.log(e)
            return res.status(400).send({ 'status': 'error', 'message': e });
        }

    }

    viewProductsRealTime(req, res) {
        res.render("realTimeProducts");
    }

}

export default new viewsController();