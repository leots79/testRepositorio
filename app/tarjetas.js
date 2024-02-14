const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content

const fragmento = document.createDocumentFragment()
//-----------------------------------------------------------------

let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

//----------- Evento on Click

cards.addEventListener('click', e => {
    addCarrito(e)
})

const fetchData = async () => {
    try{
        const res = await fetch('../api.json')
        const data = await res.json()
        console.log(data)
        mostrarProductos(data)
    } catch(error){
        console.log(error)
    }
}
//--------------- Mostrar productos

const mostrarProductos = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragmento.appendChild(clone)
    });

    cards.appendChild(fragmento)
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

//-------------------- Da salida al Carrito
const setCarrito = objeto => {
    const producto = {
        id:objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    mostrarCarrito()
    console.log(carrito)
}
/*
const mostrarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        
        const clonePoducto = templateCarrito.cloneNode(true)
        fragmento.appendChild(clonePoducto)
    })
    items.appendChild(fragmento)
    mostratFooter()
}

const mostratFooter = () => {
    footer.innerHTML = ''

    if (Object.keys(carrito).length ===0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar</th>
        `
    }
}*/


//ChatGPT
const mostrarCarrito = () => {
    const itemsTabla = document.querySelector('.items');
    itemsTabla.innerHTML = ''; // Limpiar contenido existente en la tabla

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('.btn-info').setAttribute('data-id', producto.id); // Corregir aquí
        templateCarrito.querySelector('.btn-danger').setAttribute('data-id', producto.id); // Corregir aquí
        templateCarrito.querySelector('span').textContent = producto.cantidad * parseFloat(producto.precio); // Convertir precio a número

        const btnIncrementar = templateCarrito.querySelector('.btn-info');
        const btnDecrementar = templateCarrito.querySelector('.btn-danger');

        btnIncrementar.addEventListener('click', () => incrementarCantidad(producto.id));
        btnDecrementar.addEventListener('click', () => decrementarCantidad(producto.id));

        const cloneProducto = templateCarrito.cloneNode(true);
        itemsTabla.appendChild(cloneProducto);
    });

    // Actualizar mensaje del footer según si el carrito está vacío o no
    const footerMensaje = document.querySelector('#footer th');
    footerMensaje.textContent = Object.keys(carrito).length > 0 ? 'Total Productos' : 'Carrito Vacío - Comience a comprar';

    // Mostrar el total de productos y el precio total
    const templateFooterClone = templateFooter.cloneNode(true);
    templateFooterClone.querySelector('td:nth-child(3)').textContent = calcularTotalCantidad();
    templateFooterClone.querySelector('span').textContent = calcularTotalPrecio();
    itemsTabla.appendChild(templateFooterClone);
}

// Función para calcular la cantidad total de productos en el carrito
const calcularTotalCantidad = () => {
    return Object.values(carrito).reduce((total, producto) => total + producto.cantidad, 0);
}

// Función para calcular el precio total de los productos en el carrito
const calcularTotalPrecio = () => {
    return Object.values(carrito).reduce((total, producto) => total + (producto.cantidad * parseFloat(producto.precio)), 0);
}
