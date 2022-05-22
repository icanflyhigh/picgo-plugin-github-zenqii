const uploadedName = "github_zenqii";
const domain = "https://raw.githubusercontent.com";
const GithubUrl = 'https://api.github.com/repos'
const urlParser = require("url");
const defaultMsg = "picgo commit";
const userName =  

module.exports = (ctx) => {
  const register = () => {
    ctx.helper.uploader.register(uploadedName, {
      handle,
      name: "github自定义图床",
      config: config,
    });

    ctx.on("remove", onRemove);
  };



  const getUserConfig = function () {
    let userConfig = ctx.getConfig("picBed." + uploadedName);

    if (!userConfig) {
      throw new Error("Can't find uploader config");
    }
    // ctx.log.info("Config ok");
    // https://api.github.com/repos/icanflyhigh/PicRepo
    userConfig["baseUrl"] =
      GithubUrl + "/" + userConfig.owner + "/" + userConfig.repo + "/contents";
    userConfig["previewUrl"] =
      domain +
      "/" +
      userConfig.owner +
      "/" +
      userConfig.repo +
      "/main/" +
      formatConfigPath(userConfig);

    userConfig["message"] = userConfig.message || defaultMsg;

    return userConfig;
  };

  const getHeaders = function () {
    let userConfig = getUserConfig();
    const token = userConfig.token;
    return {
      // "Content-Type": "application/json;charset=UTF-8",
      Authorization: `token ${token}`,
      'User-Agent': 'PicGo'
    };
  };


  // uploader
  const handle = async function (ctx) {
    // ctx.log.info("图像上传中...");
    let userConfig = getUserConfig();

    const realUrl =
      userConfig.baseUrl + formatConfigPath(userConfig);

    let imgList = ctx.output;
    for (let i in imgList) {
      let image = imgList[i].buffer;
      if (!image && imgList[i].base64Image) {
        image = Buffer.from(imgList[i].base64Image, "base64");
      }

      let perRealUrl = realUrl + "/" + imgList[i].fileName;
      const postConfig = postOptions(perRealUrl, image);

      try {
        await ctx.Request.request(postConfig);
        imgList[i]["imgUrl"] =
          userConfig.previewUrl + "/" + imgList[i].fileName;
      } catch (err) {
        ctx.log.info("[上传操作]异常：" + err.message);
        // duplicate file, so continue
        if (checkIsDuplicateFile(err.message)) {
          ctx.emit("notification", {
            title: "上传失败",
            body: "文件已经存在了",
          });
          continue;
        } else {
          ctx.emit("notification", {
            title: "上传失败",
            body: JSON.stringify(err),
          });
        }
      }

      delete imgList[i].base64Image;
      delete imgList[i].buffer;
    }

    return ctx;
  };

  const checkIsDuplicateFile = (message) => {
    return message.indexOf("A file with this name already exists") != -1;
  };

  const postOptions = (url, image) => {
    let config = getUserConfig();
    let headers = getHeaders();
    let formData = {
      branch: 'main',
      content: image.toString("base64"),
      message: config.message || defaultMsg,
    };
    const opts = {
      method: "PUT",
      url: encodeURI(url),
      headers: headers,
      body: formData,
      json: true
    };
    return opts;
  };

  // trigger delete file
  const onRemove = async function (files) {
    // log request params
    const rms = files.filter((each) => each.type === uploadedName);
    if (rms.length === 0) {
      return;
    }

    ctx.log.info("删除个数:" + rms.length);
    ctx.log.info("uploaded 信息:");
    let headers = getHeaders();
    let config = getUserConfig();
    const fail = [];

    for (let i = 0; i < rms.length; i++) {
      const each = rms[i];
      let filepath = getFilePath(each.imgUrl);
      let sha = await getSha(filepath).catch((err) => {
        ctx.log.info("[删除操作]获取sha值：" + JSON.stringify(err));
      });

      let url = `${filepath}`;
      ctx.log.info("[删除操作]当前删除地址：" + url);
      formData = {
        branch: 'main',
        message: config.message || defaultMsg,
        sha: `${sha}`,
      }
      let opts = {
        method: "DELETE",
        url: encodeURI(url),
        headers: headers,
        body: formData,
      };
      ctx.log.info("[删除操作]当前参数" + JSON.stringify(opts));
      // log request params
      response = await ctx.request(opts);
      ctx.log.info(response);
    }

    ctx.emit("notification", {
      title: "删除提示",
      body: fail.length === 0 ? "成功同步删除" : `删除失败${fail.length}个`,
    });
  };

  const getFilePath = function (url) {
  // https://raw.githubusercontent.com/icanflyhigh/PicRepo/main/PicGO/test.jpg
  // https://api.github.com/icanflyhigh/PicRepo/content/PicGO/test.jpg
    let userConfig = getUserConfig()
    let urlStr = url.replace(userConfig.realUrl + '/main', userConfig.baseUrl);
    return urlStr
  };

  const getSha = async function (filepath) {
    let config = getUserConfig();
    let headers = getHeaders();
    let url = `${filepath}`;

    const opts = {
      method: "GET",
      url: encodeURI(url),
      headers: headers,
    };

    let res = await ctx.Request.request(opts);
    let tmp = JSON.parse(res);

    return tmp.sha;
  };

  const formatConfigPath = function (userConfig) {
    var nowDate = new Date();
    const MM = nowDate.getMonth() + 1;
    const YY = nowDate.getFullYear();
    return (userConfig.path ?  "/" + userConfig.path  : "") + "/" + YY +  "/"+ MM;
  };

  const config = (ctx) => {
    let userConfig = ctx.getConfig("picBed" + uploadedName);
    if (!userConfig) {
      userConfig = {};
    }
    return [
      // {
      //   name: 'url',
      //   type: 'input',
      //   default: userConfig.url,
      //   required: true,
      //   message: 'https://gitee.com',
      //   alias: 'url'
      // },
      {
        name: "owner",
        type: "input",
        default: userConfig.owner,
        required: true,
        message: "owner",
        alias: "owner",
      },
      {
        name: "repo",
        type: "input",
        default: userConfig.repo,
        required: true,
        message: "repo",
        alias: "repo",
      },
      {
        name: "path",
        type: "input",
        default: userConfig.path,
        required: false,
        message: "path;根目录可不用填",
        alias: "path",
      },
      {
        name: "token",
        type: "input",
        default: userConfig.token,
        required: true,
        message: "your token",
        alias: "token",
      },
      {
        name: "message",
        type: "input",
        default: userConfig.message,
        required: false,
        message: defaultMsg,
        alias: "message",
      },
    ];
  };
  return {
    uploader: "github_zenqii",
    register,
  };
};
