import React, { Component } from 'react'
import { Input } from 'semantic-ui-react'
import throttle from 'throttled-event-listener'

import './index.scss';

export default class Friends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchNameInput: '',
      myProfile: [{photo: '/src/images/me.jpg', name: 'Jonathan Rim', motto: '이 세상에서 제일 필오한건.. 마음이 따뜻한 사람~'}],
      friends: [
        {photo: '/src/images/sejin.jpg', name: '세진❤', favorite: true, motto: '🥑'},
        {photo: '/src/images/justinkim.jpg', name: 'Justin Kim', favorite: false, motto: `Throwback to the good ol' days in Europe.`},
        {photo: '/src/images/lawrenceparsons.jpg', name: 'Lawrence Parsons', favorite: false, motto: 'One of the new friends I made in Costa Rica!'},
        {photo: '/src/images/johnchen.jpg', name: 'John Chen', favorite: false, motto: 'happy new years'},
        {photo: '/src/images/aaronan.jpg', name: 'Aaron An', favorite: false, motto: `"But I have trusted in your steadfast love;
          my heart shall rejoice in your salvation." -Psalm 13:5`},
        {photo: '/src/images/yongwoolee.jpg', name: '이용우', favorite: false, motto: ''},
        {photo: '/src/images/scottlee.jpg', name: '이현호', favorite: false, motto: ''},
      ]
    };

    this.changeInputValue = this.changeInputValue.bind(this);
  }

  componentDidMount() {
    throttle.add('resize', 200, e => {
      
    });
    document.getElementsByClassName('friends-list')[0].addEventListener('mousedown', e => {
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
    });
  }

  componentWillUnmount() {
    throttle.end();
  }

  changeInputValue(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { myProfile, friends, searchNameInput } = this.state;
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
                <div className='section-name'>{section.name}</div>
                <hr/>
                {
                  section.list.sort((a,b) => a.name < b.name ? -1 : 1)
                  .filter(friend => friend.name.toLowerCase().replace(/\s/g, '').includes(searchNameInput.toLowerCase().replace(/\s/g, '')))
                  .map((friend, index) => (
                    <div className='friend' key={friend.name + index}>
                      <img src={friend.photo} />
                      <div className='friend-name'>
                        <p>{friend.name}</p>
                      </div>
                      <div className='friend-motto'>
                        <p>{friend.motto}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}