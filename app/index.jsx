import 'styles/desktop.scss'

import Flux       from './Flux'
import ReactDOM   from 'react-dom'
import Component  from 'flummox/component'
import Synth      from 'components/Synth'
import Visualizer from 'components/controls/Visualizer'

/*
  Initialize Flux
*/ 

let flux = new Flux()


/*
  Initialize View
*/ 

ReactDOM.render(
  <div id='synth'>
    <Synth flux={flux}/>
  </div>,
  document.getElementById('container')
)