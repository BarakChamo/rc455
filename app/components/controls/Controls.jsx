import 'styles/components/controls/controls.scss'

// Synth controls definitions
import definition from 'config/controls.json'
import     preset from 'config/patches/default.json'

// Synth Controls
import Knob       from './Knob'
import Switch     from './Switch'
import Button     from './Button'
import Visualizer from './Visualizer'

const components = {
  Knob:   Knob,
  Switch: Switch
}

export default class SynthControls extends Component {
  componentWillMount() {
    const patch = this.state.patch

    this.controls = {
      left:   [],
      right:  [],
      center: [],
      extra:  []
    }

    // Get synth actions for control changes
    let handler = this.flux.getActions('synth').CONTROL_CHANGE

    const classMap = {
      left:   'col-xs-1 control-group',
      right:  'col-xs-1 control-group',
      center: 'col-xs-3',
      extra:  'col-xs-6'
    }

    for (let side in definition) for (let column of definition[side]) {
      let sections = []

      for (let section of column) {
        if (section.label) sections.push( <div className='control-label' key={ section.label } >{ section.label }</div> )

        for (let target in section.controls) for (let control in section.controls[target]) {
          const Control = components[section.controls[target][control].type],
                props   = section.controls[target][control]

          sections.push(
            <Control 
              flux={ this.flux }
              handler= { handler }
              key={ target + control + section.label }
              target={ target }
              control={ control }
              getValue={ this.getValue(preset.global[target] ? 'global' : 'voice', target, control).bind(this) }
              value={ patch[preset.global[target] ? 'global' : 'voice'][target][control] }
             { ...props }
            />
          )

          if (props.label) sections.push( 
            <div className='control-label mini' key={ target + control }>
              { props.label }
            </div> 
          )
        }
      }

      this.controls[side].push(
        <div className={`${classMap[side]}`} key={ side + this.controls[side].length } >
          <div className='control-group-inner'>
            { sections }
          </div>
        </div>
      )
    }
  }

  getValue(route, target, control) {
    return function(){
      return this.state.patch[route][target][control]
    }
  }

  render() {
    let actions = this.flux.getActions('synth')

    return (
      <div className='col-xs-12'>
        <div className='container-fluid'>
          <div className='row synth-control'>
            
            { this.controls.left }
            
            <div className='col-xs-4 controls-center'>
              <h1 className='control-label glow text-center'>RC-455<small><small><small>f.1</small></small></small></h1>
              <div className='control-group control-display'>

                  <Visualizer desc={this.state.desc}/>

              </div>

              <div className='synth-control control-group'>
                <div className='row control-group-inner'>
                  { this.controls.center }
                </div>
              </div>

            </div>

            { this.controls.right }

            <div className='col-xs-2'>
              <div className='controls-global'>
                <div className='control-group'>
                  <div className='row'>
                    <div className='col-xs-12 control-label presets text-center'>Presets</div>
                    <div className='col-xs-12 text-center container-fluid'>
                      <div className='row'>
                        <div className='col-xs-6 text-center'>
                          <Button
                            label='<'
                            handler={ actions.SET_PATCH }
                            // on={ this.state.transposition < 0 }                      
                            value={-1}
                          />
                          <div className='control-label mini text-center presets'>prev.</div>
                        </div>
                        <div className='col-xs-6 text-center'>
                          <Button
                            label='>'
                            handler={ actions.SET_PATCH }
                            // on={ this.state.transposition > 0 }
                            value={1}
                          />
                          <div className='control-label mini text-center presets'>next</div>
                        </div>
                      </div>
                    </div>
                    <div className='col-xs-12 text-center container-fluid'>
                      <div className='row'>
                        <div className='col-xs-6 text-center'>
                          <Button
                            label='✦'
                            handler={ actions.SAVE_PATCH }
                          />
                          <div className='control-label mini text-center'>save</div>
                        </div>
                        <div className='col-xs-6 text-center'>
                          <Button
                            label='×'
                            handler={ actions.DELETE_PATCH }
                          />
                          <div className='control-label mini text-center'>delete</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='controls-extra control-group'>
                <div className='row control-group-inner'>
                  { this.controls.extra }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
 }
}