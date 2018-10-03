import React from 'react'
import { Link } from 'react-router-dom'

import './index.scss'

const Nav = () => (
  <nav id='main-nav'>
    <Link className='main-button' to='/'>
      <i className='fas fa-user'></i>
      <span className='tooltiptext'>Friends</span>
    </Link>
    <Link className='main-button' to='/chats'>
      <i className='fas fa-comment'></i>
      <span className='tooltiptext'>Chats</span>
    </Link>
    <Link className='main-button' to='/find'>
      <i className='fas fa-search'></i>
      <span className='tooltiptext'>Find</span>
    </Link>
    <Link className='main-button' to='/more'>
      <i className='fas fa-ellipsis-h'></i>
      <span className='tooltiptext'>More</span>
    </Link>
    <img id='logo' src={ require('Images/logo.png') } />
  </nav>
)

export default Nav;