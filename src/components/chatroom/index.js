import React, { Component } from 'react'
import { Input, Form, TextArea, Button } from 'semantic-ui-react'
import moment from 'moment'

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
        }
      ]
    };
    this.showSearch = this.showSearch.bind(this);
    this.showMore = this.showMore.bind(this);
    this.displayTimeForThisMessage = this.displayTimeForThisMessage.bind(this);
  }

  showSearch() {
    this.setState({search: !this.state.search}, () => {
      if (this.state.search) document.getElementById('chatroom-search-input').focus();
      else document.getElementById('chatroom-type-input').focus();
    });
  }

  showMore() {

  }

  displayTimeForThisMessage(i) {
    const { chatHistory } = this.state;
    return (i + 1 === chatHistory.length || i + 1 < chatHistory.length &&
          (chatHistory[i].date.diff(chatHistory[i + 1].date, 'minutes') ||
          chatHistory[i].friend !== chatHistory[i + 1].friend));
  }

  componentDidMount() {
    document.getElementById('chatroom-type-input').focus();
  }

  render() {
    const { chatroom, changeFriendState, mobileWindow } = this.props;
    const { search, chatHistory } = this.state;
    const { showSearch, showMore, displayTimeForThisMessage } = this;
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
          {
            chatHistory.map((message, i) => (
              <div className={(message.friend ? 'her-message' : 'my-message') + ' message'} key={'message' + i}>
                {
                  message.firstMessageOfDay && (
                    <p className='date' style={{margin: '15px 0'}}>
                      {
                        message.date.format('dddd, MMMM D, YYYY')
                      }
                    </p>
                  )
                }
                {
                  message.friend &&
                  <div style={{width: '40px', display: 'inline-block'}}>
                  {
                    message.firstMessageOfMinute &&
                    <img className='chatroom-photo' src={chatroom.photo}/>
                  }
                  </div>
                }
                <div 
                  className='clearfix' 
                  style={{
                    /* 
                      if it's a friend's message, or if it's one of my messages that doesn't display the time,
                      make this clearfix container an inline-block. otherwise use flex for my own messages that show time
                      so that I can properly position the time to be at the bottom right corner of it's container,
                      just to the left of the message 
                     */
                    display: !displayTimeForThisMessage(i) || chatHistory[i].friend ? 'inline-block' : 'flex',
                    'verticalAlign': 'top',
                    'marginLeft': '3px',
                    'position': 'relative'
                  }}>
                  {
                    message.friend && message.firstMessageOfMinute &&
                    <p style={{margin: '0', padding: '0 10px'}}>{chatroom.name}</p>
                  }
                  {
                    displayTimeForThisMessage(i) && !chatHistory[i].friend &&
                    <div className='date-container'>
                      <span>{ message.date.format('h:mm A') }</span>
                    </div>
                  }
                  <p className='text'>{ message.text }</p>
                  {
                    displayTimeForThisMessage(i) && chatHistory[i].friend &&
                    <div className='date-container'>
                      <span>{ message.date.format('h:mm A') }</span>
                    </div>
                  }
                </div>
              </div>
            ))
          }
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