import React, { Component } from 'react'
import { Input, Form, TextArea, Button, Modal } from 'semantic-ui-react'
import ReactResizeDetector from 'react-resize-detector'
import { Picker } from 'emoji-mart'
import Dropzone from 'react-dropzone'
import ChatroomMessages from './chatroomMessages'

import 'emoji-mart/css/emoji-mart.css'
import './index.scss'

export default class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      messageInput: '',
      filesToSend: [],
    };
    this.showSearch = this.showSearch.bind(this);
    this.showMore = this.showMore.bind(this);
    this.changeMessageInput = this.changeMessageInput.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.send = this.send.bind(this);
    this.onResize = this.onResize.bind(this);
    this.addEmoji = this.addEmoji.bind(this);
    this.sendMedia = this.sendMedia.bind(this);
  }

  showSearch() {
    this.setState({search: !this.state.search}, () => {
      if (this.state.search) document.getElementById('chatroom-search-input').focus();
      else document.getElementById('chatroom-type-input').focus();
    });
  }

  showMore() {

  }

  changeMessageInput(e) {
    this.setState({ messageInput: e.target.value });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  scrollToBottom() {
    let chatMessagesDiv = document.getElementsByClassName('chatroom-messages')[0];
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
  }

  sameDate(a, b) {
    a = new Date(a);
    b = new Date(b);
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  sameMinute(a, b) {
    a = new Date(a);
    b = new Date(b);
    return a.getHours() === b.getHours() &&
           a.getMinutes() === b.getMinutes();
  }

  sendMessage(e) {
    const { messageInput } = this.state;
    if (messageInput === '') return;
    this.send('text');
  }

  sendMedia(files) {
    this.send('media', files);
  }

  send(typeOfMessage, files) {
    const { messageInput } = this.state;
    const { chatHistory } = this.props;
    const { sameDate, sameMinute } = this;
    let today = new Date();
    if (chatHistory.length > 0) {
      let latestMessage = chatHistory[chatHistory.length - 1].date;
      let sameDay = sameDate(today, latestMessage);
      let sameTime = sameMinute(today, latestMessage);
      this.setState({
        messageInput: '',
        filesToSend: typeOfMessage === 'media' ? files : null,
        chatHistory: typeOfMessage === 'text' ? [...chatHistory, {
          text: messageInput,
          date: today,
          friend: false,
          firstMessageOfDay: !sameDay,
          firstMessageOfMinute: !sameDay || sameDay && !sameTime
        }] : [...chatHistory].concat(files.map((file, i) => {
          return {
            file: file,
            date: today,
            friend: false,
            /* 
              when sending multiple files, only check the first file to see if it's
              the first message of the day/minute
            */
            firstMessageOfDay: i === 0 && !sameDay,
            firstMessageOfMinute: i === 0 && (!sameDay || sameDay && !sameTime)
          }
        }))
      }, () => {
        console.log(files)
        this.scrollToBottom();
      });
    }
    else {
      // empty chatroom
      this.setState({
        messageInput: '',
        filesToSend: typeOfMessage === 'media' ? files : null,
        chatHistory: typeOfMessage === 'text' ? [{
          text: messageInput,
          date: today,
          friend: false,
          firstMessageOfDay: true,
          firstMessageOfMinute: true
        }] : files.map((file, i) => {
          return {
            file: file,
            date: today,
            friend: false,
            firstMessageOfDay: i === 0,
            firstMessageOfMinute: i === 0
          }
        })
      }, () => {
        this.scrollToBottom();
      });
    }
  }

  onResize() {
    this.scrollToBottom();
  }

  displayEmojis() {
    document.getElementsByClassName('emoji-mart')[0].classList.toggle('visible');
  }

  addEmoji(emoji) {
    this.setState({ 
      messageInput: this.state.messageInput + emoji.colons
    }, () => {
      document.getElementById('chatroom-type-input').focus();
    });
  }

  // hideEmojiPickerOnClick(e) {
  //   if (!e.target.closest('.emoji-mart').length) {
  //     document.getElementsByClassName('emoji-mart')[0].classList.remove('visible');
  //   }
  // }

  componentDidMount() {
    document.getElementById('chatroom-type-input').focus();
    // window.addEventListener('click', this.hideEmojiPickerOnClick)
  }

  componentWillUnmount() {
    // window.removeEventListener('click', this.hideEmojiPickerOnClick)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chatroom.id !== this.props.chatroom.id) {
      document.getElementById('chatroom-type-input').focus();
    }
  }

  render() {
    const { chatroom, changeFriendState, mobileWindow } = this.props;
    const { search, messageInput } = this.state;
    const chatHistory = chatroom.chatHistory || [];
    return (
      <Dropzone
        className='dropzone'
        onDrop={this.sendMedia}
        disableClick={true}
        acceptClassName='dropzone-drag'
      >
        {({ open }) => (
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
                onClick={this.showSearch}
              />
              <i
                className='button fas fa-bars'
                onClick={this.showMore}
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
                  iconPosition='left'
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
                <ReactResizeDetector handleWidth handleHeight onResize={this.onResize}>
                  <TextArea 
                    autoHeight 
                    rows='2' 
                    id='chatroom-type-input' 
                    value={messageInput} 
                    onChange={this.changeMessageInput}
                    onKeyPress={this.handleKeyPress}
                  />
                </ReactResizeDetector>
                <Button size='mini' onClick={this.sendMessage}>Send</Button>
                <i 
                  className="bot-button far fa-smile-wink"
                  onClick={this.displayEmojis}
                />
                <i
                  className="bot-button fas fa-paperclip" 
                  onClick={open}
                />
                <i className="bot-button far fa-image" />
                <i className="bot-button fas fa-phone" />
              </Form>
            </div>
            <Picker set='emojione' onSelect={this.addEmoji} style={{
              bottom: mobileWindow ? (document.getElementsByClassName('chatroom-type')[0] ?
                document.getElementsByClassName('chatroom-type')[0].scrollHeight : 120 + 'px') : '0',
              left: mobileWindow ? '0' : '-348px'
            }}/>
          </div>
        )}
      </Dropzone>
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