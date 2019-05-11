import * as React from 'react';
import './index.scss';

interface State {
  isActive: boolean;
  src: string;
  style: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
}

declare const acquireVsCodeApi: () => any;

interface CropData {
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;

  cropWidth: number;
  cropHeight: number;
  cropLeft: number;
  cropTop: number;
  isResize: boolean | 'nw' | 'ne' | 'se' | 'sw';
  imageData: {
    imageWidth: number;
    imageHeight: number;
    imageLeft: number;
    imageTop: number;
  };
}

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export class Crop extends React.PureComponent<{}, State> {
  sectionRef: HTMLDivElement | null = null;
  containerRef: HTMLDivElement | null = null;
  imageRef: HTMLImageElement | null = null;

  vscode: any;

  corpData: CropData = {
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,

    cropWidth: 100,
    cropHeight: 100,
    cropLeft: 0,
    cropTop: 0,

    isResize: false,
    imageData: {
      imageWidth: 0,
      imageHeight: 0,
      imageLeft: 0,
      imageTop: 0
    }
  };

  constructor(props: {}) {
    super(props);

    this.state = {
      isActive: false,
      src: 'https://static.jkchao.cn/TypeScript.png',
      style: {
        top: '0',
        left: '0',
        width: '100px',
        height: '100px'
      }
    };

    this.initVSCode();
  }

  initVSCode() {
    try {
      this.vscode = acquireVsCodeApi();
    } catch (error) {
      this.vscode = null;
    }
  }

  componentDidMount() {
    // vscode message
    window.addEventListener('message', this.onMessage, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('mouseup', this.onMouseUp, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  onMessage = (e: MessageEvent) => {
    const message = e.data;

    switch(message.command) {
      case 'image':
        this.setState({
          src: message.data
        });
        break;
    }
  }

  getPos = (e: MouseEvent) => {
    const { pageX, pageY } = e;
    const {
      offsetX, startX, offsetY, startY,
      imageData: { imageWidth, imageHeight },
      cropWidth, cropHeight
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

    // 调整大小
    if (this.corpData.isResize) {
      const {
        imageData: { imageLeft, imageTop, imageWidth, imageHeight },
        offsetX, offsetY,
        isResize,
        cropWidth,
        cropHeight
      } = this.corpData;

      let { startX, startY } = this.corpData;


      const { pageX, pageY } = e;

      const diffx = pageX - startX;
      const diffy = pageY - startY;

      let width = Math.abs(cropWidth + diffx);
      let height = Math.abs(cropHeight + diffy);

      const xInversed = isResize === 'nw' || isResize === 'sw';
      const yInversed = isResize === 'nw' || isResize === 'ne';

      if (xInversed) {
        width = Math.abs(cropWidth - diffx);
        startX = startX + cropWidth;
      }

      if (yInversed) {
        height = Math.abs(cropHeight - diffy);
        startY = startY + cropHeight;
      }

      if (isResize === 'se' || isResize === 'sw') {
        startY = startY - cropHeight;
      }

      if (isResize === 'ne' || isResize === 'se') {
        startX = startX - cropWidth;

      }

      let top = startY - imageTop;
      let left = startX - imageLeft;

      if(pageY < startY) {
        top = pageY - imageTop;
      }

      if (pageX < startX) {
        left = pageX - imageLeft;
      }

      if (left < 0) {
        width = startX - imageLeft;
        left = 0;
      } else if (offsetX > 0 && width + offsetX > imageWidth) {
        width = imageWidth - offsetX - 1;
      }

      if (top < 0) {
        height = startY - imageTop;
        top = 0;
      } else if (offsetY > 0 && height + offsetY > imageHeight) {
        height = imageHeight - offsetY - 1;
      }

      this.setState({
        style: {
          width: width + 'px',
          height: height + 'px',
          top: top + 'px',
          left: left + 'px'
        }
      });

    } else {
      // 只有拖拽移动
      const { top, left } = this.getPos(e);
      this.setState({
        style: {
          ...this.state.style,
          top: top + 'px',
          left: left + 'px'
        }
      });
    }
  }

  onMouseUp = (e: MouseEvent) => {
    e.preventDefault();

    this.setState({
      isActive: false
    });
  }

  onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

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
      imageData: {
        imageLeft,
        imageTop,
        imageWidth,
        imageHeight
      },
      cropWidth,
      cropHeight,
      cropLeft: left,
      cropTop: top,
      // @ts-ignore
      isResize: e.target!.dataset.ord || false
    };

    this.setState({
      isActive: true
    });
  }

  containerMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

    if (e.target !== this.imageRef) return;

    e.preventDefault();

    const {
      width: imageWidth,
      height: imageHeight,
      left: imageLeft,
      top: imageTop
    } = this.imageRef!.getBoundingClientRect();

    this.corpData = {
      startX: e.pageX,
      startY: e.pageY,
      offsetX: e.pageX - imageLeft,
      offsetY: e.pageY - imageTop,
      imageData: {
        imageLeft,
        imageTop,
        imageWidth,
        imageHeight
      },
      cropWidth: 0,
      cropHeight: 0,
      cropLeft: 0,
      cropTop: 0,
      isResize: true
    };

    this.setState({
      isActive: true
    });
  }

  cancel = () => {
    // e.stopPropagation();
    this.reset();
  }

  submit = () => {

    const image = this.imageRef!;
    const scaleX = image.width / image.naturalWidth ;
    const scaleY = image.height / image.naturalHeight;

    const { style } = this.state;

    const width = this.corpData.cropWidth / scaleX;
    const height = this.corpData.cropHeight / scaleY;

    const top = parseInt(style.top, 10) / scaleY;
    const left = parseInt(style.left, 10) / scaleX;

    if(this.vscode) {
      this.vscode.postMessage({
        command: 'complete',
        data: {
          width,
          height,
          left,
          top
        }
      });
    }

    console.log({width, height, top, left});
  }

  reset = () => {
    this.corpData = {
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,

      cropWidth: 0,
      cropHeight: 0,
      cropLeft: 0,
      cropTop: 0,

      isResize: false,
      imageData: {
        imageWidth: 0,
        imageHeight: 0,
        imageLeft: 0,
        imageTop: 0
      }
    };

    this.setState({
      style: {
        top: '0',
        left: '0',
        width: '0',
        height: '0'
      }
    });
  }

  public render() {

    const { style, src } = this.state;

    // const { cropWidth, cropHeight } = this.corpData;

    const width = parseInt(style.width, 10);
    const height = parseInt(style.height, 10);

    return (
      <div
        className="container"
        ref={n => this.containerRef = n}
        onMouseDown={this.containerMouseDown}>
        <img
          src={src}
          ref={n => this.imageRef = n}
          alt="crop"/>
        {width && height && (<div
          className="selection"
          onMouseDown={this.onMouseDown}
          ref={n => this.sectionRef = n}
          style={style}>
          <div className="elements">
            <div className="handle nw" data-ord="nw"></div>
            <div className="handle ne" data-ord="ne"></div>
            <div className="handle se" data-ord="se"></div>
            <div className="handle sw" data-ord="sw"></div>
          </div>
          <div className="btn">
            <a href="javascript:;" className="cancel" onClick={this.cancel}></a>
            <a href="javascript:;" className="submit" onClick={this.submit}></a>
          </div>
        </div>) || null}
      </div>
    );
  }
}
