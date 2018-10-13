import React from 'react'

import './App.css'
import IsbnInput from './Component/IsbnInput'
import BookInfo from './Component/BookInfo'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import CircularProgress from '@material-ui/core/CircularProgress'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

const doubanAPI = 'https://api.douban.com/v2/book/isbn'
const fetch = require('node-fetch') 

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fetchSuccess: false,
      loading: false,
      open: false,
      errMsg: '出错'
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
      
      that.setState({
        loading: true,
        open: true,
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
                fetchSuccess: true,
                open: false
              })

            } else {
              that.setState({
                loading: false,
                errMsg: '豆瓣没有该ISBN书籍数据'
              })

              this.setState({
                errorState: true,
              })
            }
          })
          .catch(err => {
            // console.log(err)
            that.setState({
              loading: false,
              errMsg: err.message
            })
          })
      } else {
        // isbn is not valid
        that.setState({
          loading: false,
          open: false
        })

        this.setState({
          errorState: true,
        })
      }
    }
  }

  saveInfo() {
    // save info
    let that = this
    return function () {
      that.setState({
        loading: true,
        open: true
      })
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
      } else {
        that.setState({
          loading: false,
          open: false
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
          fetchSuccess: false,
          open: false
        })
      } else {
        this.setState({
          loading: false,
          errMsg: '已存有该书籍信息'
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
        >
          <DialogContent>
            {
              this.state.loading ? 
              <CircularProgress size={24}/> :
              <DialogContentText>{this.state.errMsg}</DialogContentText>
            }
          </DialogContent>
          { 
            !this.state.loading && 
            <DialogActions>
              <Button variant="outlined" onClick = {this.handleClose}>
                Cancel
              </Button>
            </DialogActions>
          }
        </Dialog>
      </div>
    )
  }
}
