import React from 'react'

import './App.css'
import IsbnInput from './Component/IsbnInput'
import BookInfo from './Component/BookInfo'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent';

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

const doubanAPI = 'https://api.douban.com/v2/book/isbn'
const fetch = require('node-fetch') 

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fetchSuccess: false,
      open: false
    }

    this.bookInfo = {}

    this.fetchInfo = this.fetchInfo.bind(this)
    this.saveInfo = this.saveInfo.bind(this)
    this.cancel = this.cancel.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose() {
    this.setState({
      open: false
    })
  }
  

  fetchInfo () {
    let that = this

    return function () {
      
      this.setState({
        loading: true
      })

      if (this.isIsbnValid(this.state.isbn)) {
        fetch(`${doubanAPI}/${this.state.isbn}`)
          .then(res => res.json())
          .then(info => {
            // console.log(info)
            if (info.title) {
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

            } else {
              this.setState({
                errorState: true,
                loading: false
              })
            }
          })
          .catch(err => {
            // what will cause this error?
            console.log(err)
            this.setState({
              errorState: true,
              loading: false
            })
          })
      } else {
        // isbn no valid
        this.setState({
          errorState: true,
          loading: false
        })
      }
    }
  }

  saveInfo() {
    // save info
    return function () {
      // check info
      if (this.isBookInfoValid()) {
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
        // show dialog
        this.setState({
          open: true
        })
      }
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners()
  }

  render() {
    return (
      <div>
        {
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
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogContent>
            已经含有该数据
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}
