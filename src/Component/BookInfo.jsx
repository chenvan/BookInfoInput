import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
// import book type 

export default class BookInfo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.props.bookInfo,
      ...{
        type: '',
        number: '1',
        owner: '',
        titleError: false,
        authorError: false,
        typeError: false,
        numberError: false,
        coverUrlError: false
      }
    }

    this.bookType = [
      '小说',
      '写真',
      '童话'
    ]

    this.saveInfo = this.props.saveInfo.bind(this)
  }

  handleChange = name => event => {
    if (this.state[name + 'Error'] === true) {
      this.setState({
        [name + 'Error']: false
      })
    }

    this.setState({
      [name]: event.target.value.trim()
    })
  }

  isBookInfoValid () {
    console.log('check book info')
    console.log(this.state.type)
    console.log(this.state.number)
    let errorName = ''
    if (this.state.title === '') {
      errorName = 'titleError'
    } else if (this.state.author === '') {
      errorName = 'authorError'
    } else if (this.state.type === '') {
      errorName = 'typeError'
    } else if (isNaN(this.state.number) || this.state.number === '') {
      errorName = 'numberError'
    } else if (this.state.coverUrl === '') {
      // check coverUrl is valid
      errorName = 'coverUrlError'
    }

    console.log(errorName)
    if (errorName !== '') {
      this.setState({
        [errorName]: true
      })
      return false
    } else {
      return true
    }
  }

  render() {
    return (
      <form>
        <div>{'Isbn: ' + this.state.isbn}</div>
        <TextField
          id='title'
          label='书名'
          value={this.state.title}
          error={this.state.titleError}
          onChange={this.handleChange('title')}
          margin="normal"
        />
        <TextField
          id='author'
          label='作者'
          value={this.state.author}
          error={this.state.authorError}
          onChange={this.handleChange('author')}
          margin="normal"
        />
        <TextField
          id='summary'
          label='简介'
          multiline
          value={this.state.summary}
          onChange={this.handleChange('summary')}
          margin="normal"
        />
        <TextField 
          id='type'
          label='类型'
          select
          value={this.state.type}
          error={this.state.typeError}
          onChange={this.handleChange('type')}
          margin='normal'
        >
          {this.bookType.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField 
          id='number'
          label='数量'
          type='number'
          value={this.state.number}
          error={this.state.numberError}
          onChange={this.handleChange('number')}
          margin='normal'
        />
        <TextField 
          id='owner'
          label='书主'
          value={this.state.owner}
          onChange={this.handleChange('owner')}
          margin='normal'
        />
        <TextField
          id='coverUrl'
          label='封面链接'
          value={this.state.coverUrl}
          error={this.state.coverUrlError}
          onChange={this.handleChange('coverUrl')}
          margin="normal"
        />
        <img src={this.state.coverUrl} alt="封面" />
        <Button
          variant="outlined"
          onClick={this.saveInfo}
        >
          保存
        </Button>
        <Button
          variant="outlined"
          onClick={this.props.cancel}
        >
          取消
        </Button>
      </form>
    )
  }
}