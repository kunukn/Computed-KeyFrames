import './index.scss';
import ComputedKeyFrames from './ComputedKeyFrames';

const config = {
  styleId: 'my-style',
  animationName: 'anim-computed',
  unit: 'vmin',
  frames: [
    {
      framePercentage: 0,
      translate3d: {
        x: 0,
        y: 40,
        z: 0
      }
    }, {
      framePercentage: 20,
      translate3d: {
        x: 20,
        y: 0,
        z: 0
      }
    }, {
      framePercentage: 40,
      translate3d: {
        x: 40,
        y: 40,
        z: 0
      }
    }, {
      framePercentage: 60,
      translate3d: {
        x: 0,
        y: 20,
        z: 0
      }
    }, 
    {
      framePercentage: 80,
      translate3d: {
        x: 40,
        y: 20,
        z: 0
      }
    }, 
    /* // can be omitted if 100% is equal to 0%
    {
      framePercentage: 100,
      translate3d: {
        x: 0,
        y: 40,
        z: 0
      }
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
