import 'styles/components/controls/knob.scss'

// Create transparent ghost
const ghost = document.createElement('IMG')
ghost.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const noteKeys = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

// Append ghost to document
document.body.appendChild(ghost)

const wheelMin  = 10,
      dragMin   = 10,
      dragRange = 25

let eventKeys = [
  'ctrlKey',
  'shiftKey',
  'altKey',
  'deltaX',
  'deltaY'
]

export default class Knob extends Component {
  componentWillMount() {
    // Handle discrete values
    if (this.props.values) {
      
      this.value = this.props.values.indexOf(this.props.getValue())

      this.min   = 0
      this.max   = this.props.values.length - 1
      this.jump  = 1
      this.ticks = this.props.values.length
    } else {

      this.value = this.props.getValue()

      // Default range to MIDI values
      this.min   = this.props.min || 0
      this.max   = this.props.max || 127
      this.jump  = this.props.jump
      this.ticks = this.props.ticks
    }

    this.range = this.max - this.min

    // Render one-offs
    this.tickElms = Array.from({length: this.ticks}, (v,i) => i).map(function(i){
      const tr = ( i / this.ticks ) * 360

      const tickStyle = {
              transform: `rotate(${tr}deg)`,
        WebkitTransform: `rotate(${tr}deg)`
      }

      return (<div className='tick' key={`${Math.random()}`} style={ tickStyle } />)
    }.bind(this))

    this.throttledDrag = _.throttle(this.handleDrag, 25)
  }

  shouldComponentUpdate(nextProps, nextState) {  
    // Only render if key state changed
    return this.props.getValue() !== ( nextProps.values ? nextProps.values[this.value] : this.value )
  }

  componentWillUpdate(nextProps, nextState){
    // Reset current spin
    // this.currentSpin = 0

    // Set value
    this.value = nextProps.values ? nextProps.values.indexOf(this.props.getValue()) : this.props.getValue()
  }

  handleWheel(e) {
    e.stopPropagation()
    e.preventDefault()

    const delta = e.deltaY

    let value = Math.min(Math.max(this.min, this.value + ((this.jump * (delta / Math.abs(delta))) || delta)), this.max)

    // If discrete, map back to correct value
    if (this.props.values) value = this.props.values[value]

    // Call control change action
    this.props.handler(this.props.target, this.props.control, value)
  }

  handleDrag(e) {
    // e.stopPropagation()
    // e.preventDefault()

    if(!this.drag || (e.clientY || e.pageY) === null) return

    // Get position

    const position = (Math.min(Math.max((( this.start - (e.clientY || e.pageY) ) / dragRange), -1), 1) + 1) / 2

    // Get value
    let value = Math.min(Math.max(this.min, position * this.range), this.max)

    // Normalize to nearest jump
    value = this.jump ? Math.floor(value / this.jump) * this.jump : value

    // If discrete, map back to correct value
    if (this.props.values) value = this.props.values[value]

    // Call control change action
    this.props.handler(this.props.target, this.props.control, value)
  }

  handleDragStart(e) {
    this.drag  = true
    this.start = e.clientY || e.pageY
    
    // hide drag-ghost 
    e.dataTransfer && e.dataTransfer.setDragImage(ghost, 0, 0)
  }

  handleDragEnd(e) {  
    this.drag = false

    e.stopPropagation()
    e.preventDefault()
  }

  render() {
    let self = this

    const r = ( (this.value - this.min) / (this.range + (this.jump || 0) ) ) * 360

    const style = {
            transform: `rotate(${r}deg)`,
      WebkitTransform: `rotate(${r}deg)`
    }

    return (
      <div className='control-knob'
           draggable='true'
           onWheel={     e => this.handleWheel(e) }
           onDragStart={ e => this.handleDragStart(e) }
           onDragEnd={   e => this.handleDragEnd(e) }
           onDrag={      e => this.throttledDrag(e) }
      >
        <div className='hole'></div>
        <div className='cogs'    style={ style }></div>
        <div className='metal'></div>
        <div className='pointer' style={ style }></div>

        { this.tickElms }
      </div>
    )
  }
}