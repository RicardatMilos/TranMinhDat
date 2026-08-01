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
let cartOverallQuantity = document.getElementById("cart-overall-quantity")
let cartOverallPrice = document.getElementById("cart-overall-price")
let cartOverallPurchaseButton = document.getElementById('cart-overall-purchase-button')

let inpName = document.getElementById('name')
let inpPhone = document.getElementById('phone')
let inpAddress = document.getElementById('address')
let continueButton = document.getElementById('continue-button')

let informationOverlay = document.getElementById('information-overlay')
let backInformationButton = document.getElementById('back-information-button')

let buyNowProduct = null;

backInformationButton.addEventListener("click", (e) => {

    e.preventDefault();

    informationOverlay.style.display = "none";

    if (buyNowProduct == null) {

        overlay.style.display = "flex";

    }

});

window.addEventListener("DOMContentLoaded", () => {

    let productSku = localStorage.getItem("ID");

    db.collection("products").get()
    .then((snapshot) => {

        snapshot.forEach((doc) => {

            const product = doc.data();

            if (product.productSku == productSku) {

                productImageContainer.src = product.productImage;
                productPriceContainer.innerHTML =
                    Number(product.productPrice).toLocaleString("vi-VN") + "đ";

                productDescriptionContainer.innerHTML =
                    product.productDescription;

                productNameContainer.innerHTML =
                    product.productName;

                productImageContainer.style.boxShadow =
                    "0 0 5px rgba(0,0,0,.8)";
                productImageContainer.style.margin = "10px";
                productImageContainer.style.borderRadius = "10px";
                productImageContainer.style.width = "30%";
                productImageContainer.style.height =
                    productImageContainer.style.width;

                    buyInstantlyButton.addEventListener("click", () => {

                        buyNowProduct = {
                    
                            productSku: product.productSku,
                            productName: product.productName,
                            productPrice: product.productPrice,
                            productImage: product.productImage,
                            quantity: 1
                    
                        };
                    
                        overlay.style.display = "none";
                    
                        informationOverlay.style.display = "flex";
                    
                    });

                addToCartButton.addEventListener("click", () => {

                    let shoppingList =
                        JSON.parse(localStorage.getItem("shoppingList")) || [];

                    let existingProduct = shoppingList.find(item => {

                        return item.productSku === product.productSku;

                    });

                    if (existingProduct) {

                        existingProduct.quantity++;

                    } else {

                        shoppingList.push({

                            productSku: product.productSku,
                            productName: product.productName,
                            productPrice: product.productPrice,
                            productImage: product.productImage,
                            quantity: 1

                        });

                    }

                    localStorage.setItem(
                        "shoppingList",
                        JSON.stringify(shoppingList)
                    );

                    alert("Đã thêm vào giỏ hàng!");

                });

            }

        });

    });

});

function renderCart() {

    cartOverallContainer.innerHTML = "";

    let shoppingList =
        JSON.parse(localStorage.getItem("shoppingList")) || [];

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

            <img
                src="${item.productImage}"
                width="80"
                height="80"
                style="border-radius:10px">

            <div style="position:relative;width:100%;">

                <h5>${item.productName}</h5>

                <p style="color:red;margin:0;">
                    ${Number(item.productPrice).toLocaleString("vi-VN")}đ
                </p>

                <p>Số lượng: ${item.quantity}</p>

                <button
                    class="delete-btn"
                    style="position:absolute;right:0;bottom:0;">
                    Delete
                </button>

            </div>

        `;

        let deleteButton =
            productDiv.querySelector(".delete-btn");

        deleteButton.addEventListener("click", () => {

            let shoppingList =
                JSON.parse(localStorage.getItem("shoppingList")) || [];

            shoppingList =
                shoppingList.filter(product => {

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

cart.addEventListener("click", (e) => {

    e.preventDefault();

    renderCart();

    overlay.style.display = "flex";

});

returnButton.addEventListener("click", (e) => {

    e.preventDefault();

    overlay.style.display = "none";

});

cartOverallPurchaseButton.addEventListener("click", (e) => {

    e.preventDefault();

    let shoppingList =
        JSON.parse(localStorage.getItem("shoppingList")) || [];

    if (shoppingList.length === 0) {

        alert("Giỏ hàng đang trống!");

        return;

    }

    buyNowProduct = null;

    overlay.style.display = "none";

    informationOverlay.style.display = "flex";

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

    let products = [];

    if (buyNowProduct) {

        products.push(buyNowProduct);

    } else {

        products =
            JSON.parse(localStorage.getItem("shoppingList")) || [];

    }

    if (products.length === 0) {

        alert("Không có sản phẩm để thanh toán!");

        return;

    }

    let totalQuantity = 0;
    let totalPrice = 0;

    products.forEach(item => {

        totalQuantity += item.quantity;
        totalPrice += item.productPrice * item.quantity;

    });

    let userInfo = {

        name: name,
        phone: phone,
        address: address

    };

    let orderInfo = {

        products: products,
        totalQuantity: totalQuantity,
        totalPrice: totalPrice

    };

    localStorage.setItem(
        "userInfo",
        JSON.stringify(userInfo)
    );

    localStorage.setItem(
        "orderInfo",
        JSON.stringify(orderInfo)
    );

    buyNowProduct = null;

    informationOverlay.style.display = "none";
    overlay.style.display = "none";

    if (buyNowProduct) {

        localStorage.removeItem("shoppingList");
    
    }
    window.location.href = "confirm.html";

});