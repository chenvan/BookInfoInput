import React, { Component } from 'react';
import './App.css';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
const api = ''

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isbn: '',
      bookOwner: '',
      bookNumber: '',
      bookTitle: '',
      bookAuthor: '',
      bookCoverUrl: '',
      bookSummary: '',
      fetchSuccess: false,
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  fetchInfo = () => {
    this.setState({
      fetchSuccess: true
    })
  }

  saveInfo = () => {
    this.setState({
      fetchSuccess: false
    })
  }

  render() {
    return (
      <form>
        <TextField
          id='isbn'
          label='isbn号'
          value={this.state.isbn}
          onChange={this.handleChange('isbn')}
          margin="normal"
        />
        <TextField
          id='bookOwner'
          label='书主'
          value={this.state.bookOwner}
          onChange={this.handleChange('bookOwner')}
          margin="normal"
        />
        <TextField
          id='bookNumber'
          label='本数'
          value={this.state.bookNumber}
          onChange={this.handleChange('bookNumber')}
          margin="normal"
          type="number"
        />
        {
          !this.state.fetchSuccess ? 
            <Button variant="outlined" onClick={this.fetchInfo}>
              Ok
            </Button> 
              : 
            (
              <div>
                <TextField
                  id='bookTitle'
                  label='书名'
                  value={this.state.bookTitle}
                  onChange={this.handleChange('bookTitle')}
                  margin="normal"
                />
                <TextField
                  id='bookAuthor'
                  label='作者'
                  value={this.state.bookAuthor}
                  onChange={this.handleChange('bookAuthor')}
                  margin="normal"
                />
                <TextField
                  id='bookCoverUrl'
                  label='封面链接'
                  value={this.state.bookCoverUrl}
                  onChange={this.handleChange('bookCoverUrl')}
                  margin="normal"
                />
                <TextField
                  id='bookSummary'
                  label='简介'
                  multiline
                  value={this.state.bookSummary}
                  onChange={this.handleChange('bookSummary')}
                  margin="normal"
                />
                <Button variant="outlined" onClick={this.saveInfo}>
                  Save
                </Button>
              </div>
            )
        }
      </form>
    )
  }
}

export default App;
