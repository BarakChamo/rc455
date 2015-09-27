// Create transparent ghost
const ghost = document.createElement('IMG')
ghost.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

// Append ghost to document
document.body.appendChild(ghost)

export default class Key extends Component {
  componentDidMount() {
    this.elm = ghost
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Only render if key state changed
    return this.props.pressed !== nextProps.pressed
  }

  handleOn(e) {
    // Trigger keyboard store event
    this.flux.getActions('keyboard').KEY_DOWN(this.props.tone)
  }

  handleOff(e) {
    // Trigger keyboard store event
    this.flux.getActions('keyboard').KEY_UP(this.props.tone)
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
        {this.props.tone}
        <div className='ctrl'>{this.props.ctrl}</div>
      </div>
    )
  }
}