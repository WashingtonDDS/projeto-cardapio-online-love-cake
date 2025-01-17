const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = []
// Abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
  updateCartModal()
    cartModal.style.display = "flex"
})

// Fecha o modal quando clicar fora
cartModal.addEventListener("click", function(evento){
    if (evento.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

// Adicionar no carrinho
menu.addEventListener("click", function(evento){
    //console.log(evento.target); pegar o evento do click
    let parentButton = evento.target.closest(".add-to-cart-btn") //classe sempre começa com ponta. //id com #

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})
// Adicionar no carrinho
function addToCart(name, price){
  const existeItem = cart.find(item => item.name === name)
  if (existeItem) {
    existeItem.quantity += 1
    }else{
      cart.push({
        name,
        price,
        quantity:1,
      })
    }

    updateCartModal()


}
//Atualiza o carrinho
function updateCartModal(){
  cartItemsContainer.innerHTML = ""
  let total = 0

  cart.forEach(item => {
    const cartItemElement = document.createElement("div")
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
    cartItemElement.innerHTML= `
    <div class="flex items-center justify-between">
      <div>
        <p class="font-bold">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
      </div>


      <button class="remove-from-cart-btn" data-name= "${item.name}">
        Remover
      </button>


    </div>
    `
    total += item.price * item.quantity

    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style:"currency",
    currency:"BRL"
  })

  cartCounter.innerHTML = cart.length

}

// função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(evento){
  if (evento.target.classList.contains("remove-from-cart-btn")) {
    const name = evento.target.getAttribute("data-name")

    removeItemCart(name)

  }
})

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name)

  if (index !== -1) {
    const item =cart[index]

    if (item.quantity >1) {
      item.quantity -= 1
      updateCartModal()
      return
    }

    cart.splice(index,1)
    updateCartModal()

  }
}

addressInput.addEventListener("input", function(evento){
  let inputValue = evento.target.value
  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }
})
//Finalizar pedido
checkoutBtn.addEventListener("click", function(){
  const isOpen = checkRestaurantOpen()
  if (!isOpen) {
    Toastify({
      text: "Ops estamos fora do horario de expediente",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },}).showToast()
    return
  }
  if (cart.length === 0) return
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return
  }

  //Enviar o pedido para o whats
  const cartItems = cart.map((item)=>{
    return(`${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`

    )
  }).join(" ")

  const message = encodeURIComponent(cartItems)
  const phone = 12996397826

  window.open(`http://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

  cart = []
  updateCartModal()

})
// Verificar a hora e manipular o card horario
function checkRestaurantOpen(){
  const data = new Date()
  const hora = data.getHours()
  return hora >= 9 && hora < 19
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if (isOpen) {
  spanItem.classList.remove("bg-red-500")
  spanItem.classList.add("bg-green-600")
}else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}
