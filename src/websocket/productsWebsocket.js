


class WebS{
    
    products = (io) => { // Recibe el objeto io como argumento
        io.on('connection', socket => {
            console.log('¡Nuevo cliente conectado!');

            // Eventos del cliente
            socket.on('deleteData', (id) => {
                console.log('Se va a eliminar el mensaje:', id);
                fetch('http://localhost:8080/api/products/' + id, { method: 'DELETE' })
                    .then(reponse => {
                        if(reponse.status == 200)
                        {
                            io.emit('productoEliminado', 'ok');
                        } 
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                
            });

            socket.on('postData', (datos) => {
                
                fetch('http://localhost:8080/api/products/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Indica que el cuerpo de la petición es JSON
                    },
                    body: JSON.stringify(datos) // Convierte el objeto a JSON
                })
                    .then(reponse => {
                        if (reponse.status == 200) {
                            io.emit('productoCreado', 'ok');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

            });

            socket.on('getData', () => {
                const getProducts = async () => {
                    let response = await fetch('http://localhost:8080/api/products/')
                    let values = await response.json();
                    if (values.results > 0) {
                        io.emit('renderInterfaz', values.playload);
                    }
                }
                getProducts();
            });

           
        });  
}

}


export default new WebS();