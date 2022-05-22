# picgo-plugin-github_zenqii

customized PicGo Uploader DemoFor Github.

这是一个自定义的 PicGO 的插件 **Demo**。

相对于 PicGO 自带的 github 插件，内置了一个根据日期分文件夹的功能。

## Installation

1. 安装 PicGO；

2. 下载项目源代码；

3. 在 PicGO 中选择 `插件设置` 中 `导入插件`；

   <img src="https://raw.githubusercontent.com/icanflyhigh/PicRepo/main//PicGO/2022/4/1.jpg" alt="1" style="zoom: 33%;" />

4. 选择对应源代码文件夹

   <img src="https://raw.githubusercontent.com/icanflyhigh/PicRepo/main//PicGO/2022/4/2.jpg" alt="2" style="zoom:33%;" />

5. 安装完成后，配置相应参数

   其中，`owner` 是你 github 账号名；`repo` 对应代码仓库； `path` 仓库下存放图片的路径；`token` 你的token，网上有很多教程；`commit` 你在github 上 commit 的名称。

   <img src="https://raw.githubusercontent.com/icanflyhigh/PicRepo/main//PicGO/2022/4/3.jpg" alt="3" style="zoom: 50%;" />

## Usage

仅支持上传

## TODO

* [ ] 支持delete（写了但是有bug）

## Acknowledge

**这个插件为什么如此残破不堪？**

首先这是一个Demo。其次我不会写，在这之前毫无先验，github api，JavaScript，typescript一律不会。原本以为这个挺简单的，随便加几行应该就可以了，没想到那么麻烦。

## Conclusion

从对网络编程一无所知到看到一丝踪迹。

也为像我一样无知的人指明一下道路，如果你也什么都不懂，觉得 PicGO 插件不是有手就行，碰巧看到了这个 repo 想自己试一下，满足自己日常生活的需要，以下是我总结出的几点：

* 阅读 [github api](https://docs.github.com/cn/rest/repos/contents#)；
* 阅读[官方文档](https://picgo.github.io/PicGo-Core-Doc/zh/guide/use-in-node.html#%E5%88%9D%E5%A7%8B%E5%8C%96)；
* 学一点点  JavaScript；
* 在有一定的了解之后，找插件的 repo（包括官方的template，插件，别人插件的repo），依葫芦画瓢快速搞一个。

* 祝你好运

最后感谢这个 [repo](https://github.com/zhanghuid/picgo-plugin-gitee) ，给我提供了模板。

