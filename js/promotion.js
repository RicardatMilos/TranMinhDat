// ============================================================
// promotion.js — Khuyến Mãi: tính giá sau giảm & hiển thị banner
// Dùng chung cho index.html, product.html, product-overview.html
// LƯU Ý: firebase_config.js (biến `db`) phải được nạp TRƯỚC file này,
// và file này phải được nạp TRƯỚC main.js / product.js / product-overview.js
// ============================================================

// Sản phẩm có đang trong thời gian khuyến mãi tại thời điểm `now` không?
function isPromotionActive(product, now) {
    now = now || new Date();

    if (!product || !product.discountType || !product.discountValue) return false;
    if (!product.discountStart || !product.discountEnd) return false;

    let start = new Date(product.discountStart);
    let end = new Date(product.discountEnd);

    if (isNaN(start) || isNaN(end)) return false;

    return now >= start && now <= end;
}

// Giá sau khi áp khuyến mãi (nếu đang diễn ra), luôn >= 0. Nếu không có KM thì trả về giá gốc.
function getDiscountedPrice(product, now) {
    let originalPrice = Number(product.productPrice) || 0;

    if (!isPromotionActive(product, now)) return originalPrice;

    let discounted = originalPrice;

    if (product.discountType === "percent") {
        discounted = originalPrice * (1 - Number(product.discountValue) / 100);
    } else if (product.discountType === "fixed") {
        discounted = originalPrice - Number(product.discountValue);
    }

    return Math.max(0, Math.round(discounted));
}

function formatVND(number) {
    return Number(number).toLocaleString("vi-VN") + "đ";
}

function promoBadgeText(product) {
    return product.discountType === "percent"
        ? "-" + Number(product.discountValue) + "%"
        : "-" + formatVND(product.discountValue);
}

// Gắn markup giá (giá KM + giá gốc gạch ngang + badge) vào 1 phần tử.
// Nếu sản phẩm không có khuyến mãi đang chạy, chỉ hiện giá bình thường — không đổi giao diện gốc.
function renderPriceInto(el, product, now) {
    if (!el) return;

    let originalPrice = Number(product.productPrice) || 0;

    if (!isPromotionActive(product, now)) {
        el.innerHTML = formatVND(originalPrice);
        return;
    }

    let discountedPrice = getDiscountedPrice(product, now);

    el.innerHTML =
        '<span class="promo-price-wrap">' +
            '<span class="promo-price-new">' + formatVND(discountedPrice) + '</span>' +
            '<span class="promo-price-old">' + formatVND(originalPrice) + '</span>' +
            '<span class="promo-badge">' + promoBadgeText(product) + '</span>' +
        '</span>';
}

// Danh sách sản phẩm đang có khuyến mãi tại thời điểm hiện tại (dùng cho popup)
function fetchActivePromotions() {
    return db.collection("products").get().then(snapshot => {
        let now = new Date();
        let result = [];

        snapshot.forEach(doc => {
            let product = doc.data();
            if (isPromotionActive(product, now)) {
                result.push(product);
            }
        });

        return result;
    });
}

// Hiện popup "Đang có khuyến mãi" mỗi khi vào trang, nếu có ít nhất 1 sản phẩm đang giảm giá.
function showPromotionPopupIfAny() {
    fetchActivePromotions().then(products => {
        if (products.length === 0) return;

        let overlay = document.createElement("div");
        overlay.className = "promo-popup-overlay";

        let itemsHtml = products.slice(0, 5).map(p => {
            return (
                '<li class="promo-popup-item">' +
                    '<img src="' + p.productImage + '" alt="">' +
                    '<div>' +
                        '<p class="promo-popup-item-name">' + p.productName + '</p>' +
                        '<p class="promo-popup-item-price">' +
                            formatVND(getDiscountedPrice(p)) +
                            '<span class="promo-popup-item-old">' + formatVND(p.productPrice) + '</span>' +
                        '</p>' +
                    '</div>' +
                    '<span class="promo-badge">' + promoBadgeText(p) + '</span>' +
                '</li>'
            );
        }).join("");

        let moreText = products.length > 5
            ? '<p class="promo-popup-more">và ' + (products.length - 5) + ' sản phẩm khác đang giảm giá</p>'
            : "";

        overlay.innerHTML =
            '<div class="promo-popup-box">' +
                '<ion-icon name="close-outline" class="promo-popup-close"></ion-icon>' +
                '<p class="promo-popup-eyebrow">Ưu đãi có thời hạn</p>' +
                '<h3 class="promo-popup-title">Đang có khuyến mãi!</h3>' +
                '<ul class="promo-popup-list">' + itemsHtml + '</ul>' +
                moreText +
                '<button class="promo-popup-cta">Xem ngay</button>' +
            '</div>';

        document.body.appendChild(overlay);

        overlay.querySelector(".promo-popup-close").addEventListener("click", () => {
            overlay.remove();
        });

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) overlay.remove();
        });

        overlay.querySelector(".promo-popup-cta").addEventListener("click", () => {
            overlay.remove();

            let inHtmlFolder = window.location.pathname.includes("/html/");
            let onProductListPage = window.location.pathname.endsWith("product.html");

            if (!onProductListPage) {
                window.location.href = inHtmlFolder ? "product.html" : "html/product.html";
            }
        });
    }).catch(error => console.error("Lỗi khi tải khuyến mãi:", error));
}

window.addEventListener("DOMContentLoaded", () => {
    // File này được nạp chung ở cả index.html, product.html, product-overview.html
    // (để dùng chung hàm tính giá khuyến mãi), nhưng banner popup thì chỉ nên
    // tự bật ở trang chủ (index.html) — 2 trang kia nằm trong thư mục /html/.
    let inHtmlFolder = window.location.pathname.includes("/html/");
    if (inHtmlFolder) return;

    showPromotionPopupIfAny();
});