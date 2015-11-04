import 'styles/components/controls/switch.scss'

export default class Switch extends Component {
  componentWillMount() {
    this.value = this.props.getValue()
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Only render if key state changed
    return this.props.getValue() !== this.value
  }

  componentWillUpdate(nextProps, nextState){
    this.value = this.props.getValue()
  }

  handleClick(e) {
    if(e.which > 1 || e.button > 1) return
    e.stopPropagation()
    e.preventDefault()

    // Call control change action
    this.props.handler(this.props.target, this.props.control, this.props.values[this.props.values.indexOf(this.value) === 0 ? 1 : 0])
  }

  render() {
    return (
      <div className={'control-switch ' + (this.props.values.indexOf(this.value) === 1 ? 'switched' : '')}
           data-on={this.props.on}
           data-off={this.props.off}
           draggable='false'
           onClick={ e => this.handleClick(e) }
      >
      </div>
    )
  }
}