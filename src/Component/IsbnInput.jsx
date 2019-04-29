import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import scrape from '../lib/scrape'

export default class IsbnInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isbn: '', 
      errorState: false
    }
  }

  handleChange = event => {
    if (this.state.errorState) {
      this.setState({
        errorState: false
      })
    }

    this.setState({
      isbn: event.target.value.trim()
    })
  }

  isIsbnValid =  isbn => {
    return (isbn.length === 13 || isbn.length === 10) && !isNaN(isbn)
  }

  fetchInfo = () => {
    this.props.openLoading && this.props.openLoading()

    if (this.isIsbnValid(this.state.isbn)) {
      scrape(this.state.isbn).then(data => {
        this.props.onSuccess && this.props.onSuccess('isbn', {
            isbn: this.state.isbn,
            ...data
          }
        )
      }).catch(err => {
        this.props.onError && this.props.onError(err)
      })
    } else {
      this.props.onError && this.props.onError()
      
      this.setState({
        errorState: true,
      })
    }
  }

  render() {
    return (
      <div id='isbn-form'>
        <div id='isbn-input'>
          <TextField
            id='isbn'
            label='isbn号'
            value={this.state.isbn}
            error={this.state.errorState}
            onChange={this.handleChange}
            margin="normal"
          />
          <Button 
            variant="contained"
            color="primary"
            onClick = {this.fetchInfo}
          >
            获取
          </Button>
        </div>
      </div>
    )
  }
}