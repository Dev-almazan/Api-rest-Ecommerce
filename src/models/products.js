import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

class productsModel {
    constructor(collection) {
        this.uri = process.env.DB_URI || "mongodb+srv://devAlmazan:qZ8QK!B4Q-!f4vp@cluster0.hzkvq.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";
        this.db = null;
        this.schema = new mongoose.Schema({
            id: { type: Number , default  : 0 },
            title: { type: String },
            description: { type: String },
            code: { type: String },
            price: { type: Number }, 
            stock : { type: Number },
            status: { type: Boolean, default: true },
            category: { type: String },
            thumbnail: { type: Array, required: false }
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
                throw new Error('No se pudo guardar el producto');
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

  

    async find(idC) {
        try {
            let query;

            if (mongoose.Types.ObjectId.isValid(idC)) {
                // Si es un ObjectId válido, busca por _id
                query = { _id: new mongoose.Types.ObjectId(idC) };
            } else {
                // Si no es un ObjectId válido, busca por id
                query = { id: idC };
            }
            // Ejecutar la consulta
            const result = await this.execute.findOne(query);
            return result;
        } catch (err) {
            throw new Error('Error al ejecutar find product');
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

export default new productsModel('products');

