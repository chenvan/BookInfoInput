const fetch = require('node-fetch') 
const cheerio = require('cheerio')

const baseUrl = "https://douban.com/isbn"

function getAuthor($) {
  let author = ''
  $('head script').attr('type', 'application/ld+json').each((i, el) => {
    if (el.children.length === 1) {
      let content = el.children[0].data.trim()
      if (content) {
        try {
          let result = JSON.parse(content)
          author = result.author.map(author => author.name.replace(/\s+/g, '')).join(', ')
        } catch (err) {
          // console.log(err)
        }
      }
    }
  })
  return author
}

function getTitle ($) {
  return $('#wrapper h1 span').text().trim()
}

function getCoverUrl ($) {
  return $('#mainpic a img').attr("src").trim()
}

function getSummary ($) {
  return $('#link-report .intro').last().text().trim()
}

function scrape(isbn) {
  return fetch(`${baseUrl}/${isbn}`)
  .then(res => {
    if(!res.ok) throw Error('无法从豆瓣中获得信息, 可能是网络问题或输入的 ISBN 号错误')
    return res.text()
  })
  .then(body => {
    let $ = cheerio.load(body)
    return {
      title: getTitle($),
      author: getAuthor($),
      summary: getSummary($),
      coverUrl: getCoverUrl($)
    }
  })
}

export default scrape