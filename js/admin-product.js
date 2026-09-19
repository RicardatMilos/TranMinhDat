let productNameInput = document.getElementById('product-name-input')
let productStorageInput = document.getElementById('product-storage-input')
let productPriceInput = document.getElementById('product-price-input')
let productImageInput = document.getElementById('product-image-input')
let productSkuInput = document.getElementById('product-sku-input')
let productDescriptionInput = document.getElementById('product-description-input')
let cancelButton = document.getElementById('cancel-button')
let submitButton = document.getElementById('submit-button')
let addProductButton = document.getElementById('add-product-button')
let addProductForm = document.getElementById('add-product-form')
let table = document.getElementById('table')
let form = document.getElementById('form')

let checkList1 = document.getElementById('list1');
let checkList2 = document.getElementById('list2');

let colorCheckboxes = document.querySelectorAll(
    '#list1 input[type="checkbox"]'
);

let sizeCheckboxes = document.querySelectorAll(
    '#list2 input[type="checkbox"]'
);

let numberRegex = /^\d+$/

// Doc id of the product currently being edited (null = "add" mode)
let editingDocId = null;

// 🧠 Load products from Firestore when page opens
window.addEventListener('DOMContentLoaded', () => {
    db.collection("products").get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                renderProductRow(doc.id, doc.data());
            });
        })
        .catch((error) => {
            console.error("Lỗi khi tải sản phẩm:", error);
        });
});

// Builds one <tr> for a product and wires up its edit/delete icons.
// Used both for products loaded from Firestore and for a product just added,
// so there is exactly ONE place that creates rows (no more duplicated /
// double-bound edit handlers).
function renderProductRow(docId, product) {

    let tableRow = document.createElement('tr');
    let productImageData = document.createElement('td');
    let productNameData = document.createElement('td');
    let productStorageData = document.createElement('td');
    let productPriceData = document.createElement('td');
    let action = document.createElement('td');
    let icon1 = document.createElement('ion-icon');
    let icon2 = document.createElement('ion-icon');
    let productImage = document.createElement('img');

    table.appendChild(tableRow);
    tableRow.appendChild(productImageData);
    productImageData.appendChild(productImage);
    tableRow.appendChild(productNameData);
    tableRow.appendChild(productStorageData);
    tableRow.appendChild(productPriceData);
    tableRow.appendChild(action);
    action.appendChild(icon1);
    action.appendChild(icon2);

    // Style — chỉ set những gì CSS chung (admin-common.css) không cover,
    // phần còn lại (màu, border, font, hover...) để CSS lo, tránh đè lên theme.
    productImage.style.width = '56px';
    productImage.style.height = '56px';
    productImage.style.objectFit = 'cover';
    productImage.style.borderRadius = '8px';
    productStorageData.style.textAlign = 'center';
    productPriceData.style.textAlign = 'center';
    action.classList.add('action');
    icon1.style.fontSize = '20px';
    icon2.style.fontSize = '20px';
    icon1.style.marginRight = '12px';

    // Content
    productImage.src = product.productImage;
    productNameData.innerHTML = product.productName;
    productStorageData.innerHTML = product.productStorage;
    productPriceData.innerHTML = Number(product.productPrice).toLocaleString("vi-VN") + 'đ';
    icon1.name = 'create-outline';
    icon2.name = 'trash-outline';

    // ✏️ EDIT — open the form pre-filled with this product's data
    icon1.addEventListener('click', () => {
        editingDocId = docId;

        productNameInput.value = product.productName;
        productStorageInput.value = product.productStorage;
        productPriceInput.value = product.productPrice;
        productSkuInput.value = product.productSku;
        productDescriptionInput.value = product.productDescription;

        colorCheckboxes.forEach(cb => {
            cb.checked = product.productColors
                ? product.productColors.includes(cb.id)
                : false;
        });

        sizeCheckboxes.forEach(cb => {
            cb.checked = product.productSizes
                ? product.productSizes.includes(cb.id)
                : false;
        });

        addProductForm.style.display = 'flex';
        submitButton.textContent = 'Cập nhật sản phẩm';
    });

    // 🗑️ DELETE — remove by document id (safe even if two products share a name)
    icon2.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này không?')) {
            db.collection("products").doc(docId).delete()
                .then(() => {
                    tableRow.remove();
                    alert('Đã xóa sản phẩm thành công!');
                })
                .catch(error => console.error("Lỗi khi xóa sản phẩm:", error));
        }
    });

    return { tableRow, productImage, productNameData, productStorageData, productPriceData };
}

addProductButton.addEventListener('click', (e) => {
    e.preventDefault();

    editingDocId = null;
    form.reset();
    colorCheckboxes.forEach(cb => cb.checked = false);
    sizeCheckboxes.forEach(cb => cb.checked = false);
    submitButton.textContent = 'Thêm sản phẩm';

    addProductForm.style.display = 'flex';
});

cancelButton.addEventListener('click', (e) => {
    e.preventDefault();

    editingDocId = null;
    addProductForm.style.display = 'none';
});

// ONE submit handler, used for both "add" and "edit" (branches on editingDocId).
// This replaces the old code that rebuilt/rebound a brand-new submitButton
// listener every time you clicked edit — which was stacking duplicate
// listeners and firing updates more than once.
submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    let productName = productNameInput.value.trim();
    let productStorage = productStorageInput.value.trim();
    let productPrice = productPriceInput.value.trim();
    let productSku = productSkuInput.value.trim();
    let productDescription = productDescriptionInput.value.trim();

    let selectedColors = [...colorCheckboxes]
        .filter(cb => cb.checked)
        .map(cb => cb.id);

    let selectedSizes = [...sizeCheckboxes]
        .filter(cb => cb.checked)
        .map(cb => cb.id);

    // When editing, an image isn't required (keep the existing one) —
    // it's only required when adding a brand-new product.
    let needsImage = editingDocId === null;

    if (
        !productName ||
        !productStorage ||
        !productPrice ||
        (needsImage && productImageInput.files.length === 0) ||
        !productSku ||
        !productDescription ||
        selectedColors.length === 0 ||
        selectedSizes.length === 0
    ) {
        alert("Vui lòng điền đầy đủ thông tin, màu sắc và size");
        return;
    }

    if (!numberRegex.test(productStorage) || !numberRegex.test(productPrice)) {
        alert('Vui lòng điền thông tin hợp lệ');
        return;
    }

    let productData = {
        productName,
        productStorage,
        productPrice,
        productSku,
        productDescription,
        productColors: selectedColors,
        productSizes: selectedSizes
    };

    if (editingDocId !== null) {
        // ----- UPDATE existing product -----
        let file = productImageInput.files[0];

        let saveUpdate = (imageUrl) => {
            if (imageUrl) productData.productImage = imageUrl;

            db.collection("products").doc(editingDocId).update(productData)
                .then(() => {
                    alert("Cập nhật sản phẩm thành công!");
                    addProductForm.style.display = 'none';
                    editingDocId = null;
                    submitButton.textContent = 'Thêm sản phẩm';
                    refreshTable();
                })
                .catch(err => console.error("Lỗi khi cập nhật:", err));
        };

        if (file) {
            uploadToCloudinary(file)
                .then(imageUrl => saveUpdate(imageUrl))
                .catch(err => console.error("Upload failed:", err));
        } else {
            saveUpdate(null);
        }

    } else {
        // ----- ADD new product -----
        let file = productImageInput.files[0];

        uploadToCloudinary(file)
            .then(imageUrl => {
                productData.productImage = imageUrl;
                return db.collection("products").add(productData);
            })
            .then(() => {
                alert("Thêm Sản Phẩm Thành Công!");
                addProductForm.style.display = "none";
                refreshTable();
            })
            .catch(err => {
                console.error("Upload or save failed:", err);
            });
    }
});

// Uploads a file to Cloudinary and resolves with the resulting secure_url.
function uploadToCloudinary(file) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "FinalProject");

    return fetch("https://api.cloudinary.com/v1_1/dxqtscsrt/image/upload", {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(data => data.secure_url);
}

// Re-pulls the product list from Firestore and redraws the table, instead of
// hand-building a preview row that could drift out of sync with what was
// actually saved.
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

checkList1.getElementsByClassName('anchor')[0].onclick = function (e) {
    if (checkList1.classList.contains('visible'))
        checkList1.classList.remove('visible');
    else
        checkList1.classList.add('visible');
}

checkList2.getElementsByClassName('anchor')[0].onclick = function (e) {
    if (checkList2.classList.contains('visible'))
        checkList2.classList.remove('visible');
    else
        checkList2.classList.add('visible');
}