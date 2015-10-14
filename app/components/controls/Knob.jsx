import 'styles/components/controls/knob.scss'

let eventKeys = [
  'ctrlKey',
  'shiftKey',
  'altKey',
  'deltaX',
  'deltaY'
]

export default class Knob extends Component {
  componentWillMount() {
    // Get synth actions
    this.synthActions = this.flux.getActions('synth')


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
  }

  shouldComponentUpdate(nextProps, nextState) {  
    // Only render if key state changed
    return this.props.getValue() !== ( nextProps.values ? nextProps.values[this.value] : this.value )
  }

  componentWillUpdate(nextProps, nextState){
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
    this.synthActions.CONTROL_CHANGE(this.props.target, this.props.control, value)
  }

  render() {
    let self = this

    const r = ( (this.value - this.min) / (this.range + (this.jump || 0)) ) * 360

    const style = {
            transform: `rotate(${r}deg)`,
      WebkitTransform: `rotate(${r}deg)`
    }

    return (
      <div className='control-knob'
           draggable='false'
        // onDragStart={ e => this.handleWhatever(e) }
        // onDragEnter={ e => this.handleWhatever(e) }
        // onDragExit={  e => this.handleWhatever(e) }
        // onDragLeave={ e => this.handleWhatever(e) }
        // onMouseDown={ e => this.handleWhatever(e, 'onMouseDown') }
        // onMouseUp={   e => this.handleWhatever(e, 'onMouseUp'  ) }
        // onMouseMove={ e => this.handleWhatever(e, 'onMouseMove') }
           onWheel={ e => this.handleWheel( e, 'onWheel' ) }
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