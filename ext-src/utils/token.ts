import { workspace } from 'vscode';
import { QINIU_AK, QINIU_SK, QINIU_BUCKET } from '../constants';
import * as qiniu from 'qiniu';

export function getToken() {
  const config = workspace.getConfiguration('qiniu');
  const ac = config.get<string>(QINIU_AK);
  const sc = config.get<string>(QINIU_SK);

  const bucket = config.get<string>(QINIU_BUCKET);
  const mac = new qiniu.auth.digest.Mac(ac, sc);

  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket
  });
  return putPolicy.uploadToken(mac);
}
