import React, { Component } from 'react'
import { Input, Form, TextArea, Button } from 'semantic-ui-react'
import moment from 'moment'
import ChatroomMessages from './chatroomMessages'

import './index.scss'

export default class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      chatHistory: [
        {
          date: moment().set({
            year: 2018, month: 9, date: 20, day: 6, 
            hour: 7, minute: 30, second: 20
          }),
          text: '보고시뿌 보낼려구 들어왔는데~',
          friend: true,
          firstMessageOfDay: true,
          firstMessageOfMinute: true
        },
        {
          date: moment().set({
            year: 2018, month: 9, date: 20, day: 6,
            hour: 7, minute: 30, second: 55
          }),
          text: '문자와있었네ㅋㅋ 잠깐 깼어요?',
          friend: true,
          firstMessageOfDay: false,
          firstMessageOfMinute: false
        },
        {
          date: moment().set({
            year: 2018, month: 9, date: 20, day: 6,
            hour: 7, minute: 30, second: 58
          }),
          text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
          friend: false,
          firstMessageOfDay: false,
          firstMessageOfMinute: false
        },
        {
          date: moment().set({
            year: 2018, month: 9, date: 20, day: 6,
            hour: 7, minute: 31, second: 58
          }),
          text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
          friend: false,
          firstMessageOfDay: false,
          firstMessageOfMinute: false
        },
        {
          date: moment().set({
            year: 2018, month: 9, date: 21, day: 0,
            hour: 7, minute: 31, second: 58
          }),
          text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
          friend: false,
          firstMessageOfDay: true,
          firstMessageOfMinute: false
        },
        {
          date: moment().set({
            year: 2018, month: 9, date: 21, day: 0,
            hour: 7, minute: 32, second: 58
          }),
          text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
          friend: true,
          firstMessageOfDay: false,
          firstMessageOfMinute: true
        },
        {
          date: moment().set({
            year: 2018, month: 9, date: 21, day: 0,
            hour: 7, minute: 32, second: 59
          }),
          text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
          friend: true,
          firstMessageOfDay: false,
          firstMessageOfMinute: false
        }
      ]
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
    const { search, chatHistory } = this.state;
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
        <ChatroomMessages
          chatHistory={chatHistory}
          chatroom={chatroom}
        />
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