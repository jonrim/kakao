import React, { Component } from 'react'
import { Input, Form, TextArea, Button } from 'semantic-ui-react'

import './index.scss'

export default class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false
    };
    this.showSearch = this.showSearch.bind(this);
    this.showMore = this.showMore.bind(this);
  }

  showSearch() {
    this.setState({search: !this.state.search}, () => {
      if (this.state.search) document.getElementById('chatroom-search-input').focus();
      else document.getElementById('chatroom-type-input').focus();
    });
  }

  showMore() {

  }

  componentDidMount() {
    document.getElementById('chatroom-type-input').focus();
  }

  render() {
    const { chatroom, changeFriendState, mobileWindow } = this.props;
    const { search } = this.state;
    const { showSearch, showMore } = this;
    return (
      <div className='chatroom'>
        <div className='chatroom-nav'>
          <BackButton
            changeFriendState={changeFriendState}
          />
          <img className='chatroom-photo' src={chatroom.photo}/>
          <div className='chatroom-name'>
            <p>{chatroom.name}</p>
          </div>
          <i
            className='button fas fa-search'
            onClick={showSearch}
          />
          <i
            className='button fas fa-bars'
            onClick={showMore}
          />
        </div>
        {
          search &&
          <div className='search-container'>
            <Input
              focus
              icon='search'
              name='searchInput'
              id='chatroom-search-input'
              placeholder='Search'
            />
          </div>
        }
        <div className='chatroom-messages'>
        </div>
        <div className='chatroom-type'>
          <Form>
            <TextArea autoHeight rows='2' id='chatroom-type-input'/>
            <Button size='mini'>Send</Button>
            <i className="bot-button far fa-smile-wink" />
            <i className="bot-button fas fa-paperclip" />
            <i className="bot-button far fa-image" />
            <i className="bot-button fas fa-phone" />
          </Form>
        </div>
      </div>
    )
  }
}

const BackButton = props => {
  const { changeFriendState } = props;
  const goBack = () => {
    changeFriendState('chatroom', null);
  };
  return (
    <i 
      className='button fas fa-arrow-left'
      onClick={goBack}
    />
  )
}