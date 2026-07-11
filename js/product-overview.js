let productImageContainer = document.getElementById('product-image-container')
let productPriceContainer = document.getElementById('product-price-container')
let productDescriptionContainer = document.getElementById('product-description-container')
let productNameContainer = document.getElementById('product-name-container')
let buyInstantlyButton = document.getElementById('button1')
let addToCartButton = document.getElementById('button2')

window.addEventListener("DOMContentLoaded", () => {

    let productSku = localStorage.getItem("ID");

    db.collection("products").get()
    .then((snapshot) => {

        snapshot.forEach((doc) => {

            const product = doc.data();

            if (product.productSku == productSku) { 

                console.log(product);

                productImageContainer.src = product.productImage;
                productPriceContainer.innerHTML = product.productPrice;
                productDescriptionContainer.innerHTML = product.productDescription;
                productNameContainer.innerHTML = product.productName;

                productImageContainer.style.boxShadow = '0 0 5px rgb(0, 0, 0, 0.8)'
                productImageContainer.style.margin = '10px'
                productImageContainer.style.borderRadius = '10px'
                productImageContainer.style.width = '30%'
                productImageContainer.style.height = productImageContainer.style.width
            }

        });

    });

});