let table = document.getElementById('table')

window.addEventListener('DOMContentLoaded', () => {
    db.collection("orders").get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const product = doc.data();

                // Build product row in the table
                let tableRow = document.createElement('tr');
                let orderNumber = document.createElement('td');
                let orderCustomer = document.createElement('td');
                let orderPhone = document.createElement('td');
                let orderOverallPrice = document.createElement('td');
                let action = document.createElement('td');
                let icon1 = document.createElement('ion-icon');
                let icon2 = document.createElement('ion-icon');

                table.appendChild(tableRow);
                tableRow.appendChild(orderNumber);
                productImageData.appendChild(orderCustomer);
                tableRow.appendChild(orderPhone);
                tableRow.appendChild(orderOverallPrice);
                tableRow.appendChild(action);
                action.appendChild(icon1);
                action.appendChild(icon2);

                // Add CSS and content
                productImage.style.width = '100%';
                productNameData.style.borderLeft = '1px black solid';
                productNameData.style.fontSize = '15px';
                productNameData.style.textAlign = 'left';
                productNameData.style.paddingLeft = '10px'
                productStorageData.style.borderLeft = '1px black solid';
                productStorageData.style.fontSize = '20px';
                productStorageData.style.textAlign = 'center';
                productPriceData.style.borderLeft = '1px black solid';
                productPriceData.style.fontSize = '20px';
                productPriceData.style.textAlign = 'center';
                action.style.borderLeft = '1px black solid';
                action.style.fontSize = '30px';
                action.style.textAlign = 'center';
                icon1.style.margin = '10px';
                icon2.style.margin = '10px';

                // Fill in data from Firestore
                productImage.src = order.productImage;
                orderCustomer.innerHTML = orders.customerName;
                orderPhone.innerHTML = orders.customerPhone;
                orderOverallPrice.innerHTML = orders.totalPrice + 'đ';
                icon1.name = 'create-outline';
                icon2.name = 'trash-outline';

                // ✏️ EDIT function
                icon1.addEventListener('click', () => {
                    // Đổ dữ liệu cũ vào form
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

                    // Hiện form lên để sửa
                    addProductForm.style.display = 'flex';
                    submitButton.textContent = 'Cập nhật sản phẩm';

                    // Gỡ bỏ event cũ của submit (tránh bị trùng)
                    let newSubmitButton = submitButton.cloneNode(true);
                    submitButton.parentNode.replaceChild(newSubmitButton, submitButton);
                    submitButton = newSubmitButton;

                    // Khi bấm nút "Cập nhật sản phẩm"
                    submitButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        
                        let newName = productNameInput.value.trim();
                        let newStorage = productStorageInput.value.trim();
                        let newPrice = productPriceInput.value.trim();
                        let newSku = productSkuInput.value.trim();
                        let newDescription = productDescriptionInput.value.trim()

                        if (!newName || !newStorage || !newPrice || !newSku || !newDescription) {
                            alert("Vui lòng nhập đầy đủ thông tin");
                            return;
                        }

                        // Cập nhật Firestore
                        db.collection("products").where("productName", "==", product.productName).get()
                            .then(snapshot => {
                                snapshot.forEach(doc => {
                                    let selectedColors = [...colorCheckboxes]
                                        .filter(cb => cb.checked)
                                        .map(cb => cb.id);
                                
                                    let selectedSizes = [...sizeCheckboxes]
                                        .filter(cb => cb.checked)
                                        .map(cb => cb.id);

                                    db.collection("products").doc(doc.id).update({
                                        productName: newName,
                                        productStorage: newStorage,
                                        productPrice: newPrice,
                                        productSku: newSku,
                                        productDescription: newDescription,

                                        productColors: selectedColors,
                                        productSizes: selectedSizes
                                    });
                                });

                                // Cập nhật giao diện
                                productNameData.innerHTML = newName;
                                productStorageData.innerHTML = newStorage;
                                productPriceData.innerHTML = newPrice + 'đ';

                                alert("Cập nhật sản phẩm thành công!");
                                addProductForm.style.display = 'none';
                                submitButton.textContent = 'Thêm sản phẩm'; // đổi lại nút
                            })
                            .catch(err => console.error("Lỗi khi cập nhật:", err));
                    });
                });
                                
                
                // Delete function
                icon2.addEventListener('click', () => {
                    if (confirm('Bạn có chắc muốn xóa sản phẩm này không?')) {
                        db.collection("products").where("productName", "==", product.productName).get()
                            .then(snapshot => {
                                snapshot.forEach(doc => {
                                    db.collection("products").doc(doc.id).delete()
                                        .then(() => {
                                            tableRow.remove(); // remove row from UI
                                            alert('Đã xóa sản phẩm thành công!');
                                        });
                                });
                            })
                            .catch(error => console.error("Lỗi khi xóa sản phẩm:", error));
                    }
                });
                                
            });
        })
        .catch((error) => {
            console.error("Lỗi khi tải sản phẩm:", error);
        });
});