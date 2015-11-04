// Create transparent ghost
const ghost = document.createElement('IMG')
ghost.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const noteKeys = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

// Append ghost to document
document.body.appendChild(ghost)

export default class Key extends Component {
  componentDidMount() {
    this.elm = ghost
    this.keyboardActions = this.flux.getActions('keyboard')
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Only render if key state changed
    return this.props.pressed !== nextProps.pressed
  }

  handleOn(e) {
    if(e.which > 1 || e.button > 1) return

    // Trigger keyboard store event
    this.keyboardActions.KEY_DOWN(this.props.tone, 127)
  }

  handleOff(e) {
    // Trigger keyboard store event
    this.keyboardActions.KEY_UP(this.props.tone)
  }

  hideGhost(e) {
    // hide drag-ghost 
    e.dataTransfer && e.dataTransfer.setDragImage(this.elm, 0, 0)
  }

  render() {
    return (
      <div className={ 'key ' + (this.props.pressed ? 'pressed ' : '') + this.props.color }
        draggable='true'
        onDragStart={ e => this.hideGhost(e) }
        onMouseDown={ e => this.handleOn(e) }
        onMouseUp={   e => this.handleOff(e) }
        onDragEnter={ e => this.handleOn(e) }
        onDragExit={  e => this.handleOff(e) }
        onDragLeave={ e => this.handleOff(e) }
      >
        <span className='label'>{ noteKeys[ this.props.tone % noteKeys.length ] }</span>
        <span className='ctrl'>{ this.props.ctrl }</span>
      </div>
    )
  }
}