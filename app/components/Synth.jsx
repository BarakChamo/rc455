import Keyboard from './keyboard/Keyboard'

export default class Synth extends Component {
  componentDidMount() {
    // 
  }

  render() {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <Keyboard
            connectToStores={['keyboard']}
          />
        </div>
      </div>
    )
  }
}