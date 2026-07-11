let apiKey = 'eb180bc64e804ec6a4451cacaaba2f09'
let url = `https://newsapi.org/v2/everything?q=shoes&apiKey=${apiKey}`
let newsContainer = document.getElementById('news-container')

fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data)

        for (i = 0; i <= 11; i++ ) {
            let singleNewsContainer = document.createElement('div');
            let newsImage = document.createElement('img')
            let newsTitle = document.createElement('h3')
            let article = data.articles[i]
    
            singleNewsContainer.classList.add('single-news-container')
            newsImage.classList.add('news-image')
            newsTitle.classList.add('news-title')
    
            newsContainer.appendChild(singleNewsContainer)
            singleNewsContainer.appendChild(newsImage)
            singleNewsContainer.appendChild(newsTitle)

            newsImage.src = article.urlToImage
            newsTitle.innerHTML = article.title

            singleNewsContainer.addEventListener('click', (e) => {
                window.location.assign(article.url)
            })
        }
    })