//Contenedor de productos
const productsContainer = document.querySelector(".products-container");
const showMoreBtn = document.querySelector(".boton-load");
//Contenedor de categorias
const categoriesContainer = document.querySelector(".categories");
const categoriesList = document.querySelectorAll(".category");

//Carrito
const cartBtn = document.querySelector(".cart-label");
const cartMenu = document.querySelector(".cart");
const menuBtn = document.querySelector(".menu-label");
const barsMenu = document.querySelector(".navbar-list");
const overlay = document.querySelector(".overlay");
const productsCart = document.querySelector(".cart-container");
const total = document.querySelector(".total");
const successModal = document.querySelector(".add-modal");
const buyBtn = document.querySelector(".btn-buy");
const deleteBtn = document.querySelector(".btn-delete");
const cartBubble = document.querySelector(".cart-bubble");

//Formulario
const registerForm = document.getElementById("form");
const nameInput = document.getElementById("nombre");
const emailInput = document.getElementById("mail");
const phoneInput = document.getElementById("telefono");
const messageInput = document.getElementById("mensaje");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const createProductTemplate = (product) => {
  const { id, name, price, cardImg, category } = product;
  return `
    
    <div class="paquetes-item">
            <img src="${cardImg}" alt="${name}" />
            <div class="item-info">
              <h3 class="item-name">${name}</h3>
              <div class="item-info-mid">
                <span class="item-info-tags">Vuelo</span>
                <span class="item-info-tags">Hotel</span>
                <span class="item-info-tags">Excursiones</span>
                <span class="item-info-tags">...</span>
              </div>
              <div class="item-info-bot">
                <span>Desde</span>
                <p>$${price}</p>
              </div>
              <button class="boton-cards"
                data-id='${id}'
                data-name='${name}'
                data-price='${price}'
                data-category='${category}'
                data-img='${cardImg}'>Comprar</button>
            </div>
          </div>`;
};

const isLastIndexOf = () => {
  return appState.currentProductsIndex === appState.productsLimit - 1;
}; //CHECK

const renderProducts = (productsList) => {
  productsContainer.innerHTML += productsList
    .map(createProductTemplate)
    .join("");
};

const showMoreProducts = () => {
  appState.currentProductsIndex += 1;
  let { products, currentProductsIndex } = appState;
  renderProducts(products[currentProductsIndex]);
  if (isLastIndexOf()) {
    showMoreBtn.classList.add("hidden");
  }
}; //CHECK

const applyFilter = ({ target }) => {
  if (!isInactiveFilterBtn(target)) return;
  changeFilterState(target);

  productsContainer.innerHTML = "";
  if (appState.activeFilter) {
    renderFilteredProducts();
    appState.currentProductsIndex = 0;
    return;
  }
  renderProducts(appState.products[0]);
}; //CHECK

const renderFilteredProducts = () => {
  const filteredProducts = productsData.filter(
    (product) => product.category === appState.activeFilter
  );
  renderProducts(filteredProducts);
}; //CHECK

const isInactiveFilterBtn = (element) => {
  return (
    element.classList.contains("category") &&
    !element.classList.contains("active")
  );
}; //CHECK

const changeFilterState = (btn) => {
  appState.activeFilter = btn.dataset.category;
  changeBtnActiveState(appState.activeFilter);
  setShowMoreVisibility();
};

const changeBtnActiveState = (selectedCategory) => {
  const categories = [...categoriesList];
  categories.forEach((categoryBtn) => {
    if (categoryBtn.dataset.category !== selectedCategory) {
      categoryBtn.classList.remove("active");
      return;
    }
    categoryBtn.classList.add("active");
  });
}; //CHECK

const setShowMoreVisibility = () => {
  if (!appState.activeFilter) {
    showMoreBtn.classList.remove("hidden");
    return;
  }
  showMoreBtn.classList.add("hidden");
}; //CHECK

const toggleCart = () => {
  cartMenu.classList.toggle("open-cart");

  if (barsMenu.classList.contains("open-menu")) {
    barsMenu.classList.remove("open-menu");
    return;
  }
  overlay.classList.toggle("show-overlay");
};

const toggleMenu = () => {
  barsMenu.classList.toggle("open-menu");
  if (cartMenu.classList.contains("open-cart")) {
    cartMenu.classList.remove("open-cart");
    return;
  }
  overlay.classList.toggle("show-overlay");
};

const closeOnScroll = () => {
  if (
    !barsMenu.classList.contains("open-menu") &&
    !cartMenu.classList.contains("open-cart")
  ) {
    return;
  }
  barsMenu.classList.remove("open-menu");
  cartMenu.classList.remove("open-cart");
  overlay.classList.remove("show-overlay");
};

const closeOnClick = (e) => {
  if (!e.target.classList.contains("navbar-list")) {
    return;
  }
  barsMenu.classList.remove("open-menu");
  overlay.classList.remove("show-overlay");
};

const closeOnOverlayClick = () => {
  barsMenu.classList.remove("open-menu");
  cartMenu.classList.remove("open-cart");
  overlay.classList.remove("show-overlay");
};

const renderCart = () => {
  if (!cart.length) {
    productsCart.innerHTML = `
        <p class="empty-msg">No hay productos en el carrito</p>
        `;
    return;
  }
  productsCart.innerHTML = cart.map(createCartProductTemplate).join("");
};

const createCartProductTemplate = (cartProduct) => {
  const { id, name, price, img, quantity } = cartProduct;
  console.log(cartProduct);
  return `
    <div class="cart-item">
      <img src=${img} alt="${name}" />
      <div class="item-info-cart">
        <h3 class="item-title">${name}</h3>
        <span class="item-price">$${price}</span>
      </div>
      <div class="item-handler">
        <span class="quantity-handler down" data-id=${id}>-</span>
        <span class="item-quantity">${quantity}</span>
        <span class="quantity-handler up" data-id=${id}>+</span>
      </div>
    </div>
    `;
};

const showCartTotal = () => {
  total.innerHTML = `$${getCartTotal()}`;
};

const getCartTotal = () => {
  return cart.reduce((acc, cur) => acc + Number(cur.price) * cur.quantity, 0);
};

const addProduct = (e) => {
  if (!e.target.classList.contains("boton-cards")) {
    return;
  }

  const product = createProductData(e.target.dataset);

  if (isExistingCartProduct(product)) {
    addUnitToProduct(product);
    showSuccessModal("Se agregó una unidad del producto al carrito");
  } else {
    createCartProduct(product);
    showSuccessModal("El producto se ha agregado al carrito");
  }

  updateCartState();
};

const createProductData = (product) => {
  const { id, name, price, img, category } = product;
  return { id, name, price, img, category };
};

const isExistingCartProduct = (product) => {
  return cart.find((item) => item.id === product.id);
};

const addUnitToProduct = (product) => {
  cart = cart.map((cartProduct) =>
    cartProduct.id === product.id
      ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
      : cartProduct
  );
};

const showSuccessModal = (msg) => {
  successModal.classList.add("active-modal");
  successModal.textContent = msg;
  setTimeout(() => {
    successModal.classList.remove("active-modal");
  }, 1500);
};

const createCartProduct = (product) => {
  cart = [...cart, { ...product, quantity: 1 }];
};

const disableBtn = (btn) => {
  if (!cart.length) {
    btn.classList.add("disabled");
  } else {
    btn.classList.remove("disabled");
  }
};

const renderCartBubble = () => {
  cartBubble.textContent = cart.reduce((acc, cur) => {
    return acc + cur.quantity;
  }, 0);
};

const updateCartState = () => {
  saveCart();
  renderCart();
  showCartTotal();

  disableBtn(buyBtn);
  disableBtn(deleteBtn);

  renderCartBubble();
};

const handlePlusBtnEvent = (id) => {
  const existingCartProduct = cart.find((item) => item.id === id);
  addUnitToProduct(existingCartProduct);
};

const handleMinusBtnEvent = (id) => {
  const existingCartProduct = cart.find((item) => item.id === id);

  if (existingCartProduct.quantity === 1) {
    removeProductFromCart(existingCartProduct);
    return;
  }
  substractProductUnit(existingCartProduct);
};

const substractProductUnit = (existingProduct) => {
  cart = cart.map((product) => {
    return product.id === existingProduct.id
      ? { ...product, quantity: Number(product.quantity) - 1 }
      : product;
  });
};

const removeProductFromCart = (existingProduct) => {
  cart = cart.filter((product) => product.id !== existingProduct.id);
  updateCartState();
};

const handleQuantity = (e) => {
  if (e.target.classList.contains("down")) {
    handleMinusBtnEvent(e.target.dataset.id);
  } else if (e.target.classList.contains("up")) {
    handlePlusBtnEvent(e.target.dataset.id);
  }

  updateCartState();
};

const resetCartItems = () => {
  cart = [];
  updateCartState();
};

const completeCartAction = (confirmMsg, successMsg) => {
  if (!cart.length) return;
  if (window.confirm(confirmMsg)) {
    resetCartItems();
    alert(successMsg);
  }
};

const completeBuy = () => {
  completeCartAction("¿Desea completar su compra?", "¡Gracias por su compra!");
};

const deleteCart = () => {
  completeCartAction(
    "¿Desea vaciar el carrito?",
    "No hay productos en el carrito"
  );
};

// ---------------------------------------------------------

//Validación formulario
const isEmpty = (input) => {
  return !input.value.trim().length;
};

const isBetween = (input, min, max) => {
  return input.value.length >= min && input.value.length < max;
};

const isEmailValid = (input) => {
  const re = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,4})+$/;
  return re.test(input.value.trim());
};

const isPhoneValid = (input) => {
  const re = /^[0-9]{10}$/;
  return re.test(input.value.trim());
};

const showSuccess = (input) => {
  const formField = input.parentElement;
  formField.classList.remove("error");
  formField.classList.add("success");
  const error = formField.querySelector("small");
  error.textContent = "";
};

const showError = (input, message) => {
  const formField = input.parentElement;
  formField.classList.remove("success");
  formField.classList.add("error");
  const error = formField.querySelector("small");
  error.style.display = "block";
  error.textContent = message;
};

const checkNameInput = (input) => {
  let valid = false;
  const minCharacters = 3;
  const maxCharacters = 25;

  if (isEmpty(input)) {
    showError(input, "Este campo es obligatorio");
    return;
  }
  if (!isBetween(input, minCharacters, maxCharacters)) {
    showError(
      input,
      `Este campo debe tener entre ${minCharacters} y ${maxCharacters} caracteres`
    );
    return;
  }
  showSuccess(input);
  valid = true;
  return valid;
};

const checkEmail = (input) => {
  let valid = false;
  if (isEmpty(input)) {
    showError(input, "El campo es obligatorio");
    return;
  }
  if (!isEmailValid(input)) {
    showError(input, "El email no es valido");
    return;
  }
  showSuccess(input);
  valid = true;
  return valid;
};

const checkPhone = (input) => {
  let valid = false;
  if (isEmpty(input)) {
    showError(input, "El teléfono es obligatorio");
    return;
  }
  if (!isPhoneValid(input)) {
    showError(input, "El teléfono no es valido");
    return;
  }
  showSuccess(input);
  valid = true;
  return valid;
};

const checkMessage = (input) => {
  let valid = false;
  const minCharacters = 15;
  const maxCharacters = 300;

  if (isEmpty(input)) {
    showError(input, "Este campo es obligatorio");
    return;
  }

  if (!isBetween(input, minCharacters, maxCharacters)) {
    showError(
      input,
      `Este campo debe tener entre ${minCharacters} y ${maxCharacters} caracteres`
    );
    return;
  }
  showSuccess(input);
  valid = true;
  return valid;
};

const validateForm = (e) => {
  e.preventDefault();

  let isNameValid = checkNameInput(nameInput);
  let isEmailValid = checkEmail(emailInput);
  let isPhoneValid = checkPhone(phoneInput);
  let isMessageValid = checkMessage(messageInput);

  let isValidForm =
    isNameValid && isEmailValid && isPhoneValid && isMessageValid;

  if (isValidForm) {
    alert(
      "Tu consulta ha sido enviada, a la brevedad nos comunicaremos con usted"
    );
    registerForm.reset();
  }
};

const init = () => {
  renderProducts(appState.products[0]);
  showMoreBtn.addEventListener("click", showMoreProducts);
  categoriesContainer.addEventListener("click", applyFilter);

  cartBtn.addEventListener("click", toggleCart);
  menuBtn.addEventListener("click", toggleMenu);
  window.addEventListener("scroll", closeOnScroll);
  barsMenu.addEventListener("click", closeOnClick);
  overlay.addEventListener("click", closeOnOverlayClick);
  document.addEventListener("DOMContentLoaded", renderCart);
  document.addEventListener("DOMContentLoaded", showCartTotal);
  productsContainer.addEventListener("click", addProduct);
  productsCart.addEventListener("click", handleQuantity);
  buyBtn.addEventListener("click", completeBuy);
  deleteBtn.addEventListener("click", deleteCart);

  disableBtn(buyBtn);
  disableBtn(deleteBtn);

  renderCartBubble(cart);

  //Validacion contacto
  registerForm.addEventListener("submit", validateForm);
  nameInput.addEventListener("input", () => checkNameInput(nameInput));
  emailInput.addEventListener("input", () => checkEmail(emailInput));
  phoneInput.addEventListener("input", () => checkPhone(phoneInput));
  messageInput.addEventListener("input", () => checkMessage(messageInput));
};

init();
