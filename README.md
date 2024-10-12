## Vue 3 + Typescript + Tauri + Vite + Android + ( ...args )

### 基本模板

```
只适配 Android 其他暂不考虑
```

```
用真机调试
1：最好先把 src-tauri/gen 这个文件夹删除 其中的 build.gradle.kts 这个文件有更改 需撤回
2：tauri.conf.json 的 devUrl 改成你本地的
3：打包 需要自己弄签名 在 src-tauri/gen/android 创建 key.properties 文件 写入如下 ( 替换成你自己的 )

-----
storePassword=Together
keyPassword=Together
keyAlias=upload
storeFile=C:\\Users\\admin\\upload-keystore.jks
-----

```

```
开发命令在这备注下 用管理员身份运行控制台
开发：先 npx tauri android init 在 npx tauri android dev ( init 只需只开始创建项目是运行一次即可 )
打包：我只用 arm64 的 所以用 npx tauri android build --target aarch64
```

```
包安装不下来 网上都有解决方法 不在说明 基本都是手动下载 在放入指定文件夹即可
```
