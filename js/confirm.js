let productContainer = document.getElementById("product-container");
let inpDiscount = document.getElementById("discount");
let applyDiscount = document.getElementById("apply-discount");
let confirmButton = document.getElementById("confirm-button");

let paymentOverlay = document.getElementById("payment-overlay");
let backPaymentButton = document.getElementById("back-payment-button");
let pricePaymentContainer = document.getElementById("price-payment-container");

const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const orderInfo = JSON.parse(localStorage.getItem("orderInfo"));

if (!userInfo || !orderInfo) {

    alert("Không tìm thấy thông tin đơn hàng!");

    window.location.href = "main.html";

}

let originalPrice = orderInfo.totalPrice;
let finalPrice = originalPrice;
let isDiscountApplied = false;

document.getElementById("customer-name").innerHTML = userInfo.name;
document.getElementById("customer-phone").innerHTML = userInfo.phone;
document.getElementById("customer-address").innerHTML = userInfo.address;
document.getElementById("customer-quantity").innerHTML = orderInfo.totalQuantity;

updatePrice();
renderCart();

function updatePrice() {

    let customerPrice = document.getElementById("customer-price");

    if (isDiscountApplied) {

        customerPrice.innerHTML = `
            <span style="text-decoration:line-through;color:gray;margin-right:10px;">
                ${originalPrice.toLocaleString("vi-VN")}đ
            </span>

            <span style="color:red;font-size:24px;font-weight:bold;">
                ${finalPrice.toLocaleString("vi-VN")}đ
            </span>
        `;

    } else {

        customerPrice.innerHTML = `
            <span style="color:red;font-size:24px;font-weight:bold;">
                ${originalPrice.toLocaleString("vi-VN")}đ
            </span>
        `;

    }

}

function renderCart() {

    productContainer.innerHTML = "";

    let products = orderInfo.products || [];

    products.forEach(item => {

        let productDiv = document.createElement("div");

        productDiv.style.display = "flex";
        productDiv.style.alignItems = "center";
        productDiv.style.gap = "20px";
        productDiv.style.marginBottom = "20px";
        productDiv.style.paddingBottom = "10px";
        productDiv.style.borderBottom = "1px solid #ddd";
        productDiv.style.textAlign = "left";

        productDiv.innerHTML = `

            <img
                src="${item.productImage}"
                width="80"
                height="80"
                style="border-radius:10px;">

            <div>

                <h5>${item.productName}</h5>

                <p style="color:red;margin:0;">
                    ${Number(item.productPrice).toLocaleString("vi-VN")}đ
                </p>

                <p>Số lượng: ${item.quantity}</p>

            </div>

        `;

        productContainer.appendChild(productDiv);

    });

}

applyDiscount.addEventListener("click", (e) => {

    e.preventDefault();

    if (isDiscountApplied) {

        alert("Mã giảm giá đã được sử dụng!");

        return;

    }

    let code = inpDiscount.value.trim();

    if (code === "DaiGiamGia0108") {

        finalPrice = originalPrice * 0.9;

        isDiscountApplied = true;

        updatePrice();

        alert("Áp dụng mã giảm giá thành công!");

    } else {

        alert("Mã giảm giá không hợp lệ!");

    }

});

confirmButton.addEventListener("click", async (e) => {

    e.preventDefault();

    const orderID = "DH" + Date.now();

    const orderData = {

        orderID: orderID,

        customerName: userInfo.name,

        customerPhone: userInfo.phone,

        customerAddress: userInfo.address,

        totalQuantity: orderInfo.totalQuantity,

        totalPrice: finalPrice,

        discountCode: isDiscountApplied
            ? inpDiscount.value.trim()
            : "",

        status: "Đang xử lý",

        createdAt: firebase.firestore.FieldValue.serverTimestamp(),

        products: orderInfo.products

    };

    try {

        await db.collection("orders").doc(orderID).set(orderData);

        paymentOverlay.style.display = "flex";

        if (isDiscountApplied) {

            pricePaymentContainer.innerHTML = `

                <p style="text-decoration:line-through;color:gray;">
                    ${originalPrice.toLocaleString("vi-VN")}đ
                </p>

                <h2 style="color:red;">
                    ${finalPrice.toLocaleString("vi-VN")}đ
                </h2>

            `;

        } else {

            pricePaymentContainer.innerHTML = `

                <h2 style="color:red;">
                    ${originalPrice.toLocaleString("vi-VN")}đ
                </h2>

            `;

        }

        localStorage.removeItem("shoppingList");
        localStorage.removeItem("orderInfo");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("ID");

        setTimeout(() => {

            paymentOverlay.style.display = "none";

            window.location.href = "main.html";

        }, 3000);

    } catch (error) {

        console.log(error);

        alert("Đặt hàng thất bại!");

    }

});

backPaymentButton.addEventListener("click", () => {

    paymentOverlay.style.display = "none";

});