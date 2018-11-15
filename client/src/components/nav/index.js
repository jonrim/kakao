import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import './index.scss'

const Nav = props => {
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
      <img id='logo' src='https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254122/logo_ism2cy.png' />
    </nav>
  )
}

export default Nav