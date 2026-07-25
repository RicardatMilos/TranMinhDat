let container = document.getElementById('product-container')
let paymentContainer = document.getElementById('payment-container')
let backButton = document.getElementById('back-button')
let paymentSubmit = document.getElementById('payment-submit')
let cart = document.getElementById('cart')
let overlay = document.getElementById('overlay')
let returnButton = document.getElementById('return-button')
let cartOverallContainer = document.getElementById('cart-overall-container')
let cartOverallQuantity = document.getElementById("cart-overall-quantity");
let cartOverallPrice = document.getElementById("cart-overall-price");
let paymentOverlay = document.getElementById('payment-overlay')
let backPaymentButton = document.getElementById('back-payment-button')
let cartOverallPurchaseButton = document.getElementById('cart-overall-purchase-button')
let pricePaymentContainer = document.getElementById('price-payment-container')

window.addEventListener('DOMContentLoaded', () => {
    db.collection('products').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const product = doc.data();

                let cardContainer = document.createElement('div')
                let productImage = document.createElement('img')
                let productDetails = document.createElement('div')
                let productName = document.createElement('p')
                let productPrice = document.createElement('p')

                container.appendChild(cardContainer)
                cardContainer.appendChild(productImage)
                cardContainer.appendChild(productDetails)
                productDetails.appendChild(productName)
                productDetails.appendChild(productPrice)

                cardContainer.classList.add('card-container')
                productImage.classList.add('product-image')
                productDetails.classList.add('product-details')
                productName.classList.add('product-name')
                productPrice.classList.add('product-price')

                productImage.src = product.productImage
                productName.innerHTML = product.productName
                productPrice.innerHTML = Number(product.productPrice).toLocaleString('vi-VN') + "đ"

                cardContainer.addEventListener('click' , () => {
                    let productSku = product.productSku
                    localStorage.setItem('ID', productSku);
                    console.log(productSku)

                    window.location.href = 'product-overview.html'
                })

            })
        })
})


function renderCart() {

    cartOverallContainer.innerHTML = "";

    let totalQuantity = 0;
    let totalPrice = 0;

    let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];

    shoppingList.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.productPrice * item.quantity;

        let productDiv = document.createElement("div");

        productDiv.style.display = "flex";
        productDiv.style.alignItems = "center";
        productDiv.style.gap = "20px";
        productDiv.style.marginBottom = "20px";
        productDiv.style.borderBottom = "1px solid #ddd";
        productDiv.style.paddingBottom = "10px";

        productDiv.innerHTML = `
        <img src="${item.productImage}" width="80" height="80" style="border-radius:10px">
    
        <div style='position: relative'>
            <h5>${item.productName}</h5>
            <p style="color:red; margin:0">${item.productPrice}</p>
            <p>Số lượng: ${item.quantity}</p>
    
            <button class="delete-btn" style='position:absolute; right:0; bottom:0'>Delete</button>
        </div>
    `;
        let deleteButton = productDiv.querySelector(".delete-btn");
        deleteButton.addEventListener("click", (e) => {
            e.preventDefault()

            let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
        
            shoppingList = shoppingList.filter(product => {
                return product.productSku !== item.productSku;
            });
        
            localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
        
            renderCart();
        
        });

        cartOverallPurchaseButton.addEventListener('click', (e) => {
            e.preventDefault()
            paymentOverlay.style.display = 'flex'

            pricePaymentContainer.innerHTML = ''
            pricePaymentContainer.innerHTML = totalPrice.toLocaleString('vi-VN') + 'đ'
        })

        cartOverallContainer.appendChild(productDiv);

    });

    cartOverallQuantity.innerHTML = totalQuantity;
    cartOverallPrice.innerHTML = totalPrice.toLocaleString("vi-VN") + "đ";

}

cart.addEventListener("click", (e) => {
    e.preventDefault()
    renderCart();

    overlay.style.display = "flex";

});

returnButton.addEventListener("click", (e) => {
    e.preventDefault()
    overlay.style.display = "none";

});

backPaymentButton.addEventListener('click', (e) => {
    e.preventDefault()

    paymentOverlay.style.display = 'none'
})
