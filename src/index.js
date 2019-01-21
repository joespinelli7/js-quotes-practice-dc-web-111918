// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener("DOMContentLoaded", () => {
  let form = document.querySelector('#new-quote-form')
  form.addEventListener('submit', submitForm)

  getAllQuotes()
})

function getAllQuotes() {
  fetch('http://localhost:3000/quotes')
  .then(res => res.json())
  .then(quotes => {
    quotes.forEach( (quote) => {
      renderQuote(quote)
    })
  })
}

function renderQuote(quote) {
  let quoteList = document.querySelector('#quote-list')

  let li = document.createElement('li')
  li.id = `quote-${quote.id}`
  li.classList.add('quote-card')
  quoteList.appendChild(li)

  let blockQuote = document.createElement('blockquote')
  blockQuote.classList.add('blockquote')
  li.appendChild(blockQuote)

  let p = document.createElement('p')
  p.classList.add('mb-0')
  p.innerText = quote.quote
  blockQuote.appendChild(p)

  let footer = document.createElement('footer')
  footer.classList.add('blockquote-footer')
  footer.innerText = quote.author
  blockQuote.appendChild(footer)

  let br = document.createElement('br')
  blockQuote.appendChild(br)

  let likeBtn = document.createElement('button')
  likeBtn.classList.add('btn-success')

  let span = document.createElement('span')
  span.innerText = quote.likes
  likeBtn.innerText = `Likes: `
  likeBtn.appendChild(span)
  likeBtn.addEventListener('click', () => {
    likeQuote(quote)
  })
  blockQuote.appendChild(likeBtn)

  let deleteBtn = document.createElement('button')
  deleteBtn.classList.add('btn-danger')
  deleteBtn.innerText = 'Delete'
  deleteBtn.addEventListener('click', () => {
    deleteQuote(quote)
  })
  blockQuote.appendChild(deleteBtn)
}

function submitForm(e) {
  e.preventDefault()
  postNewQuote()
  e.target.reset()
}

function postNewQuote() {
  let addQuote = document.querySelector('#new-quote').value
  let addAuthor = document.querySelector('#author').value

  let data = { quote: addQuote, author: addAuthor, likes: 0 }
  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers:
    {
      "Content-Type": "application/json",
  		"Accept": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(quote => {
    renderQuote(quote)
  })
}

function deleteQuote(quote) {
  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(data => {
    document.querySelector(`#quote-${quote.id}`).remove()
  })
}

function likeQuote(quote) {
  let jsonData = { likes: ++quote.likes }

  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
  		"Accept": "application/json"
    },
    body: JSON.stringify(jsonData)
  })
  .then(res => res.json())
  .then(data => {
    document.querySelector(`#quote-${data.id} > blockquote > .btn-success > span`).innerText = `${data.likes}`
  })
}
