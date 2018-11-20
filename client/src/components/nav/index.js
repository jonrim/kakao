import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { Dropdown } from 'semantic-ui-react'
import './index.scss'

const Nav = props => {
  let numNewMessages = displayNumNewMessages(props.friends || []);
  return (
    <nav id='main-nav'>
      <span id='buttons'>
        <NavLink id='friends-nav-button' className='main-button' activeClassName='clicked' exact to='/'>
          <i className='fas fa-user' />
          <span className='tooltiptext'>Friends</span>
        </NavLink>
        <NavLink id='chats-nav-button' className='main-button' activeClassName='clicked' to='/chats'>
          <i className='fas fa-comment' />
          <span className='tooltiptext'>Chats</span>
          {
            numNewMessages !== 0 &&
            <div className='new-messages-number'>
              <p>{numNewMessages}</p>
            </div>
          }
        </NavLink>
        <NavLink id='find-nav-button' className='main-button' activeClassName='clicked' to='/find'>
          <i className='fas fa-search' />
          <span className='tooltiptext'>Find</span>
        </NavLink>
        <NavLink id='more-nav-button' className='main-button' activeClassName='clicked' to='/more'>
          <i className='fas fa-ellipsis-h' />
          <span className='tooltiptext'>More</span>
        </NavLink>
      </span>
      <Dropdown icon='content' className='dropdown-button'>
        <Dropdown.Menu>
          <Dropdown.Item icon='sign out' text='Log out' onClick={props.logOut} />
        </Dropdown.Menu>
      </Dropdown>
      <img id='logo' src='https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254122/logo_ism2cy.png' />
    </nav>
  )
}

function displayNumNewMessages(friends) {
  let totalNumOfNewMessages = 0, currMessage, chatHistory;
  friends.forEach(friend => {
    chatHistory = friend.chatHistory || [];
    for (let i = chatHistory.length - 1; i >= 0; i--) {
      currMessage = chatHistory[i]; 
      if (currMessage.friend) {
        if (currMessage.read) break;
        totalNumOfNewMessages++;
      }
    }
  })
  return totalNumOfNewMessages > 99 ? '99+' : totalNumOfNewMessages;
}

export default withRouter(Nav)