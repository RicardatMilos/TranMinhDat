let container = document.getElementById('new-product-wrapper');
let container1= document.getElementById('new-product-wrapper-one')
let moreProduct = document.querySelectorAll('.more-product')
let paymentContainer = document.getElementById('payment-container')
let backButton = document.getElementById('back-button')
let paymentSubmit = document.getElementById('payment-submit')

window.addEventListener('DOMContentLoaded', () => {
    db.collection('products').get()
        .then((snapshot) => {

            // Lấy toàn bộ docs
            const docs = snapshot.docs;

            // Giới hạn tối đa 4 sản phẩm
            for (let i = 0; i < docs.length && i < 4; i++) {

                const product = docs[i].data();

                let cardContainer = document.createElement('div');
                let productImage = document.createElement('img');
                let productDetails = document.createElement('div');
                let productName = document.createElement('p');
                let productPrice = document.createElement('p');

                container.appendChild(cardContainer);
                cardContainer.appendChild(productImage);
                cardContainer.appendChild(productDetails);
                productDetails.appendChild(productName);
                productDetails.appendChild(productPrice);

                cardContainer.classList.add('single-new-product');
                productImage.classList.add('product-image');
                productDetails.classList.add('product-details');
                productName.classList.add('product-name');
                productPrice.classList.add('product-price');

                productImage.src = product.productImage;
                productName.innerHTML = product.productName;
                productPrice.innerHTML = product.productPrice + "đ";

                cardContainer.addEventListener('click' , () => {
                    let productSku = product.productSku
                    localStorage.setItem('ID', productSku);
                    console.log(productSku)

                    window.location.href = 'product-overview.html'
                })
}})});

window.addEventListener('DOMContentLoaded', () => {
    db.collection('products').get()
        .then((snapshot) => {

            // Lấy toàn bộ docs
            const docs = snapshot.docs;

            // Giới hạn tối đa 4 sản phẩm
            for (let i = 0; i < docs.length && i < 2; i++) {

                const product = docs[i].data();

                let cardContainer = document.createElement('div');
                let productImage = document.createElement('img');
                let productDetails = document.createElement('div');
                let productName = document.createElement('p');
                let productPrice = document.createElement('p');

                container1.appendChild(cardContainer);
                cardContainer.appendChild(productImage);
                cardContainer.appendChild(productDetails);
                productDetails.appendChild(productName);
                productDetails.appendChild(productPrice);

                cardContainer.classList.add('single-new-product');
                productImage.classList.add('product-image');
                productDetails.classList.add('product-details');
                productName.classList.add('product-name');
                productPrice.classList.add('product-price');

                productImage.src = product.productImage;
                productName.innerHTML = product.productName;
                productPrice.innerHTML = product.productPrice + "đ";
            }
        });
});

moreProduct.forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = '../html/product.html';
    });
});