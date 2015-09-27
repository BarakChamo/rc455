import 'styles/desktop.scss'

import Flux      from './Flux'
import Component from 'flummox/component'
import Synth     from './components/Synth'

/*
  Initialize Flux
*/ 

let flux = new Flux()


/*
  Initialize View
*/ 

React.render(
  <Component flux={flux}>
    <Synth />
  </Component>,
  document.getElementById('synth')
)