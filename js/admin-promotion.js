let table = document.getElementById('table');

let promoFormOverlay = document.getElementById('promo-form-overlay');
let promoForm = document.getElementById('promo-form');
let promoFormProductName = document.getElementById('promo-form-product-name');

let discountTypePercent = document.getElementById('discount-type-percent');
let discountTypeFixed = document.getElementById('discount-type-fixed');
let discountValueInput = document.getElementById('discount-value-input');
let discountStartInput = document.getElementById('discount-start-input');
let discountEndInput = document.getElementById('discount-end-input');

let promoCancelButton = document.getElementById('promo-cancel-button');
let promoRemoveButton = document.getElementById('promo-remove-button');

let editingDocId = null;

// 🧠 Load products from Firestore when page opens
window.addEventListener('DOMContentLoaded', () => {
    refreshTable();
});

function refreshTable() {
    table.querySelectorAll('tr:not(:first-child)').forEach(tr => tr.remove());

    db.collection("products").get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                renderProductRow(doc.id, doc.data());
            });
        })
        .catch((error) => {
            console.error("Lỗi khi tải sản phẩm:", error);
        });
}

// Trả về { text, className } mô tả trạng thái khuyến mãi hiện tại của 1 sản phẩm
function getPromotionStatus(product) {
    if (!product.discountType || !product.discountValue || !product.discountStart || !product.discountEnd) {
        return { text: "Không có khuyến mãi", className: "promo-status-none" };
    }

    let now = new Date();
    let start = new Date(product.discountStart);
    let end = new Date(product.discountEnd);

    if (now < start) {
        return { text: "Đã lên lịch — bắt đầu " + start.toLocaleString("vi-VN"), className: "promo-status-scheduled" };
    }

    if (now > end) {
        return { text: "Đã kết thúc", className: "promo-status-none" };
    }

    let badge = product.discountType === "percent"
        ? "-" + Number(product.discountValue) + "%"
        : "-" + Number(product.discountValue).toLocaleString("vi-VN") + "đ";

    return { text: "Đang diễn ra (" + badge + ") — hết hạn " + end.toLocaleString("vi-VN"), className: "promo-status-active" };
}

function renderProductRow(docId, product) {

    let tableRow = document.createElement('tr');
    let imageData = document.createElement('td');
    let nameData = document.createElement('td');
    let priceData = document.createElement('td');
    let statusData = document.createElement('td');
    let actionData = document.createElement('td');

    let image = document.createElement('img');
    let statusBadge = document.createElement('span');
    let setButton = document.createElement('button');

    table.appendChild(tableRow);
    tableRow.appendChild(imageData);
    tableRow.appendChild(nameData);
    tableRow.appendChild(priceData);
    tableRow.appendChild(statusData);
    tableRow.appendChild(actionData);

    imageData.classList.add('promo-image');
    imageData.appendChild(image);

    image.src = product.productImage;
    image.style.width = '56px';
    image.style.height = '56px';
    image.style.objectFit = 'cover';
    image.style.borderRadius = '8px';

    nameData.innerHTML = product.productName;

    priceData.innerHTML = Number(product.productPrice).toLocaleString("vi-VN") + 'đ';
    priceData.style.textAlign = 'center';

    let status = getPromotionStatus(product);
    statusBadge.className = 'promo-status-badge ' + status.className;
    statusBadge.textContent = status.text;
    statusData.appendChild(statusBadge);

    actionData.classList.add('action');
    setButton.type = 'button';
    setButton.className = 'promo-set-button';
    setButton.textContent = status.className === 'promo-status-none' ? 'Đặt Khuyến Mãi' : 'Sửa Khuyến Mãi';
    actionData.appendChild(setButton);

    setButton.addEventListener('click', () => {
        openPromoForm(docId, product);
    });

    return { tableRow };
}

function toDatetimeLocalValue(date) {
    let pad = (n) => String(n).padStart(2, '0');
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate())
        + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
}

function openPromoForm(docId, product) {
    editingDocId = docId;

    promoFormProductName.textContent = product.productName + ' — Giá gốc: '
        + Number(product.productPrice).toLocaleString('vi-VN') + 'đ';

    if (product.discountType === 'fixed') {
        discountTypeFixed.checked = true;
    } else {
        discountTypePercent.checked = true;
    }

    discountValueInput.value = product.discountValue || '';

    let now = new Date();
    let inOneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    discountStartInput.value = product.discountStart
        ? toDatetimeLocalValue(new Date(product.discountStart))
        : toDatetimeLocalValue(now);

    discountEndInput.value = product.discountEnd
        ? toDatetimeLocalValue(new Date(product.discountEnd))
        : toDatetimeLocalValue(inOneWeek);

    promoRemoveButton.style.display = product.discountType ? 'inline-block' : 'none';

    promoFormOverlay.style.display = 'flex';
}

function closePromoForm() {
    editingDocId = null;
    promoForm.reset();
    promoFormOverlay.style.display = 'none';
}

promoCancelButton.addEventListener('click', () => {
    closePromoForm();
});

promoFormOverlay.addEventListener('click', (e) => {
    if (e.target === promoFormOverlay) closePromoForm();
});

promoRemoveButton.addEventListener('click', () => {
    if (editingDocId === null) return;

    if (!confirm('Gỡ khuyến mãi cho sản phẩm này?')) return;

    db.collection('products').doc(editingDocId).update({
        discountType: firebase.firestore.FieldValue.delete(),
        discountValue: firebase.firestore.FieldValue.delete(),
        discountStart: firebase.firestore.FieldValue.delete(),
        discountEnd: firebase.firestore.FieldValue.delete()
    }).then(() => {
        alert('Đã gỡ khuyến mãi!');
        closePromoForm();
        refreshTable();
    }).catch(error => console.error('Lỗi khi gỡ khuyến mãi:', error));
});

promoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (editingDocId === null) return;

    let discountType = discountTypeFixed.checked ? 'fixed' : 'percent';
    let discountValue = Number(discountValueInput.value);
    let start = new Date(discountStartInput.value);
    let end = new Date(discountEndInput.value);

    if (!discountValueInput.value || isNaN(discountValue) || discountValue <= 0) {
        alert('Vui lòng nhập giá trị giảm hợp lệ (lớn hơn 0)');
        return;
    }

    if (discountType === 'percent' && discountValue > 100) {
        alert('Giảm theo phần trăm không được vượt quá 100%');
        return;
    }

    if (!discountStartInput.value || !discountEndInput.value || isNaN(start) || isNaN(end)) {
        alert('Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc');
        return;
    }

    if (start >= end) {
        alert('Thời gian kết thúc phải sau thời gian bắt đầu');
        return;
    }

    db.collection('products').doc(editingDocId).update({
        discountType: discountType,
        discountValue: discountValue,
        discountStart: start.toISOString(),
        discountEnd: end.toISOString()
    }).then(() => {
        alert('Đã lưu khuyến mãi!');
        closePromoForm();
        refreshTable();
    }).catch(error => console.error('Lỗi khi lưu khuyến mãi:', error));
});
