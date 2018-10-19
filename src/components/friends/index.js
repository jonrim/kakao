import React, { Component } from 'react'
import { Input } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import throttle from 'throttled-event-listener'

import './index.scss';

export default class Friends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchNameInput: '',
      myProfile: [{id: 0, photo: '/src/images/me.jpg', name: 'Jonathan Rim', motto: '이 세상에서 제일 필오한건.. 마음이 따뜻한 사람~'}],
      friends: [
        {id: 1, photo: '/src/images/sejin.jpg', name: '세진❤', favorite: true, motto: '🥑'},
        {id: 2, photo: '/src/images/justinkim.jpg', name: 'Justin Kim', favorite: false, motto: `Throwback to the good ol' days in Europe.`},
        {id: 3, photo: '/src/images/lawrenceparsons.jpg', name: 'Lawrence Parsons', favorite: false, motto: 'One of the new friends I made in Costa Rica!'},
        {id: 4, photo: '/src/images/johnchen.jpg', name: 'John Chen', favorite: false, motto: 'happy new years'},
        {id: 5, photo: '/src/images/aaronan.jpg', name: 'Aaron An', favorite: false, motto: `"But I have trusted in your steadfast love;
          my heart shall rejoice in your salvation." -Psalm 13:5`},
        {id: 6, photo: '/src/images/yongwoolee.jpg', name: '이용우', favorite: false, motto: ''},
        {id: 7, photo: '/src/images/scottlee.jpg', name: '이현호', favorite: false, motto: ''},
      ]
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
    const { myProfile, friends, searchNameInput, focusedFriend } = this.state;
    const { chatroom, changeFriendState } = this.props;
    const { changeInputValue } = this;
    let friendSections = [
      {name: 'My Profile', list: myProfile},
      {name: 'Favorites', list: friends.filter(friend => friend.favorite)},
      {name: 'Friends', list: friends}
    ];
    return (
      <div className='friends-wrapper'>
        <Input 
          focus
          icon='search'
          name='searchNameInput'
          placeholder='Search name...'
          onChange={changeInputValue} 
          value={searchNameInput}
        />
        <div className='friends-list'>
          {
            friendSections.map(section => (
              <div key={section.name}>
                <div className='section-name'>{section.name + (section.name === 'Friends' ? ' ' + section.list.length : '')}</div>
                <hr/>
                <div>
                  {
                    section.list.sort((a,b) => a.name < b.name ? -1 : 1)
                    .filter(friend => friend.name.toLowerCase().replace(/\s/g, '').includes(searchNameInput.toLowerCase().replace(/\s/g, '')))
                    .map(friend => (
                      <FriendWithRouter
                        key={friend.id}
                        friend={friend}
                        changeFriendState={changeFriendState}
                        // focusedFriend={focusedFriend}
                      />
                    ))
                  }
                </div>
              </div>
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
        <p>{friend.motto}</p>
      </div>
    </div>
  )
}

const FriendWithRouter = withRouter(Friend)