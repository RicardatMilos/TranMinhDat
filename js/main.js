let container = document.getElementById('new-product-wrapper');
let container1= document.getElementById('new-product-wrapper-one')
let moreProduct = document.querySelectorAll('.more-product')
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

            // Lấy toàn bộ docs
            const docs = snapshot.docs;

            // Giới hạn tối đa 4 sản phẩm
            for (let i = 0; i < docs.length && i < 4; i++) {

                const product = docs[i].data();

                let cardContainer = document.createElement('div');
                let productImage = document.createElement('img');
                let productDetails = document.createElement('div');
                let productName = document.createElement('p');
                let productPrice = document.createElement('p');

                container.appendChild(cardContainer);
                cardContainer.appendChild(productImage);
                cardContainer.appendChild(productDetails);
                productDetails.appendChild(productName);
                productDetails.appendChild(productPrice);

                cardContainer.classList.add('single-new-product');
                productImage.classList.add('product-image');
                productDetails.classList.add('product-details');
                productName.classList.add('product-name');
                productPrice.classList.add('product-price');

                productImage.src = product.productImage;
                productName.innerHTML = product.productName;
                productPrice.innerHTML = Number(product.productPrice).toLocaleString('vi-VN') + "đ";

                cardContainer.addEventListener('click' , () => {
                    let productSku = product.productSku
                    localStorage.setItem('ID', productSku);
                    console.log(productSku)

                    window.location.href = 'product-overview.html'
                })
}})});

window.addEventListener('DOMContentLoaded', () => {
    db.collection('products').get()
        .then((snapshot) => {

            // Lấy toàn bộ docs
            const docs = snapshot.docs;

            // Giới hạn tối đa 2 sản phẩm
            for (let i = 0; i < docs.length && i < 2; i++) {

                const product = docs[i].data();

                let cardContainer = document.createElement('div');
                let productImage = document.createElement('img');
                let productDetails = document.createElement('div');
                let productName = document.createElement('p');
                let productPrice = document.createElement('p');

                container1.appendChild(cardContainer);
                cardContainer.appendChild(productImage);
                cardContainer.appendChild(productDetails);
                productDetails.appendChild(productName);
                productDetails.appendChild(productPrice);

                cardContainer.classList.add('single-new-product');
                productImage.classList.add('product-image');
                productDetails.classList.add('product-details');
                productName.classList.add('product-name');
                productPrice.classList.add('product-price');

                productImage.src = product.productImage;
                productName.innerHTML = product.productName;
                productPrice.innerHTML = Number(product.productPrice).toLocaleString('vi-VN') + "đ";
            }
        });
});

moreProduct.forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = '../html/product.html';
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

cart.addEventListener("click", () => {

    renderCart();

    overlay.style.display = "flex";

});

returnButton.addEventListener("click", () => {

    overlay.style.display = "none";

});

backPaymentButton.addEventListener('click', (e) => {
    e.preventDefault()

    paymentOverlay.style.display = 'none'
})