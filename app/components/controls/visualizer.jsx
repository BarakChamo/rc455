import 'styles/components/visualizer.scss'

import ReactDOM     from 'react-dom'
import audioManager from 'controllers/Audio'
import glfx         from 'utils/glfx'

// Load scanlines
let scanlines = new Image()
scanlines.source = 'public/scanlines.png'

export default class SynthVisualizer extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.desc !== nextProps.desc) {
      this.updateLabel(nextProps.desc)
    }

    // Never re-render canvas, we'll lose the context
    return false
  }

  componentDidMount() {
    this.startVisualizer(ReactDOM.findDOMNode(this).firstChild.getContext('2d'))
  }

  updateLabel(label) {
    this.label = label

    // Clear previous timeouts
    this.timeout && clearTimeout(this.timeout)

    // Set timeout to clear label
    this.timeout = setTimeout(() => this.label = undefined, 1000)
  }

  startVisualizer(ctx) {
    let [fxCanvas, texture] = this.setTexture(ctx),
        self = this

    // Set default parameters
    ctx.font = '20px monospace'
    ctx.textAlign = 'center'

    function visualize(){
      const data  = audioManager.analyse(),
              zc  = audioManager.zeroCrossing(),
            scale = ctx.canvas.height / 256

      // Clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
      let gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, ctx.canvas.height)
      gradient.addColorStop(0,    'rgba(0,0,0,0)')
      gradient.addColorStop(0.14, 'hsl(200,100%,50%)')
      gradient.addColorStop(0.15, 'hsl(200,100%,50%)')
      gradient.addColorStop(0.84, 'hsl(200,100%,50%)')
      gradient.addColorStop(0.85, 'hsl(200,100%,50%)')
      gradient.addColorStop(1,    'rgba(0,0,0,0)')

      // Style line
      ctx.strokeStyle = gradient
      ctx.lineWidth = 1.5
      ctx.shadowBlur = 5
      ctx.shadowColor = 'hsl(200,100%,50%)'

      // Draw waveform
      ctx.beginPath()

        ctx.moveTo( 0,(256 - data[zc]) * scale )
      
        for (var i=zc, j=0; ( j < ctx.canvas.width ) && ( i < data.length ); i++, j++) 
          ctx.lineTo( j,( 256 - data[i] ) * scale )

      ctx.stroke()

      // Render label
      if (self.label) {
        ctx.strokeText(self.label, ctx.canvas.width / 2, 40)
        ctx.fillText(self.label, ctx.canvas.width / 2, 40)
      }

      // Update texture
      self.updateTexture(ctx, fxCanvas, texture)

      // Repeat!
      requestAnimationFrame(visualize)
    }

    // Rave...
    requestAnimationFrame(visualize)
  }

  setTexture(ctx) {
    // Init GLFX
    let fxCanvas = glfx.canvas(),
        texture  = fxCanvas.texture(ctx.canvas)

    // Hide original source canvas
    ctx.canvas.parentNode.insertBefore(fxCanvas, ctx.canvas)
    ctx.canvas.style.display = 'none'
    fxCanvas.className       = ctx.canvas.className
    fxCanvas.id              = ctx.canvas.id
    ctx.canvas.id            = 'old_' + ctx.canvas.id

    return [fxCanvas, texture]
  }

  updateTexture(ctx, fxCanvas, texture){
      // Give the source scanlines
      ctx.drawImage(scanlines, 0, 0, ctx.canvas.width, ctx.canvas.height)
      
      // Load the latest source frame
      texture.loadContentsOf(ctx.canvas)
      
      // Apply WebGL magic
      fxCanvas.draw(texture)
              .bulgePinch(ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width * 0.75, 0.12)
              .vignette(0.25, 0.75)
              .update()
  }

  render() {
    return (
      <div className="flicker scanlines">
        <canvas className='synth-visualizer'></canvas>
      </div>
    )
  }
}