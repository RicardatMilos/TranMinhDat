let container = document.getElementById("new-product-wrapper");
let container1 = document.getElementById("new-product-wrapper-one");

let moreProduct = document.querySelectorAll(".more-product");

let cart = document.getElementById("cart");
let overlay = document.getElementById("overlay");
let returnButton = document.getElementById("return-button");

let cartOverallContainer = document.getElementById("cart-overall-container");
let cartOverallQuantity = document.getElementById("cart-overall-quantity");
let cartOverallPrice = document.getElementById("cart-overall-price");

let cartOverallPurchaseButton = document.getElementById("cart-overall-purchase-button");

let informationOverlay = document.getElementById("information-overlay");

let inpName = document.getElementById("name");
let inpPhone = document.getElementById("phone");
let inpAddress = document.getElementById("address");

let continueButton = document.getElementById("continue-button");
let backInformationButton = document.getElementById("back-information-button");

window.addEventListener("DOMContentLoaded", () => {

    loadNewProducts();

    loadRecommendProducts();

});

function loadNewProducts() {

    db.collection("products").get().then(snapshot => {

        const docs = snapshot.docs;

        for (let i = 0; i < docs.length && i < 4; i++) {

            createProductCard(container, docs[i].data(), true);

        }

    });

}

function loadRecommendProducts() {

    db.collection("products").get().then(snapshot => {

        const docs = snapshot.docs;

        for (let i = 0; i < docs.length && i < 2; i++) {

            createProductCard(container1, docs[i].data(), false);

        }

    });

}

function createProductCard(parent, product, canClick) {

    let cardContainer = document.createElement("div");
    let productImage = document.createElement("img");
    let productDetails = document.createElement("div");
    let productName = document.createElement("p");
    let productPrice = document.createElement("p");

    cardContainer.classList.add("single-new-product");
    productImage.classList.add("product-image");
    productDetails.classList.add("product-details");
    productName.classList.add("product-name");
    productPrice.classList.add("product-price");

    productImage.src = product.productImage;
    productName.innerHTML = product.productName;
    productPrice.innerHTML =
        Number(product.productPrice).toLocaleString("vi-VN") + "đ";

    parent.appendChild(cardContainer);

    cardContainer.appendChild(productImage);
    cardContainer.appendChild(productDetails);

    productDetails.appendChild(productName);
    productDetails.appendChild(productPrice);

    if (canClick) {

        cardContainer.addEventListener("click", () => {

            localStorage.setItem("ID", product.productSku);

            window.location.href = "product-overview.html";

        });

    }

}

moreProduct.forEach(button => {

    button.addEventListener("click", () => {

        window.location.href = "../html/product.html";

    });

});

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