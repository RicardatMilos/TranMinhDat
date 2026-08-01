let apiKey = 'eb180bc64e804ec6a4451cacaaba2f09'
let url = `https://newsapi.org/v2/everything?q=shoes&apiKey=${apiKey}`
let newsContainer = document.getElementById('news-container')
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
let inpName = document.getElementById('name')
let inpPhone = document.getElementById('phone')
let inpAddress = document.getElementById('address')
let continueButton = document.getElementById('continue-button')
let informationOverlay = document.getElementById('information-overlay')
let backInformationButton = document.getElementById('back-information-button')


fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data)

        for (i = 0; i <= 11; i++ ) {
            let singleNewsContainer = document.createElement('div');
            let newsImage = document.createElement('img')
            let newsTitle = document.createElement('h3')
            let article = data.articles[i]
    
            singleNewsContainer.classList.add('single-news-container')
            newsImage.classList.add('news-image')
            newsTitle.classList.add('news-title')
    
            newsContainer.appendChild(singleNewsContainer)
            singleNewsContainer.appendChild(newsImage)
            singleNewsContainer.appendChild(newsTitle)

            newsImage.src = article.urlToImage
            newsTitle.innerHTML = article.title

            singleNewsContainer.addEventListener('click', (e) => {
                window.location.assign(article.url)
            })
        }
    })

    
cart.addEventListener('click', () => {
    overlay.style.display = 'flex'
    returnButton.addEventListener('click', () => {
        overlay.style.display = 'none'
    })
})

function renderCart() {

    cartOverallContainer.innerHTML = "";

    let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];

    let totalQuantity = 0;
    let totalPrice = 0;

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

            <div style="position:relative; width:100%;">

                <h5>${item.productName}</h5>

                <p style="color:red;margin:0;">
                    ${Number(item.productPrice).toLocaleString("vi-VN")}đ
                </p>

                <p>Số lượng: ${item.quantity}</p>

                <button class="delete-btn"
                    style="position:absolute;right:0;bottom:0;">
                    Delete
                </button>

            </div>
        `;

        let deleteButton = productDiv.querySelector(".delete-btn");

        deleteButton.addEventListener("click", () => {

            let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];

            shoppingList = shoppingList.filter(product => {

                return product.productSku !== item.productSku;

            });

            localStorage.setItem(
                "shoppingList",
                JSON.stringify(shoppingList)
            );

            renderCart();

        });

        cartOverallContainer.appendChild(productDiv);

    });

    cartOverallQuantity.innerHTML = totalQuantity;

    cartOverallPrice.innerHTML =
        totalPrice.toLocaleString("vi-VN") + "đ";

}

cart.addEventListener("click", () => {

    renderCart();

    overlay.style.display = "flex";

});

returnButton.addEventListener("click", () => {

    overlay.style.display = "none";

});

cartOverallPurchaseButton.addEventListener("click", (e) => {

    e.preventDefault();

    let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];

    if (shoppingList.length === 0) {

        alert("Vui lòng chọn sản phẩm!");

        return;

    }

    informationOverlay.style.display = "flex";

});

backInformationButton.addEventListener("click", (e) => {

    e.preventDefault();

    informationOverlay.style.display = "none";

});

continueButton.addEventListener("click", (e) => {

    e.preventDefault();

    let name = inpName.value.trim();
    let phone = inpPhone.value.trim();
    let address = inpAddress.value.trim();

    if (!name || !phone || !address) {

        alert("Vui lòng điền đầy đủ thông tin!");

        return;

    }

    let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];

    if (shoppingList.length === 0) {

        alert("Giỏ hàng đang trống!");

        return;

    }

    let totalQuantity = 0;
    let totalPrice = 0;

    shoppingList.forEach(item => {

        totalQuantity += item.quantity;

        totalPrice += item.productPrice * item.quantity;

    });

    let userInfo = {

        name,

        phone,

        address

    };

    let orderInfo = {

        products: shoppingList,

        totalQuantity,

        totalPrice

    };

    localStorage.setItem(
        "userInfo",
        JSON.stringify(userInfo)
    );

    localStorage.setItem(
        "orderInfo",
        JSON.stringify(orderInfo)
    );

    informationOverlay.style.display = "none";

    window.location.href = "confirm.html";

});