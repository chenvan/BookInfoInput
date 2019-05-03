import React from 'react'

import './App.css'
import IsbnInput from './component/IsbnInput'
import BookInfo from './component/BookInfo'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import CircularProgress from '@material-ui/core/CircularProgress'

const electron = window.electron
const ipcRenderer = electron.ipcRenderer

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fetchSuccess: false,
      loading: false,
      open: false,
      errMsg: '出错',
    }

    this.bookType = ipcRenderer.sendSync('get-bookType')
    this.bookInfo = {}
  }

  handleClose = () => {
    this.setState({
      open: false
    })
  }

  openLoading = () => {
    this.setState({
      loading: true,
      open: true
    })
  }

  onSuccess = (from, data) => {
    if (from === 'isbn') {
      this.bookInfo = data

      this.setState({
        fetchSuccess: true,
        open: false
      })
    } else if (from === 'save') {
      // console.log(data)
      ipcRenderer.send('save-data', data)
    }
  }

  onError = err => {
    this.setState({
      loading: false,
      errMsg: err ? err.message : '出错'
    })
  }

  navigateBack = () => {
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
            bookInfo={this.bookInfo}
            bookType={this.bookType}
            onSuccess={this.onSuccess}
            onError={this.onError}
            navigateBack={this.navigateBack}
            openLoading={this.openLoading}
          />
            :
          <IsbnInput 
            onSuccess={this.onSuccess}
            onError={this.onError}
            openLoading={this.openLoading}
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
                取消
              </Button>
            </DialogActions>
          }
        </Dialog>
      </div>
    )
  }
}
