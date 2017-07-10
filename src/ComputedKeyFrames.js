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

    this.calculateEasingSlicesMapping(
      {easingSlices: this.easingSlices});

    this.calculateFrames(
      {easingSlices: this.easingSlices});

    this.addStyleToDOM(
      {frames: this.frames, animationName: this.config.animationName});
  }

  this.sanitizeConfig = () => {
    const frameCount = this.config.frames.length;
    for (var i = 0; i < frameCount; i++) {
      let frame = this.config.frames[i];

      if(frame.translate3d){
        let _3d = frame.translate3d;
        _3d.x = parseFloat(_3d.x, 10);
        _3d.y = parseFloat(_3d.y, 10);
        _3d.z = parseFloat(_3d.z, 10);      
        if(isNaN(_3d.x)) _3d.x = 0;
        if(isNaN(_3d.y)) _3d.y = 0;
        if(isNaN(_3d.z)) _3d.z = 0;
        frame.translate3d = _3d;
      }
      
      if(frame.scale3d){
        let _3d = frame.scale3d;
        _3d.x = parseFloat(_3d.x, 10);
        _3d.y = parseFloat(_3d.y, 10);
        _3d.z = parseFloat(_3d.z, 10);
        if(isNaN(_3d.x)) _3d.x = 1;
        if(isNaN(_3d.y)) _3d.y = 1;
        if(isNaN(_3d.z)) _3d.z = 1;
        frame.scale3d = _3d;
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

  this.calculateEasingSlicesMapping = ({easingSlices}) => {
    easingSlices
      .forEach((easingSlice) => {
        let {translate3d, scale3d, easingValues} = easingSlice;
        let first = easingValues[0];
        let last = __.last(easingValues);
        easingSlice.easingValuesMapped = easingValues.map((n) => {

          let mapped = {};

          if(translate3d && translate3d.from && translate3d.to){
            let x = rangeMap(n, first, last, translate3d.from.x, translate3d.to.x);
            let y = rangeMap(n, first, last, translate3d.from.y, translate3d.to.y);
            let z = rangeMap(n, first, last, translate3d.from.y, translate3d.to.z);
            mapped.translate3d = { x, y, z };
          }

          if(scale3d && scale3d.from && scale3d.to){
            let x = rangeMap(n, first, last, scale3d.from.x, scale3d.to.x);
            let y = rangeMap(n, first, last, scale3d.from.y, scale3d.to.y);
            let z = rangeMap(n, first, last, scale3d.from.y, scale3d.to.z);
            mapped.scale3d = { x, y, z };
          }

          return mapped;
        });
      });

  };

  this.calculateFrames = ({easingSlices}) => {
    let frames = [];
    easingSlices
      .forEach((easingSlice, index) => {
        let mapped = easingSlice
          .easingValuesMapped
          .map((val, i) => {
            let t3d = val.translate3d;
            let s3d = val.scale3d;

            let t3dCss = '';
            let s3dCss = '';
            let t3dUnit = config.unit.translate3d;
            let s3dUnit = config.unit.scale3d;

            if (t3d) {  
              let x = t3d.x === 0 ? '0' : `${round(t3d.x, 3)}${t3dUnit}`;
              let y = t3d.y === 0 ? '0' : `${round(t3d.y, 3)}${t3dUnit}`;
              let z = t3d.z === 0 ? '0' : `${round(t3d.z, 3)}${t3dUnit}`;
              t3dCss = `translate3d(${x},${y},${z})`;
            }
            
            if (s3d) {
              let x = s3d.x === 0 ? '0' : `${round(s3d.x, 3)}${s3dUnit}`;
              let y = s3d.y === 0 ? '0' : `${round(s3d.y, 3)}${s3dUnit}`;
              let z = s3d.z === 0 ? '0' : `${round(s3d.z, 3)}${s3dUnit}`;
              s3dCss = `scale3d(${x},${y},${z})`;
            }

            return `${i + frames.length}%{transform: ${t3dCss} ${s3dCss}}\n`;
          });

        frames.push(...mapped);
      });
    this.frames = frames;
  };

  this.addStyleToDOM = function ({frames, animationName}) {
    let styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = `@keyframes ${animationName}{
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
