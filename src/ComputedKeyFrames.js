export default function ComputedKeyFrames(config) {
  this.config = config;
  this.easingValues = [];
  this.easingSlices = [];
  this.frames = [];

  this.init = () => {

    if (!this.config) {
      console.error('a config must be provided');
      return;
    }

    this.sanitizeConfig();

    this.calculateEasingValues();

    this.calcualateEasingSlices();

    this.calculateEasingSlicesMapping();

    this.calculateFrames();

    this.addStyleToDOM(this.frames);
  }

  this.sanitizeConfig = () => {
    const frameCount = config.frames.length;
    for (var i = 0; i < frameCount; i++) {
      let frame = config.frames[i];

      if(frame.translate3d){
        let t3d = frame.translate3d;
        t3d.x = +(t3d.x || 0);
        t3d.y = +(t3d.y || 0);
        t3d.z = +(t3d.z || 0);
        frame.translate3d = t3d;
      }
      
      if(frame.scale3d){
        let s3d = frame.scale3d;
        s3d.x = +(s3d.x || 0);
        s3d.y = +(s3d.y || 0);
        s3d.z = +(s3d.z || 0);
        frame.scale3d = s3d;
      }
      
    }
  }

  this.calculateEasingValues = () => {
    const maxPercentage = 100;
    let easingValues = [];
    for (var i = 0; i <= maxPercentage; i++) {
      let easingValue = config.easing(i, 0, 1, maxPercentage); // t, b, c, d
      easingValues.push(easingValue);
    }
    this.easingValues = easingValues;
  }

  this.calcualateEasingSlices = () => {
    let easingSlices = [];
    const frameCount = config.frames.length;
    for (var i = 0; i < frameCount; i++) {
      let frame = config.frames[i];
      let isLast = i === frameCount - 1;

      if (isLast) {
        if (frame.framePercentage < 100) {
          let nextFrame = config.frames[0];
          easingSlices.push({
            easingValues: this
              .easingValues
              .slice(~~ frame.framePercentage),
            translate3d: {
              from: frame.translate3d,
              to: nextFrame.translate3d
            },
            scale3d: {
              from: frame.scale3d,
              to: nextFrame.scale3d
            }
          });
        } else {
          easingSlices.push({
            easingValues: this
              .easingValues
              .slice(~~ frame.framePercentage),
            translate3d: {
              from: frame.translate3d,
              to: frame.translate3d
            },
            scale3d: {
              from: frame.scale3d,
              to: frame.scale3d
            }
          });
        }
      } else {
        let nextFrame = config.frames[i + 1];
        easingSlices.push({
          easingValues: this
            .easingValues
            .slice(~~ frame.framePercentage, nextFrame.framePercentage),
          translate3d: {
            from: frame.translate3d,
            to: nextFrame.translate3d
          },
          scale3d: {
            from: frame.scale3d,
            to: nextFrame.scale3d
          }
        });
      }
    }
    this.easingSlices = easingSlices;
  };

  this.calculateEasingSlicesMapping = () => {
    this
      .easingSlices
      .forEach((easingSlice) => {
        let {translate3d, easingValues} = easingSlice;
        let first = easingValues[0];
        let last = __.last(easingValues);
        easingSlice.easingValuesMapped = easingValues.map((n) => {
          let x = rangeMap(n, first, last, translate3d.from.x, translate3d.to.x);
          let y = rangeMap(n, first, last, translate3d.from.y, translate3d.to.y);
          let z = rangeMap(n, first, last, translate3d.from.y, translate3d.to.z);

          return {
            translate3d: {
              x,
              y,
              z
            }
          };
        });
      });

  };

  this.calculateFrames = () => {
    let frames = [];
    this
      .easingSlices
      .forEach((easingSlice, index) => {
        let mapped = easingSlice
          .easingValuesMapped
          .map((val, i) => {
            let t3d = val.translate3d;
            let s3d = val.scale3d; // not used yet

            if (t3d) {
              return `${i + frames.length}%{transform:translate3d(${round(t3d.x, 3)}${config.unit},${round(t3d.y, 3)}${config.unit},${round(t3d.z, 3)}${config.unit})}\n`;
            }

            return '\n';
          });

        frames.push(...mapped);
      });
    this.frames = frames;
  };

  this.addStyleToDOM = function (frames) {
    let styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = `@keyframes ${this
      .config.animationName}{
 ${frames.join(' ')}
    }`;
    document.getElementsByTagName('head')[0].appendChild(styleElement);
  }
}

export function round(number, precision) {
  if (precision === undefined) 
    return number;
  
  var factor = Math.pow(10, precision);
  var tempNumber = number * factor;
  var roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
};

/*
  Value x which is in range [a,b]
  is mapped to a new value in range [c,d]
*/
export function rangeMap(x, a, b, c, d) {
  if (x < a || x > b) {
    console.error('rangeMap x is out of range');
  }
  if (a === b) {
    return c;
  }
  if (c === d) {
    return c;
  }
  return (x - a) / (b - a) * (d - c) + c;
}

export const __ = {
  last: function last(array) {
    if (array && array.length) {
      return array[array.length - 1];
    }
  }
};
