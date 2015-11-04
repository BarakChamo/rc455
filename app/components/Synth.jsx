import 'styles/components/synth.scss'

import Help     from 'components/Help'
import Keyboard from 'components/keyboard/Keyboard'
import Controls from 'components/controls/Controls'

export default class Synth extends Component {
  componentDidMount() {
    // 
  }

  render() {
    return (
      <div>
        <Help/>
        <div id="synth">
          <div className='container-fluid'>
            <div className='row'>
              <Controls
                connectToStores={['synth']}
              />
            </div>
            
            <Keyboard
              connectToStores={['keyboard']}
            />

          </div>
        </div>
      </div>
    )
  }
}