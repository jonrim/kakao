import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

import './index.scss'

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { profile } = this.props;
    return (
      <div className='user-profile'>
        <div className='background'>
          <div className='background-photo'>
              <img src='https://i.redd.it/enmir0135l6y.jpg' />
          </div>
          <div className='motto'>{profile.motto}</div>
          <div className='photo'>
            <div className='tv-border'>
              <img src={profile.photo} />
            </div>
          </div>
        </div>
        <div className='name'>{profile.name}</div>
      </div>
    )
  }
}