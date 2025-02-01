
import express from 'express';
import productsRouter from './src/routes/productsRouter.js';
import cartsRouter from './src/routes/cartsRouter.js';
const app = express();
app.use(express.json());


// Montamos enrutadores
app.use('/api/products',productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciamos el servidor en el puerto especificado en la configuración
app.listen(8080, () => {
  console.log(`Servicio habilitado en puerto: 8080`)
})

