import React, { Component } from 'react'
import { Input } from 'semantic-ui-react'

import './index.scss';

export default class Friends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myProfile: [{photo: '/src/images/me.jpg', name: 'Jonathan Rim', motto: '이 세상에서 제일 필오한건.. 마음이 따뜻한 사람~'}],
      favorites: [],
      friends: []
    };
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
                <span className='section-name'>{section.name}</span>
                <hr/>
                {
                  section.list.map((friend, index) => (
                    <div className='friend' key={friend.name + index}>
                      <img src={friend.photo} />
                      <span>{friend.name}</span>
                      <div className='motto'>
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