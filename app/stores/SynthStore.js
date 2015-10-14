import { Store } from 'flummox'
import   audio   from 'controllers/Audio'
import   patch   from 'config/patches/default.json'
import   desc    from 'config/descriptors'

// Get saved patches
let patches = localStorage.getItem('patches')
    patches = ( patches && patches.length ) ? JSON.parse(patches) : ['default']

// Store default patches
localStorage.setItem('patches', JSON.stringify(patches))

// Store default patch
localStorage.setItem('patch_default', JSON.stringify(patch))

export default class SynthStore extends Store {

  constructor(flux) {
    super()


    /*
      Privates
    */ 

    this.currentPatch = 0


    /*
      Event Registration
    */ 

    const synthActionIds = flux.getActionIds('synth')

    this.register(synthActionIds.CONTROL_CHANGE, this.handleControlChange)
    this.register(synthActionIds.SET_PATCH, this.setPatch)
    this.register(synthActionIds.SAVE_PATCH, this.savePatch)
    this.register(synthActionIds.DELETE_PATCH, this.deletePatch)


    /*
      State definition
    */ 

    this.state = {
      // Global tempo (effects LFO, ARP, ENV, AUTOPLAY...)
      tempo: 128,
      
      // Active notes
      notes: [],

      // Synth patch preset
      patch: patch,

      // Latest control change description
      desc: ''
    }

    // Set default patch to audio manager
    audio.setPatch(this.state.patch)
  }


  /*
    Action handlers
  */ 

  handleControlChange(params) {
    const [target, control, value] = params
    
    // Update state value (test for global or voice)
    this.state.patch[this.state.patch.voice.hasOwnProperty(target) ? 'voice' : 'global'][target][control] = value

    // Update audio manager
    audio.setPatch(this.state.patch)

    // Update latest control change decription
    this.state.desc = desc[target][control](value)

    // Set state
    this.setState(this.state)
  }

  setPatch(dir) {
    // Get new patch index
    this.currentPatch = Math.min(Math.max(this.currentPatch + dir, 0), patches.length - 1)

    const patch = JSON.parse(localStorage.getItem(`patch_${patches[this.currentPatch]}`))

    // Update audio manager
    audio.setPatch(patch)

    // Set patch
    this.setState({
      patch: patch,
      desc:  `${ this.currentPatch + 1 } - ${ patches[this.currentPatch] }`
    })
  }

  savePatch() {
    const name = prompt('Preset name:')

    // Make sure name is given and free
    if (!name)                     return this.setState({desc: 'Come on...'})
    if (patches.indexOf(name) >=0) return this.setState({desc: `${name} is taken...`})

    // Add name to patch records
    patches.push(name)

    // Persist patch records
    localStorage.setItem('patches', JSON.stringify(patches)) 
    localStorage.setItem(`patch_${name}`, JSON.stringify(this.state.patch))

    // Notify save
    this.setState({desc: `Saved ${name}!`})
  }

  deletePatch() {
    const name = patches[this.currentPatch]

    if (name === 'default') return this.setState({desc: 'can\'t delete default'})

    // delete patch from localStorage
    localStorage.removeItem(`patch_${name}`)

    // Update patch list
    patches.splice(this.currentPatch, 1)
    localStorage.setItem('patches', JSON.stringify(patches)) 
    this.currentPatch = Math.min(Math.max(this.currentPatch - 1, 0), patches.length - 1)

    // Get other patch
    const patch = JSON.parse(localStorage.getItem(`patch_${patches[this.currentPatch]}`))

    // Update audio manager
    audio.setPatch(patch)

    // Set patch
    this.setState({
      patch: patch,
      desc:  `Deleted ${ name }`
    })
  }
}