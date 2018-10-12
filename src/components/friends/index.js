import React, { Component } from 'react'
import { Input } from 'semantic-ui-react'
import throttle from 'throttled-event-listener'

import './index.scss';

export default class Friends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myProfile: [{photo: '/src/images/me.jpg', name: 'Jonathan Rim', motto: '이 세상에서 제일 필오한건.. 마음이 따뜻한 사람~'}],
      favorites: [{photo: '/src/images/sejin.jpg', name: '세진❤', motto: '🥑'}],
      friends: [
        {photo: '/src/images/justinkim.jpg', name: 'Justin Kim', motto: `Throwback to the good ol' days in Europe.`},
        {photo: '/src/images/lawrenceparsons.jpg', name: 'Lawrence Parsons', motto: 'One of the new friends I made in Costa Rica!'},
        {photo: '/src/images/johnchen.jpg', name: 'John Chen', motto: 'happy new years'},
        {photo: '/src/images/aaronan.jpg', name: 'Aaron An', motto: `"But I have trusted in your steadfast love;
          my heart shall rejoice in your salvation." -Psalm 13:5`},
        {photo: '/src/images/yongwoolee.jpg', name: '이용우', motto: ''},
        {photo: '/src/images/scottlee.jpg', name: '이현호', motto: ''},
      ]
    };
  }

  componentDidMount() {
    throttle.add('resize', 200, e => {
      
    });
  }

  componentWillUnmount() {
    throttle.end();
  }

  render() {
    const { myProfile, favorites, friends } = this.state;
    let friendSections = [
      {name: 'My Profile', list: myProfile},
      {name: 'Favorites', list: favorites},
      {name: 'Friends', list: friends}
    ];
    return (
      <div className='friends-wrapper'>
        <Input icon='search' placeholder='Search name...' />
        <div className='friends-list'>
          {
            friendSections.map(section => (
              <div key={section.name}>
                <div className='section-name'>{section.name}</div>
                <hr/>
                {
                  section.list.sort((a,b) => a.name < b.name ? -1 : 1).map((friend, index) => (
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