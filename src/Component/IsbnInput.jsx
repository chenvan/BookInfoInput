import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export default class IsbnInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isbn: '', 
      errorState: false
    }

    this.fetchInfo = this.props.fetchInfo.bind(this)
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

  isIsbnValid (isbn) {
    return isbn.length === 13 && !isNaN(isbn)
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
        <Button
          onClick = {this.props.toBookInfo}
          variant="contained"
        >
            手动输入书籍信息
        </Button>
      </div>
    )
  }
}