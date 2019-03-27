const scrape = require('../src/Lib/scrape')

let isbn = '9787559628534'

scrape(isbn)
.then(res => {
  console.log('title:\n', res.title)
  console.log('author:\n', res.author)
  console.log('summary:\n', res.summary)
  console.log('cover url:\n', res.coverUrl)
})
.catch(err => {
  console.log(err)
})
