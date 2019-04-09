## wechatBot
微信每日说，每日自动发送微信消息给爱人

## 项目介绍

### 使用库
* [wechaty](https://github.com/Chatie/wechaty) - 微信操作
* [node-schedule](https://github.com/node-schedule/node-schedule) - 定时任务
* [superagent](https://github.com/visionmedia/superagent) - 爬取页面信息
* [cheerio](https://github.com/cheeriojs/cheerio#readme) - 抓取页面
* [qrcode-terminal](https://github.com/gtanner/qrcode-terminal) - 终端显示二维码
### 功能
* 定时给朋友发送每日天气提醒以及每日一句
* 根据关键词自动加好友和自动拉群功能
* 后续继续扩展吧...(你有好的想法也可以提pr)

### 数据来源
* 每日一句和上面的大佬一样也是来自[one](http://wufazhuce.com/)
* 天气信息来自[墨迹天气](https://tianqi.moji.com/weather)

### 定时任务
[node-schedule](https://github.com/node-schedule/node-schedule)非你莫属了，
可以定时每个月、每个礼拜、每天具体什么时候执行什么任务

### 实现效果
由于是微信定时发送消息，较邮件来说，微信无法把图片和文字放在同一消息框中，所以美观度来说可能没有邮件好，不过文字进行排版后还是可以的，由于时间仓促，所以文字比较少，后续会继续增加内容；

![](https://user-gold-cdn.xitu.io/2019/2/28/16933e1817ce89f7?w=1136&h=702&f=png&s=157566)

![](https://user-gold-cdn.xitu.io/2019/2/28/16933e04e55a70c3?w=982&h=432&f=png&s=79574)


## 项目运行

由于需要安装chromium, 所以要先配置一下镜像

npm

    npm config set registry https://registry.npm.taobao.org
    npm config set disturl https://npm.taobao.org/dist
    npm config set puppeteer_download_host https://npm.taobao.org/mirrors
yarn

    yarn config set registry https://registry.npm.taobao.org
    yarn config set disturl https://npm.taobao.org/dist
    yarn config set puppeteer_download_host https://npm.taobao.org/mirrors
然后进行项目安装

    git clone git@github.com:gengchen528/wechatBot.git
    cd wechatBot
    npm install 或 cnpm install

参数配置

wechatBot/config/index.js

    // 配置文件
    module.exports ={
      ONE:'http://wufazhuce.com/',////ONE的web版网站
      MOJI_HOST:'https://tianqi.moji.com/weather/china/', //中国墨迹天气url
      CITY:'shanghai',//收信者所在城市
      LOCATION:'pudong-new-district',//收信者所在区 （可以访问墨迹天气网站后，查询区的英文拼写）
      MEMORIAL_DAY:'2015/04/18', //你和收信者的纪念日
      NAME:'Baixiangguo',//备注姓名
      NICKNAME:'Leo_chen', //昵称
      SENDDATE:'30 15 8 * * *',//定时发送时间 每天8点15分30秒发送，规则见 /schedule/index.js
      ROOMNAME:'/^微信每日说/i', //群名(请只修改中文，不要删除符号，这是正则)
      ADDFRIENDWORD:'/微信每日说/i',//自动加好友触发的关键词(请只修改中文，不要删除符号，这是正则)
      ADDROOMWORD:'/加群/',//自动发送群图片触发关键词(请只修改中文，不要删除符号，这是正则)
      ROOMCODEURL:'http://image.bloggeng.com/qun.png',//群二维码url链接(与本地群二维码路径选填一个)
      ROOMLOCALPATH:'./static/qun.png',//本地群二维码图片路径（与群url选填一个）
    }

开始运行

    npm run start
    然后掏出你的手机，最好使用小号，扫描控制台的二维码即可

## 待解决问题

* 由于微信登录和邮件登录不同，所以无法使用进程守护工具，目前没有测试是否能够长时间登录
* 因为node的原因，如果发生错误，可能会导致任务无法进行，需要手动重启并登录
* 最好能够使用小号登录，如果是常用微信登录，在电脑客户端登陆后可能会wechaty挤掉
* 墨迹天气页面在获取的时候可能会存在延时，有时可能获取不到
