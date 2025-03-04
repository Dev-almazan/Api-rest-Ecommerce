import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

class cartsModel {
    constructor(collection) {
        this.uri = process.env.DB_URI || "mongodb+srv://devAlmazan:qZ8QK!B4Q-!f4vp@cluster0.hzkvq.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";
        this.db = null;
        this.schema = new mongoose.Schema({
            id: { type: Number , default  : 0 },
            products: [{
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }, // Referencia al modelo products
                quantity: { type: Number, required: true },
            }]
        });
        
        // Añadir un middleware para autoincrementar el id
        this.schema.pre('save', async function (next) {
            if (this.isNew) { // Solo se ejecuta si el documento es nuevo
                const lastProduct = await mongoose.model(collection).findOne().sort({ id: -1 }).exec();
                if (lastProduct) {
                    this.id = lastProduct.id + 1;
                } else {
                    this.id = 1; // Si no hay documentos, empezar desde 1
                }
            }
            next();
        });

        this.schema.plugin(paginate);
        this.execute = mongoose.model(collection,this.schema);
        this.connect();
    }

    async connect() {
        console.log('Conectando...');
        try {
            this.db = await mongoose.connect(this.uri);
            if (this.db) {
                console.log('Conectado a MongoDB');
            }
        } catch (err) {
            console.error(err);
            this.db = false;
            return false;
        }
    }

    async insert(data) {
        try {
            const result = await new this.execute(data).save();
            if (result) {
                return result;
            } else {
                throw new Error('No se pudo almacenar el carrito');
            }
        } catch (err) {
            throw new Error('Error al ejecutar insert');
        }
    }

    async findAll(filter,options) {
        try {
            const result = await this.execute.paginate(filter,options);
            if (result) {
                return result;
            } else {
                throw new Error('Error al obtener los productos');
            }
        } catch (err) {
            
            throw new Error('Error al ejecutar findAll');
        }
    }

    async find(id) {
        try {
            const result = await this.execute.findOne({ 'id': id }).populate('products.product')
            if (result) {
                return result;
            } else {
              
                throw new Error('Error al obtener producto');
            }
        } catch (err) {
          
            throw new Error('Error al ejecutar find');
        }
    }

    async findLean(id) {
        try {
            const result = await this.execute.findOne({ 'id': id }).populate('products.product').lean()
            if (result) {
                return result;
            } else {

                throw new Error('Error al obtener producto');
            }
        } catch (err) {

            throw new Error('Error al ejecutar find');
        }
    }

    async insertProductINCart(cartId,data) {

        try {

                const resultado = await this.execute.findByIdAndUpdate(
                    cartId, // ID del documento
                    { $push: { "products": data } }// Agregar un producto al carrito
                );
                return resultado
           
        } catch (err) {
            // Manejar errores específicos
            if (err.name === 'ValidationError') {
                console.log(err.message)
            } else {
                console.log(err)
            }
            return err;
        }

    }

    async updateProduct(cartId,productId,quantity) {
    try {
        const resultado = await this.execute.findOneAndUpdate(
            { _id: cartId, "products.product": productId }, // Filtra por el ID del carrito y el ID del producto
            {
                $set: {
                    "products.$.quantity": quantity, // Actualiza el producto coincidente con los datos proporcionados
                },
            },
            { new: true }
        );
        return resultado;
    } catch (error) {
        // Manejar errores específicos
        if (error.name === 'ValidationError') {
            console.log(error.message)
        } else {
            console.log(error)
        }
        return error;
    }
}

    async deleteProductInCart(cartId, productId) {
        try {
            const resultado = await this.execute.findOneAndUpdate(
                { _id: cartId },
                { $pull: { products: { product: productId } } },
                { new: true }
            );
            return resultado;
        } catch (error) {
            // Manejar errores específicos
            if (error.name === 'ValidationError') {
                console.log(error.message)
            } else {
                console.log(error)
            }
            return error;
        }
    }

    async emptyCart(cartId) {
        try {
            const resultado = await this.execute.findOneAndUpdate(
                { _id: cartId },
                { $set: { products: [] } },
                { new: true }
            );
            return resultado;
        } catch (error) {
            // Manejar errores específicos
            if (error.name === 'ValidationError') {
                console.log(error.message)
            } else {
                console.log(error)
            }
            return error;
        }
    }


    async delete(id) {
        try {
            const result = await this.execute.deleteOne({ 'id': id });
            if (result) {
                return result;
            }
            else {
                throw new Error('Error al eliminar el producto');
            } 
        } catch (err) {
            
            throw new Error('Error al ejecutar delete');
        }
    }

    async update(id,updateData) {
        try {
            const update = await this.execute.findByIdAndUpdate(
                id,
                updateData,
                { new: true, }
            );

            if (update) {
                return update;
            } else {
                throw new Error('Error al buscar producto');
            }
        } catch (err) {

            throw new Error('Error al ejecutar update');
        }
    }


}

export default new cartsModel('carts');