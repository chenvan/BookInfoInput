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
        number: '',
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
    this.setState({
      [name]: event.target.value.trim()
    })
  }

  isBookInfoValid () {
    return true
  }

  render() {
    return (
      <form>
        <div>{'Isbn: ' + this.state.isbn}</div>
        <TextField
          id='title'
          label='书名'
          value={this.state.title}
          onChange={this.handleChange('title')}
          margin="normal"
        />
        <TextField
          id='author'
          label='作者'
          value={this.state.author}
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