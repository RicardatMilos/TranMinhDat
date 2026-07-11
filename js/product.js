let container = document.getElementById('product-container')
let paymentContainer = document.getElementById('payment-container')
let backButton = document.getElementById('back-button')
let paymentSubmit = document.getElementById('payment-submit')

window.addEventListener('DOMContentLoaded', () => {
    db.collection('products').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const product = doc.data();

                let cardContainer = document.createElement('div')
                let productImage = document.createElement('img')
                let productDetails = document.createElement('div')
                let productName = document.createElement('p')
                let productPrice = document.createElement('p')

                container.appendChild(cardContainer)
                cardContainer.appendChild(productImage)
                cardContainer.appendChild(productDetails)
                productDetails.appendChild(productName)
                productDetails.appendChild(productPrice)

                cardContainer.classList.add('card-container')
                productImage.classList.add('product-image')
                productDetails.classList.add('product-details')
                productName.classList.add('product-name')
                productPrice.classList.add('product-price')

                productImage.src = product.productImage
                productName.innerHTML = product.productName
                productPrice.innerHTML = product.productPrice + "đ"

                cardContainer.addEventListener('click' , () => {
                    let productSku = product.productSku
                    localStorage.setItem('ID', productSku);
                    console.log(productSku)

                    window.location.href = 'product-overview.html'
                })

            })
        })
})