const cards             = document.getElementById('cards')
const items             = document.getElementById('items')
const footer            = document.getElementById('footer')
const templateCard      = document.getElementById('template-card').content
const templateFooter    = document.getElementById('template-footer').content
const templateCarrito   = document.getElementById('template-carrito').content
const fragmento         = document.createDocumentFragment()
//--------------------------------------------------------//
//----------Se crea el carrito vacío------------------//
let carrito ={}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

//Event on click//
cards.addEventListener('click', e =>{
    addCarrito(e)
})

//------Agregar los datos del json---------------//
const fetchData = async () =>{
    try{
        const res = await fetch('api.json')
        const data = await res.json()
        console.log(data)
        mostrarProductos(data)
    }catch(error){
        console.log(error)
    }
}


//-----------------Metodo mostrar productos-----------------------//
const mostrarProductos = data =>{
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragmento.appendChild(clone)
    });
    cards.appendChild(fragmento)
}

//-----------METODO AGREGAR AL CARRITO------------//
const addCarrito = e => {
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

//---------------dar salida al carrito------------//
const setCarrito = objeto =>{
    const producto={
        id:objeto.querySelector('.btn-dark').dataset.id,
            title: objeto.querySelector('h5').textContent,
            precio: objeto.querySelector('p').textContent,
            cantidad:1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    mostrarCarrito()

    console.log(carrito)
}
    //--------------Metood mostrar carrito------------//

    const mostrarCarrito = () =>{

        items.innerHTML=''
        Object.values(carrito).forEach(producto =>{
            templateCarrito.querySelectorAll('th').textContent = producto.id
            templateCarrito.querySelectorAll('td')[0].textContent = producto.title
            templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
            templateCarrito.querySelector('.btn-info').dataset.id = producto.id
            templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
            templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

            const cloneProducto = templateCarrito.cloneNode(true)
            fragmento.appendChild(cloneProducto)
        })

        items.appendChild(fragmento)

        mostrarFooter()
    }

const mostrarFooter = () =>{

    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - cmience a comprar!</th>
        `
        
        return
    }
const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio)


//Console.log(nPrecio) // Comprobación por consola
templateFooter.querySelectorAll('td')[0].textContent = nCantidad
templateFooter.querySelector('span').textContent = nPrecio //span contiene el precio

const clone = templateFooter.cloneNode(true)
fragmento.appendChild(clone)
footer.appendChild(fragmento)

const btnVaciar = document.getElementById('vaciar-carrito')
btnVaciar.addEventListener('click', () => {
    carrito = {}
    mostrarCarrito()
})

}

