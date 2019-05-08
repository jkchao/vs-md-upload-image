import * as gm from 'gm';

import * as path from 'path';

interface GmParams {
  src: string;
  width: number;
  height: number;
  top: number;
  left: number;
}

export function crop({ src, width, height, left, top }: GmParams) {
  gm(src)
    .crop(width, height, left, top)
    .write(src, err => {
      if (!err) {
        console.log('success');
      }
    });
}
