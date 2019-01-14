const particlesColor = '#2b56f5'
const particlesColorAlt = '#00c0fa'
let ParticleConfig = // Update your personal code.
{
  'particles': {
    'number': {
      'value': 30,
      'density': {
        'enable': true,
        'value_area': 800
      }
    },
    'color': {
      'value': particlesColorAlt
    },
    'shape': {
      'type': 'circle',
      'opacity': 0.20,
      'stroke': {
        'width': 0,
        'color': particlesColor
      },
      'polygon': {
        'nb_sides': 5
      },
      'image': {
        'src': 'img/github.svg',
        'width': 100,
        'height': 100
      }
    },
    'opacity': {
      'value': 0.30,
      'random': false,
      'anim': {
        'enable': false,
        'speed': 1,
        'opacity_min': 0.12,
        'sync': false
      }
    },
    'size': {
      'value': 6,
      'random': true,
      'anim': {
        'enable': false,
        'speed': 40,
        'size_min': 0.08,
        'sync': false
      }
    },
    'line_linked': {
      'enable': true,
      'distance': 150,
      'color': particlesColor,
      'opacity': 0.50,
      'width': 1.3
    },
    'move': {
      'enable': true,
      'speed': 6,
      'direction': 'none',
      'random': false,
      'straight': false,
      'out_mode': 'out',
      'bounce': false,
      'attract': {
        'enable': false,
        'rotateX': 600,
        'rotateY': 1200
      }
    }
  },
  'interactivity': {
    'detect_on': 'canvas',
    'events': {
      'onhover': {
        'enable': true,
        'mode': 'repulse'
      },
      'onclick': {
        'enable': true,
        'mode': 'push'
      },
      'resize': true
    },
    'modes': {
      'grab': {
        'distance': 400,
        'line_linked': {
          'opacity': 1
        }
      },
      'bubble': {
        'distance': 400,
        'size': 40,
        'duration': 2,
        'opacity': 8,
        'speed': 3
      },
      'repulse': {
        'distance': 200,
        'duration': 0.4
      },
      'push': {
        'particles_nb': 4
      },
      'remove': {
        'particles_nb': 2
      }
    }
  },
  'retina_detect': true
}
// Stop here.

export { ParticleConfig }
