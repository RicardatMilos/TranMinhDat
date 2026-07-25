let submitButton = document.getElementById('submit-button');
let cart = document.getElementById('cart');
let overlay = document.getElementById('overlay');
let returnButton = document.getElementById('return-button');
let cartOverallContainer = document.getElementById('cart-overall-container');
let cartOverallQuantity = document.getElementById("cart-overall-quantity");
let cartOverallPrice = document.getElementById("cart-overall-price");
let paymentOverlay = document.getElementById('payment-overlay')
let backPaymentButton = document.getElementById('back-payment-button')
let cartOverallPurchaseButton = document.getElementById('cart-overall-purchase-button')
let pricePaymentContainer = document.getElementById('price-payment-container')

submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    var params = {
        name: document.getElementById('username').value,
        email: document.getElementById('email-address').value,
        title: document.getElementById('title').value,
        message: document.getElementById('message').value
    };

    const serviceId = "service_fo2rn5e";
    const templateId = "template_2xx8v1a";

    emailjs
        .send(serviceId, templateId, params)
        .then((res) => {
            document.getElementById('username').value = "";
            document.getElementById('email-address').value = "";
            document.getElementById('title').value = "";
            document.getElementById('message').value = "";
            alert("Đã gửi email thành công");
        })
        .catch((err) => console.log(err));
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