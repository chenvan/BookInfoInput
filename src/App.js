import React from 'react'
// import { ipcRenderer } from 'electron'

import './App.css'
import IsbnInput from './Component/IsbnInput'
import BookInfo from './Component/BookInfo'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

const doubanAPI = 'https://api.douban.com/v2/book/isbn'
const fetch = require('node-fetch') 

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fetchSuccess: false,
    }

    this.bookInfo = {}

    this.fetchInfo = this.fetchInfo.bind(this)
    this.saveInfo = this.saveInfo.bind(this)
    this.cancel = this.cancel.bind(this)
  }


  fetchInfo () {
    let that = this
    return function () {
      // loading
      // check isbn
      return fetch(`${doubanAPI}/${this.state.isbn}`)
        .then(res => res.json())
        .then(info => {
          that.bookInfo = {
            isbn: this.state.isbn,
            title: info.title,
            author: info.author.map(author => author.replace(/\s+/g, '')).join(', '), //info.author is an array
            summary: info.summary,
            coverUrl: info.images.small,
          }

          that.setState({
            fetchSuccess: true
          })
        })
        .catch(err => {
          // show error
          // console.log('error:', err)
          this.setState({
            errorState: true
          })
        })
    }
  }

  saveInfo() {
    // save info
    return function () {
      // loading
      // check info
      ipcRenderer.send('save-data', this.state.isbn, {
        title: this.state.title,
        author: this.state.author,
        summary: this.state.summary,
        type: this.state.type,
        number: this.state.number,
        owner: this.state.owner,
        coverUrl: this.state.coverUrl
      })
      
    }
  }

  cancel() {
    this.setState({
      fetchSuccess: false
    })
  }


  componentDidMount() {
    ipcRenderer.on('save-data-reply', (event, reply) => {
      console.log(reply)
      if (reply === 'success') {
        this.setState({
          fetchSuccess: false
        })
      } else {
        // 
      }
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners()
  }

  render() {
    return (
      this.state.fetchSuccess ?
        <BookInfo 
          bookInfo = {this.bookInfo}
          saveInfo={this.saveInfo()}
          cancel={this.cancel}
        />
          :
        <IsbnInput 
          fetchInfo = {this.fetchInfo()}
        />
    )
  }
}
