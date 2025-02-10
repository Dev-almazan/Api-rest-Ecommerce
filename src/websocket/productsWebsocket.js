import http from "http";
import { Server } from "socket.io";


const server = http.createServer(app); // Usamos un server 
const io = new Server(server); // creamos un webSocket




