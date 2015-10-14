import 'styles/components/keyboard.scss'

import Key    from './key'
import Knob   from 'components/controls/Knob'
import Button from 'components/controls/Button'

const ctrlKeys  = ['A', 'W', 'S', 'E', 'D', 'F', 'T', 'G', 'Y', 'H', 'U', 'J', 'K', 'O', 'L', 'P', ';', '\'', '}', '\\'],
      keyColor  = ['w', 'b', 'w', 'b', 'w', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
      midiBase  = 48

export default class Keyboard extends Component {
  render() {
    const keys = Array.from({length: 25}, (v, i) => <Key key={i} tone={i} ctrl={ctrlKeys[i] || ''} color={ keyColor[i % 12] } pressed={(i + midiBase + 12 * this.state.transposition) in this.state.keys} />)

    let handler = this.flux.getActions('keyboard').PITCH_CHANGE

    return (
      <Component>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-xs-2'>
              <div className='control-group'>
                <div className='row control-group-inner'>
                  <div className='col-xs-6'>
                    <div className='control-label text-center'>Arp.</div>
                  </div>
                  <div className='col-xs-6'>
                    <span>Arp Control</span>
                  </div>
                </div>
              </div>
              <div className='control-group'>
                <div className='row control-group-inner'>
                  <div className='col-xs-12 control-label text-center'>- Octave +</div>
                  <div className='col-xs-12'>
                    <Button
                      label='&#8722;'
                      handler={ handler }
                      on={ this.state.transposition < 0 }                      
                      value={-1}
                    />
                    <Button
                      label='&#43;'
                      handler={ handler }
                      on={ this.state.transposition > 0 }
                      value={1}
                    />
                  </div>
                </div>
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