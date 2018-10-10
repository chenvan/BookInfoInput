import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

export default class IsbnInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isbn: '', 
      errorState: false,
      loading: false
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
    return true
  }

  render() {
    return (
      <form>
        <TextField
          id='isbn'
          label='isbn号'
          value={this.state.isbn}
          error={this.state.errorState}
          onChange={this.handleChange}
          margin="normal"
        />
        <Button 
          variant="outlined"
          onClick = {this.fetchInfo}
          disabled={this.state.loading}
        >
          Fetch
        </Button>
        { 
          this.state.loading &&
          <CircularProgress
            size={24}
          />
        }
      </form>
    )
  }
}