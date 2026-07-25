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