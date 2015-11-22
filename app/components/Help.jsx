import 'styles/components/help.scss'

export default class Help extends Component {
  componentWillMount() {

  }

  // shouldComponentUpdate(nextProps, nextState) {

  // }

  componentWillUpdate(nextProps, nextState){
    
  }

  handleClick(e) {
    // e.stopPropagation()
    // e.preventDefault()
    this.setState({
      hidden: true
    })
  }

  handleProfile(e){
    window.open('http://www.github.com/barakchamo', '_blank')
    e.stopPropagation()
    e.preventDefault()
  }

  render() {
    let style = {
      display: this.state.hidden ? 'none' : 'block'
    }
    
    return (
      <div className={`help modal fade ${this.state.hidden ? '' : 'in'}`} style={style} draggable='false' onClick={ e => this.handleClick(e) }>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <span type="button" className="close control-label glow" data-dismiss="modal" aria-label="Close" onclick={e => this.handleClick(e)}>
                <h3 aria-hidden="true">&times;</h3>
                <span className="sr-only">Close</span>
              </span>
              <h1 className="modal-title text-center control-label glow">RC-455</h1>
              <p className="modal-title text-center control-label glow">Built by <a onclick={e => handleProfile(e)} href="http://www.github.com/barakchamo">Barak Chamo</a></p>
            </div>
            <div className="modal-body">
              <p>RC-455 is a WebAudio synthesizer, here's how what you get: </p>
              <ul>
                <li>3 oscillators with waveform, detune and amp control</li>
                <li>Low-pass and high-pass filter</li>
                <li>Distortion and reverb units</li>
                <li>LFO and envelope controlled modulation</li>
                <li>Arpeggiator and pitch control</li>
                <li>Vocoder(!)</li>
              </ul>

              <p>You can play the synth with your mouse, keyboard or hook up any MIDI controller if your browser supports the WebMIDI API.</p>

              <p>To save presets press the ✦ button, press × to delete them.</p>

              <p><a href="https://github.com/BarakChamo/rc455">More detailed instructions on GitHub.</a></p>

              <p>Have fun!</p>

              <br/>
              <div className='text-center'>
                <a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11322972/9e553260-910b-11e5-8de9-a5bf00c352ef.png' height='59px'/></a>
              </div>
              <br/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}