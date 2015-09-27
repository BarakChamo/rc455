import 'styles/components/keyboard.scss'
import Key from './key'

const ctrlKeys  = ['A', 'W', 'S', 'E', 'D', 'F', 'T', 'G', 'Y', 'H', 'U', 'J', 'K', 'O', 'L', 'P', ';', 'F', 'T', 'G'],
      keyColor  = ['w', 'b', 'w', 'b', 'w', 'w', 'b', 'w', 'b', 'w', 'b', 'w']

export default class Keyboard extends Component {
  render() {
    const keys = Array.from({length: 25}, (v, i) => <Key key={i} tone={i} ctrl={ctrlKeys[i] || ''} color={ keyColor[i % 12] } pressed={i in this.state.keys} />)

    return (
      <Component>
        <div className='keyboard col-xs-12'>
          {keys}
        </div>
      </Component>
    )
  }
}