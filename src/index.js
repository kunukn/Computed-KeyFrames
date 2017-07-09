import './index.scss';
import ComputedKeyFrames from './ComputedKeyFrames';

const config = {
  styleId: 'my-style',
  animationName: 'anim-computed',
  unit: {
    translate3d: 'vmin',
    scale3d: '',
  },
  frames: [
    {
      framePercentage: 0,
      translate3d: {
        x: 0,
        y: 40,
       // z: 0 // optional, defaults to 0
      },
      scale3d: {
        x: 1, y: 1, z: 1
      },
    }, {
      framePercentage: 20,
      translate3d: {
        x: 20,
        //y: 0, // optional, defaults to 0
        z: 0
      },
       scale3d: {
        x: 1, y: 1, z: 1
      },
    }, {
      framePercentage: 40,
      translate3d: {
        x: 40,
        y: 40,
        z: 0
      }, scale3d: {
        x: 2, y: 2, z: 1
      },
    }, {
      framePercentage: 60,
      translate3d: {
        x: 0,
        y: 20,
        z: 0
      },
       scale3d: {
        x: 1, y: 1, z: 1
      },
    }, 
    {
      framePercentage: 80,
      translate3d: {
        x: 40,
        y: 20,
        z: 0
      },
       scale3d: {
        x: 1, y: 1, z: 1
      },
    }, 
    /* // can be omitted if 100% is equal to 0%
    {
      framePercentage: 100,
      translate3d: {
        x: 0,
        y: 40,
        z: 0
      },
       scale3d: {
        x: 1, y: 1, z: 1
      },
    }
    */
  ],
  easing: function easeOutQuart(t, b, c, d) {
    /*
      from: http://gizma.com/easing/
      t: currentTime
      b: startTime
      c: change in time
      d: duration
    */
    t /= d;
    t--;
    return -c * (t * t * t * t - 1) + b;
  }
};

let computedKeyFrames = new ComputedKeyFrames(config);
computedKeyFrames.init();
