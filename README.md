## Vue 3 + Typescript + Tauri + Vite + Android + ( ...args )

### 基本模板

```
只适配 Android 其他暂不考虑
```

```
用真机调试
1：tauri.conf.json 的 devUrl 改成你本地的
2：打包 需要自己弄签名 在 src-tauri/android 创建 key.properties 文件 写入如下 ( 替换成你自己的 )

-----
storePassword=Together
keyPassword=Together
keyAlias=upload
storeFile=C:\\Users\\admin\\upload-keystore.jks
-----

```

```
开发命令在这备注下
开发：先 npx tauri android init 在 npx tauri android dev ( init 只需只开始创建项目是运行一次即可 )
打包：我只用 arm64 的 所以用 npx tauri android build --target aarch64
```
