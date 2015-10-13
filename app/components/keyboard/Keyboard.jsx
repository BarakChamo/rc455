import 'styles/components/keyboard.scss'
import Key  from './key'
import Knob from 'components/controls/Knob'

const ctrlKeys  = ['A', 'W', 'S', 'E', 'D', 'F', 'T', 'G', 'Y', 'H', 'U', 'J', 'K', 'O', 'L', 'P', ';', '\'', '}', '\\'],
      keyColor  = ['w', 'b', 'w', 'b', 'w', 'w', 'b', 'w', 'b', 'w', 'b', 'w']

export default class Keyboard extends Component {
  render() {
    const keys = Array.from({length: 25}, (v, i) => <Key key={i} tone={i} ctrl={ctrlKeys[i] || ''} color={ keyColor[i % 12] } pressed={i in this.state.keys} />)

    return (
      <Component>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-xs-2'>
              <div className='control-group'>
                <span>Arp Control</span>
                <br/>
                <br/>
                <br/>
                <span>Pitch Contorl</span>
              </div>
            </div>
            <div className='keyboard col-xs-10'>
              <div className='keyboard-container'>
                {keys}
              </div>
            </div>
          </div>
        </div>
      </Component>
    )
  }
}