let cartIcon = document.querySelector('#cart-icon')
let cart = document.querySelector('.cart')
let closeCart = document.querySelector('#close-cart')
let btnBuy = document.querySelector('.btn-buy')
let cartTitle = document.querySelector('.cart-title')
let totaTitle = document.querySelector('.total-title')
let totalPrice = document.querySelector('.total-price')


// --------------------------------------------------------

// --------------------------------------------------------
cartIcon.onclick = () => {
    cart.classList.add("active");
};

closeCart.onclick = () => {
    cart.classList.remove("active");
};

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}

function ready() {
    var reomveCartButtons = document.getElementsByClassName('cart-remove');
    console.log(reomveCartButtons);
    for (var i = 0; i < reomveCartButtons.length; i++) {
        var button = reomveCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    var addCart = document.getElementsByClassName('add-cart');
    for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i];
        console.log(button);
        button.addEventListener('click', addCartClicked);
    }

    // EAN UPARXOUN PROIONTA STO LOCALSTORAGE TOTE
    // TREJE MIA FOR H OPOIA THA KANEI NEA DIV ME CLASS CART-BOX GIA TO KATHE PROION
    if (localStorage.getItem('0001')) {
        const cartShopBox = document.createElement('div'); //<div></div>
        cartShopBox.classList.add('cart-box'); //<div class="cart-box"></div>
        var cartItems = document.getElementsByClassName('cart-content')[0];
        cartShopBox.innerHTML = localStorage.getItem('0001');
        cartItems.append(cartShopBox);
    }

    document
        .getElementsByClassName('btn-buy')[0]
        .addEventListener('click', buyButtonClicked)
}

function buyButtonClicked() {
    alert('Η παραγγελία σας τοποθετήθηκε')
    var cartContent = document.getElementsByClassName('cart-content')[0]
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild)
    }
    updatetotal();
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updatetotal();
}

function addCartClicked(event) {
    var button = event.target
    var shopProducts = button.parentElement //product
    console.log(shopProducts);
    const sku = shopProducts.getAttribute('sku');
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText;
    var price = shopProducts.getElementsByClassName('price')[0].innerText;
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src;
    addProductToCart(title, price, productImg, sku);
    updatetotal();
}

function addProductToCart(title, price, productImg, sku) {
    var cartShopBox = document.createElement('div'); //<div></div>
    cartShopBox.classList.add('cart-box'); //<div class="cart-box"></div>
    var cartItems = document.getElementsByClassName('cart-content')[0];
    console.log('cartItems: ', cartItems);
    var cartItemsNames = cartItems.getElementsByClassName('cart-product-title');
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            alert("Έχετε ήδη προσθέσει αυτό το προϊόν στο καλάθι");
            return;
        }
    }

    var cartBoxContent = `
                            <img src="${productImg}" alt="" class="cart-img">
                            <div class="detail-box">
                                <div class="cart-product-title">${title}</div>
                                <div class="cart-price">${price}</div>
                                <input type="number" value="1" class="cart-quantity">
                            </div>
                            <i class='bx bxs-trash-alt cart-remove'></i>`;

    cartShopBox.innerHTML = cartBoxContent;
    localStorage.setItem(sku, cartBoxContent);
    cartItems.append(cartShopBox);
    cartShopBox
        .getElementsByClassName('cart-remove')[0]
        .addEventListener('click', removeCartItem)
    cartShopBox
        .getElementsByClassName('cart-quantity')[0]
        .addEventListener('change', quantityChanged)

}

function updatetotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    const numOfItems = document.querySelector(".numOfItems")
    numOfItems.innerHTML = cartContent.childElementCount
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var price = parseFloat(priceElement.innerText.replace("$", ""));
        var quantity = quantityElement.value;
        total = total + price * quantity;
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('total-price')[0].innerText = "$" + total;

    if (total > 0) {
        btnBuy.style.display = "block"
        cartTitle.innerHTML = "Το καλάθι σας"
        totalPrice.style.display = "block"
        totaTitle.style.display = "block"
    } else {
        btnBuy.style.display = "none"
        cartTitle.innerHTML = "Δεν έχετε προσθέσει κανένα προιόν"
        totalPrice.style.display = "none"
        totaTitle.style.display = "none"
    }
}

