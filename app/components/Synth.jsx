import 'styles/components/synth.scss'

// Keyboard
import Keyboard from 'components/keyboard/Keyboard'
import Controls from 'components/controls/Controls.jsx'

export default class Synth extends Component {
  componentDidMount() {
    // 
  }

  render() {
    return (
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
    )
  }
}