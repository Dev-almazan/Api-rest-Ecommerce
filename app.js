
import express from 'express';
import http from "http";
import { Server } from "socket.io";
import { engine }   from 'express-handlebars'; 
import WebS from './src/websocket/productsWebsocket.js';
import productsRouter from './src/routes/productsRouter.js';
import cartsRouter from './src/routes/cartsRouter.js';
import viewsRouter from './src/routes/viewsRouter.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.json());
app.use(express.static("./public"));

// Configuramos Handlebars 
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Montamos enrutadores cliente
app.use('/',viewsRouter);

//Montamos enrutadores servidor 
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);


//Mandamos a llamar WebSocket
WebS.products(io);

// Iniciamos el servidor en el puerto especificado en la configuración
server.listen(8080,() => {
  console.log(`Servicio habilitado en puerto: 8080`)
})

