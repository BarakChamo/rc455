import 'styles/components/keyboard.scss'

import Key    from './Key'
import Knob   from 'components/controls/Knob'
import Switch from 'components/controls/Switch'
import Button from 'components/controls/Button'

              // "type": "Switch",
              // "values":[true, false],
              // "on": "ON",
              // "off": "OFF"

const ctrlKeys  = ['A', 'W', 'S', 'E', 'D', 'F', 'T', 'G', 'Y', 'H', 'U', 'J', 'K', 'O', 'L', 'P', ';', '\'', '}', '\\'],
      keyColor  = ['w', 'b', 'w', 'b', 'w', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
      midiBase  = 48

export default class Keyboard extends Component {
  render() {
    const keys = Array.from({length: 25}, (v, i) => <Key key={i} tone={i} ctrl={ctrlKeys[i] || ''} color={ keyColor[i % 12] } pressed={(i + midiBase + 12 * this.state.transposition) in this.state.keys} />)

    let actions = this.flux.getActions('keyboard')

    return (
      <Component>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-xs-2'>
              <div className='control-group arp'>
                <div className='row text-center'>
                  <div className='col-xs-12 control-label text-center'>Arpeggiator</div>
                  <div className='col-xs-6'>
                    <Knob
                      handler={ actions.SET_ARP_MODE }
                      values={['OFF', 1]}
                      getValue={ () => this.state.arp.mode }
                      ticks={ 5 }
                    />
                    <div className='control-label mini text-center'>mode</div>
                  </div>
                  <div className='col-xs-6'>
                    <Knob
                      handler={ actions.SET_ARP_RATE }
                      min={ 150 }
                      max={ 500 }
                      jump={ 25 }
                      ticks={ 5 }
                      getValue={ () => this.state.arp.rate }
                    />
                    <div className='control-label mini text-center'>rate</div>
                  </div>
                </div>
                <div className='row text-center'>
                  <div className='col-xs-12 control-label text-center'>- Octave +</div>
                  <div className='col-xs-12'>
                    <Button
                      label='&#8722;'
                      handler={ actions.PITCH_CHANGE }
                      on={ this.state.transposition < 0 }
                      value={-1}
                    />
                    <Button
                      label='&#43;'
                      handler={ actions.PITCH_CHANGE }
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