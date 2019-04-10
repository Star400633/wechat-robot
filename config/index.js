// 配置文件
module.exports = {
    AUTOADDFRIEND: false,//自动加好友功能  默认关闭
    AUTOADDROOM: false,//自动拉群功能 默认关闭
    YOUDAO: 'http://dict.youdao.com/infoline/style/cardList?style=daily&apiversion=3.0&client=mobile&lastId=0&size=16&preSize=0&keyfrom=mdict.7.8.9.android&model=CLT-AL00&mid=9&imei=869714031552066&vendor=zhihuiyun&screen=1080x2159&ssid=%3Cunknown+ssid%3E&abtest=3', // 有道壹句
    ONE: 'http://wufazhuce.com/',////ONE的web版网站
    MOJI_HOST: 'https://tianqi.moji.com/weather/china/', //墨迹天气url
    CITY: 'zhejiang',//收信者所在城市
    LOCATION: 'gongshu-district',//收信者所在区 （可以访问墨迹天气网站后，查询区的英文拼写）
    MEMORIAL_DAY: '2015/04/18', //你和收信者的纪念日
    NAME: '二维火测试机',//备注姓名
    NICKNAME: '局外人', //昵称
    ROOMNAME: '测试群', //群名称
    SENDDATE: '14 45 0 * * *',//定时发送时间 每天8点0分0秒发送，规则见 /schedule/index.js
    ROOMNAME: '/^啦啦啦咔咔/i', //群名(请只修改中文，不要删除符号，这是正则)
    ADDFRIENDWORD: '/你要触发的关键词/i',//自动加好友触发的关键词(请只修改中文，不要删除符号，这是正则)
    ADDROOMWORD: '/加群/',//自动发送群图片触发关键词(请只修改中文，不要删除符号，这是正则)
    ROOMCODEURL: 'http://image.bloggeng.com/qun.png',//群二维码url链接(与本地群二维码路径选填一个)
    ROOMLOCALPATH: './static/qun.png',//本地群二维码图片路径（与群url选填一个）
}
