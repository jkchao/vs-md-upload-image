import * as gm from 'gm';

interface GmParams {
  src: string;
  width: string;
  height: string;
  top: string;
  left: string;
}

export function crop({ src, width, height, left, top }: GmParams) {
  gm(src)
    .crop(parseInt(width, 10), parseInt(height, 10), parseInt(left, 10), parseInt(top, 10))
    .write('/test.jpg', err => {
      if (!err) console.log('success');
      else console.error('err:' + err);
    });
}
