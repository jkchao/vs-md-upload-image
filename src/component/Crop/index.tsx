import * as React from 'react';
import './index.scss';

interface State {
  isActive: boolean;
  style: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
}

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export class Crop extends React.PureComponent<{}, State> {
  sectionRef: HTMLDivElement | null = null;
  containerRef: HTMLDivElement | null = null;
  imageRef: HTMLImageElement | null = null;

  state = {
    isActive: false,
    style: {
      top: '100px',
      left: '100px',
      width: '200px',
      height: '200px'
    }
  };

  corpData = {
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    imageWidth: 0,
    imageHeight: 0,
    cropWidth: 0,
    cropHeight: 0
  };

  componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('mouseup', this.onMouseUp, false);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  getPos = (e: MouseEvent) => {
    const { pageX, pageY } = e;
    const {
      offsetX, startX, offsetY, startY,
      imageWidth, imageHeight, cropWidth, cropHeight
     } = this.corpData;

    const diffY = pageY - startY;
    const diffX = pageX - startX;

    return {
      top: clamp(offsetY + diffY, 0, imageHeight - cropHeight),
      left: clamp(offsetX + diffX, 0, imageWidth - cropWidth)
    };
  }

  onMouseMove = (e: MouseEvent) => {

    e.preventDefault();

    if(!this.state.isActive) return;

    const { top, left } = this.getPos(e);

    this.setState({
      style: {
        width: '200px',
        height: '200px',
        top: top + 'px',
        left: left + 'px'
      }
    });
  }

  onMouseUp = (e: MouseEvent) => {
    e.preventDefault();

    this.setState({
      isActive: false
    });
  }

  onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

    // if (e.target !== this.imageRef) return;

    e.preventDefault();

    const {
      width: imageWidth,
      height: imageHeight,
      left: imageLeft,
      top: imageTop
    } = this.imageRef!.getBoundingClientRect();

    const {
      top,
      left,
      width: cropWidth,
      height: cropHeight
    } = this.sectionRef!.getBoundingClientRect();

    this.corpData = {
      startX: e.pageX,
      startY: e.pageY,
      offsetX: left - imageLeft,
      offsetY: top - imageTop,
      imageWidth,
      imageHeight,
      cropWidth,
      cropHeight
    };

    this.setState({
      isActive: true
    });
  }

  public render() {

    const { style } = this.state;

    return (
      <div
        className="container"
        ref={n => this.containerRef = n}>
        <img
          src="https://static.jkchao.cn/TypeScript.png"
          ref={n => this.imageRef = n}/>
        <div
          className="selection"
          onMouseDown={this.onMouseDown}
          ref={n => this.sectionRef = n}
          style={style}>
          <div className="elements">
            <div className="handle nw"></div>
            <div className="handle ne"></div>
            <div className="handle se"></div>
            <div className="handle sw"></div>
          </div>
        </div>
      </div>
    );
  }
}
