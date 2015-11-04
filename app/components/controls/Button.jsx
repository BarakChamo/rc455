import 'styles/components/controls/button.scss'

export default class Button extends Component {
  handleClick(e) {
    if(e.which > 1 || e.button > 1) return
    e.stopPropagation()
    e.preventDefault()

    // Call control change action
    this.props.handler(this.props.value)
  }

  render() {

    return (
      <div className={ 'control-button ' + ( this.props.on ? 'pressed' : '' ) }
           draggable='false'
           data-icon={ this.props.label }
           onClick={ e => this.handleClick(e) }
      >
      </div>
    )
  }
}