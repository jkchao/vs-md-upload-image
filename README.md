# vs-md-upload-image

在 VSCode 中写 .md 时，上传图片至七牛云的插件，支持上传前对图片裁剪，旋转等操作。

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
