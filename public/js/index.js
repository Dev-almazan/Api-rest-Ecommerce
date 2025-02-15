const socket = io();

socket.on('connect', () => {
    console.log('Conectado al servidor');
    socket.emit('getData');
});

socket.on('productoEliminado', (data) => {
  socket.emit('getData');
});

socket.on('productoCreado', (data) => {
  socket.emit('getData');
  
});

socket.on('renderInterfaz', (data) => {
  renderProducts(data);
});


const eliminarProducto=(id)=>
{
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    socket.emit('deleteData', id); 
  }
}


const renderProducts = (values) => {
  const resultsContainer = document.getElementById('products')
  resultsContainer.innerHTML = ''; 
    values.forEach(item => {

      const itemHTML = `
                        <div class="col-lg-3 col-md-6 mt-4">
                            <div class="tarjetas card shadow p-3 bg-body rounded" style="min-height:25rem;">
                                 <img class="card-img-top" src="${item.thumbnail && Array.isArray(item.thumbnail) && item.thumbnail.length > 0 ? item.thumbnail[0] : 'https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'}">
                                <div class="card-body">
                                    <div class="text-center card-title text-primary"><h5>${item.title || item.name || "Título no disponible"}</h5></div><hr>
                                    <p class="text-left pt-1 pb-1"> ${item.description || item.description || "Descripción no disponible"}</p>
                                    <h4 class="text-center text-primary alert alert-primary m-auto"><b> $ ${item.price || item.price || "Precio no disponible"}</b></h4>
                                     <button class="btn btn-danger  mt-4 eliminar-producto"  onclick='eliminarProducto(${item.id})' ><svg xmlns="http://www.w3.org/2000/svg"
                                        width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                        <path
                                            d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                    </svg></button>
                                </div>
                            </div>
                        </div>
                    `;
      resultsContainer.innerHTML += itemHTML; 
    
    });
  }

document.getElementById('submitForm').addEventListener('submit',(e)=> {
    e.preventDefault()
    const datos = { 
      title: document.getElementById('title').value, 
      description: document.getElementById('description').value, 
      code: document.getElementById('code').value, 
      price: document.getElementById('price').value, 
      category: document.getElementById('category').value, 
      thumbnail: [document.getElementById('url').value] 
    }

  //emitimos evento al servidor para que haga peticion post   
  socket.emit('postData', datos);
  document.getElementById('submitForm').reset();
  document.getElementById('cerrar').click();
})