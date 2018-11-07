import React from 'react'
import { NavLink } from 'react-router-dom'

import './index.scss'

const Nav = () => (
  <nav id='main-nav'>
    <span id='buttons'>
      <NavLink className='main-button' to='/'>
        <i className='fas fa-user' />
        <span className='tooltiptext'>Friends</span>
      </NavLink>
      <NavLink className='main-button' to='/chats'>
        <i className='fas fa-comment' />
        <span className='tooltiptext'>Chats</span>
      </NavLink>
      <NavLink className='main-button' to='/find'>
        <i className='fas fa-search' />
        <span className='tooltiptext'>Find</span>
      </NavLink>
      <NavLink className='main-button' to='/more'>
        <i className='fas fa-ellipsis-h' />
        <span className='tooltiptext'>More</span>
      </NavLink>
      </span>
    <img id='logo' src='https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254122/logo_ism2cy.png' />
  </nav>
)

export default Nav;