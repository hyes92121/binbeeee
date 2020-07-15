import React from 'react'
import { Grid, Menu } from 'semantic-ui-react'
import { Link, useLocation } from 'react-router-dom'

export default () => {
  const location = useLocation();
  const activeItem = location.pathname;
  console.log(location.pathname);

  return (
    <Grid.Column width={2}>
      <Menu fluid vertical tabular>
        <Menu.Item
          name='home'
          active={activeItem === '/'}
          as={Link}
          to='/'
        />
        <Menu.Item
          name='ocr'
          active={activeItem === '/ocr'}
          as={Link}
          to='/ocr'
        />
        <Menu.Item
          name='layout'
          active={activeItem === '/layout'}
          as={Link}
          to='/layout'
        />
        <Menu.Item
          name='translate'
          active={activeItem === '/translate'}
          as={Link}
          to='/translate'
        />
      </Menu>
    </Grid.Column>
  )
}