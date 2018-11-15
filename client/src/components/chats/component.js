import React, { Component } from 'react'
import { Input } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import throttle from 'throttled-event-listener'
import { FadeLoader } from 'react-spinners';
import { css } from 'react-emotion';

const loaderCSS = css`
  margin: 30px auto;
`;

export default class Chats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchNameInput: ''
    };

    this.changeInputValue = this.changeInputValue.bind(this);
    this.changeFriendButtonStyling = this.changeFriendButtonStyling.bind(this);
  }

  changeFriendButtonStyling(e) {
    let clickedFriend = e.target.closest('div.friend');
    /* 
      Have only one 'clicked friend' styling on at one time. Clicking on a different
      friend will remove the 'clicked' class from all other friends
    */
    if (clickedFriend) {
      if (!clickedFriend.classList.contains('clicked')) {
        Array.from(e.currentTarget.getElementsByClassName('friend')).forEach(friend => {
          friend.classList.remove('clicked');
        });
      }
      clickedFriend.classList.add('clicked');
    }
  }

  componentDidMount() {
    // Event Delegation
    document.getElementsByClassName('friends-list')[0].addEventListener('mousedown', this.changeFriendButtonStyling);
  }

  componentWillUnmount() {
    document.getElementsByClassName('friends-list')[0].removeEventListener('mousedown', this.changeFriendButtonStyling);
  }

  changeInputValue(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { searchNameInput, focusedFriend } = this.state;
    const { chatroom, changeFriendState, myProfile, friends, isFetching } = this.props;
    const { changeInputValue } = this;
    return (
      <div className='friends-wrapper'>
        <Input 
          focus
          icon='search'
          name='searchNameInput'
          placeholder='Search chatrooms, participants...'
          iconPosition='left'
          onChange={changeInputValue} 
          value={searchNameInput}
        />
        <div className='friends-list'>
          {
            isFetching ?
            <FadeLoader
              className={loaderCSS}
              sizeUnit='px' 
              size={80}
            /> :
            friends.filter(friend => friend.chatHistory && friend.chatHistory.length > 0)
            .sort((a,b) => {
              let aLatestMessage = a.chatHistory[a.chatHistory.length - 1];
              let bLatestMessage = b.chatHistory[b.chatHistory.length - 1];
              let d1 = new Date(aLatestMessage.date);
              let d2 = new Date(bLatestMessage.date);
              return d1 > d2 ? -1 : 1
            })
            .filter(friend => friend.name ? friend.name.toLowerCase().replace(/\s/g, '').includes(searchNameInput.toLowerCase().replace(/\s/g, '')) : null)
            .map(friend => (
              <FriendWithRouter
                key={friend.email}
                friend={friend}
                changeFriendState={changeFriendState}
              />
            ))
          }
        </div>
      </div>
    )
  }
}

const Friend = props => {

  const {friend, changeFriendState} = props;
  const changeChatroom = () => {
    changeFriendState('chatroom', friend);
  };
  let latestMessage = friend.chatHistory && friend.chatHistory.length > 0 ? 
                        friend.chatHistory[friend.chatHistory.length - 1] : '';
  if (typeof latestMessage === 'object') latestMessage = latestMessage.text ? latestMessage.text : latestMessage.file ? 'media' : '';
  else latestMessage = '';
  return (
    <div 
      className={'friend'}
      onDoubleClick={changeChatroom}
    >
      <div className='friend-photo'>
        <img src={friend.photo} />
      </div>
      <div className='friend-name'>
        <p>{friend.name}</p>
      </div>
      <div className='friend-motto'>
        <p>{latestMessage}</p>
      </div>
    </div>
  )
}

const FriendWithRouter = withRouter(Friend)