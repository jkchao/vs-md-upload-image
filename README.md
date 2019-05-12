# vs-md-upload-image

在 VSCode 中写 .md 时，上传图片至七牛云的插件，支持上传前对图片裁剪，旋转等操作。

## Features

- .md 文件中选择图片上传至七牛云
- 上传前裁剪
- 旋转（未完成）
- 支持压缩后上传（未完成）
- 支持拖拽上传（未完成）
- 其他一些没想到的

## Extension Settings

| Setting      | type   | default | Required | desc                                                          |
| ------------ | ------ | ------- | -------- | ------------------------------------------------------------- |
| qiniu.bucket | string | ""      | true     | bucket name                                                   |
| qiniu.ak     | string | ""      | true     | access key                                                    |
| qiniu.sk     | string | ""      | true     | security key                                                  |
| qiniu.prefix | string | ""      | false    | 路径前缀可以用来分类文件，例如： image/jpg/your-file-name.jpg |
| qiniu.domain | string | ""      | true     | 外链域名                                                      |

## Screenshot

![image](./screenshot/upload.gif)

## Notice

此插件是新开一个 paner 来进行图片的操作，因此受限于 VSCode 暴露的 API 限制（[如不能通过 API 来切换到指定的 paner](https://github.com/Microsoft/vscode/issues/15178)），当你在操作图片时切换到另一个 paner，此 paner 将会关闭（）。
