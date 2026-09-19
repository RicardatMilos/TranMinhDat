let table = document.getElementById('table');

const STATUS_PENDING = "Đang xử lý";
const STATUS_CONFIRMED = "Đã xác nhận";
const STATUS_CANCELLED = "Đã hủy";

// Matches the order shape written by confirm.js:
// { orderID, customerName, customerPhone, customerAddress,
//   totalQuantity, totalPrice, discountCode, status, createdAt, products }
window.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});

function loadOrders() {
    // Clear everything except the header row before redrawing
    table.querySelectorAll('tr:not(:first-child)').forEach(tr => tr.remove());

    db.collection("orders").orderBy("createdAt", "desc").get()
        .then((snapshot) => {
            let index = 0;

            snapshot.forEach((doc) => {
                index++;
                renderOrderRow(index, doc.id, doc.data());
            });
        })
        .catch((error) => {
            console.error("Lỗi khi tải đơn hàng:", error);
        });
}

function renderOrderRow(stt, docId, order) {

    let tableRow = document.createElement('tr');
    let orderNumber = document.createElement('td');
    let orderCustomer = document.createElement('td');
    let orderPhone = document.createElement('td');
    let orderOverallPrice = document.createElement('td');
    let orderStatusCell = document.createElement('td');
    let action = document.createElement('td');

    orderNumber.classList.add('order-number');
    orderCustomer.classList.add('order-name');
    orderPhone.classList.add('order-phone');
    orderStatusCell.classList.add('order-status');
    action.classList.add('action');

    table.appendChild(tableRow);
    tableRow.appendChild(orderNumber);
    tableRow.appendChild(orderCustomer);
    tableRow.appendChild(orderPhone);
    tableRow.appendChild(orderOverallPrice);
    tableRow.appendChild(orderStatusCell);
    tableRow.appendChild(action);

    // Content
    orderNumber.innerHTML = stt;
    orderCustomer.innerHTML = order.customerName || '';
    orderPhone.innerHTML = order.customerPhone || '';
    orderOverallPrice.innerHTML = Number(order.totalPrice || 0).toLocaleString("vi-VN") + 'đ';

    // 🗑️ Xóa đơn hàng — luôn hiển thị, không phụ thuộc trạng thái
    let deleteIcon = document.createElement('ion-icon');
    deleteIcon.name = 'trash-outline';
    deleteIcon.style.fontSize = '20px';
    deleteIcon.style.marginLeft = '12px';
    deleteIcon.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa đơn hàng này không?')) {
            db.collection("orders").doc(docId).delete()
                .then(() => {
                    tableRow.remove();
                    alert('Đã xóa đơn hàng thành công!');
                })
                .catch(error => console.error("Lỗi khi xóa đơn hàng:", error));
        }
    });

    // Vẽ badge trạng thái + nút Xác nhận/Hủy (khi đang chờ xử lý),
    // và tự vẽ lại khi trạng thái đổi.
    function paint(status) {
        renderStatusBadge(orderStatusCell, status);

        action.innerHTML = '';

        if (status === STATUS_PENDING) {
            action.appendChild(buildActionButtons(docId, paint));
        }

        action.appendChild(deleteIcon);
    }

    paint(order.status || STATUS_PENDING);
}

function renderStatusBadge(cell, status) {
    cell.innerHTML = '';

    let badge = document.createElement('span');
    badge.classList.add('status-badge');
    badge.textContent = status;

    if (status === STATUS_CONFIRMED) {
        badge.classList.add('status-confirmed');
    } else if (status === STATUS_CANCELLED) {
        badge.classList.add('status-cancelled');
    } else {
        badge.classList.add('status-pending');
    }

    cell.appendChild(badge);
}

// Builds the "Xác nhận" / "Hủy" button pair for a pending order.
// `onStatusChanged` is called with the new status once Firestore confirms
// the update, so the row can repaint itself (badge + buttons removed).
function buildActionButtons(docId, onStatusChanged) {
    let wrapper = document.createElement('span');
    wrapper.classList.add('order-actions');

    let confirmBtn = document.createElement('button');
    confirmBtn.type = 'button';
    confirmBtn.classList.add('btn-confirm-order');
    confirmBtn.textContent = 'Xác nhận';

    let cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.classList.add('btn-cancel-order');
    cancelBtn.textContent = 'Hủy';

    confirmBtn.addEventListener('click', () => {
        updateOrderStatus(docId, STATUS_CONFIRMED, onStatusChanged);
    });

    cancelBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn hủy đơn hàng này không?')) {
            updateOrderStatus(docId, STATUS_CANCELLED, onStatusChanged);
        }
    });

    wrapper.appendChild(confirmBtn);
    wrapper.appendChild(cancelBtn);

    return wrapper;
}

function updateOrderStatus(docId, newStatus, onStatusChanged) {
    db.collection("orders").doc(docId).update({ status: newStatus })
        .then(() => {
            onStatusChanged(newStatus);
        })
        .catch(err => console.error("Lỗi khi cập nhật đơn hàng:", err));
}