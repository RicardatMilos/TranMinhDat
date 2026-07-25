let productImageContainer = document.getElementById('product-image-container')
let productPriceContainer = document.getElementById('product-price-container')
let productDescriptionContainer = document.getElementById('product-description-container')
let productNameContainer = document.getElementById('product-name-container')
let buyInstantlyButton = document.getElementById('button1')
let addToCartButton = document.getElementById('button2')
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

window.addEventListener("DOMContentLoaded", () => {

    let productSku = localStorage.getItem("ID");

    db.collection("products").get()
    .then((snapshot) => {

        snapshot.forEach((doc) => {

            const product = doc.data();

            if (product.productSku == productSku) { 

                console.log(product);

                productImageContainer.src = product.productImage;
                productPriceContainer.innerHTML = Number(product.productPrice).toLocaleString("vi-VN") + "đ";
                productDescriptionContainer.innerHTML = product.productDescription;
                productNameContainer.innerHTML = product.productName;

                productImageContainer.style.boxShadow = '0 0 5px rgb(0, 0, 0, 0.8)'
                productImageContainer.style.margin = '10px'
                productImageContainer.style.borderRadius = '10px'
                productImageContainer.style.width = '30%'
                productImageContainer.style.height = productImageContainer.style.width

                addToCartButton.addEventListener("click", () => {

                    let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
                
                    let existingProduct = shoppingList.find(item => {
                        return item.productSku === product.productSku;
                    });
                
                    if (existingProduct) {
                
                        // Product already exists → increase quantity
                        existingProduct.quantity++;
                
                    } else {
                
                        // Product doesn't exist → add new product
                        shoppingList.push({
                            productSku: product.productSku,
                            productName: product.productName,
                            productPrice: product.productPrice,
                            productImage: product.productImage,
                            quantity: 1
                        });
                
                    }
                
                    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
                
                    alert("Đã thêm vào giỏ hàng!");
                
                });
            }

        });

    });

});

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

