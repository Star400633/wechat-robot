// 配置文件
module.exports = {
    YOUDAO: 'http://dict.youdao.com/infoline/style/cardList?style=daily&apiversion=3.0&client=mobile&lastId=0&size=16&preSize=0&keyfrom=mdict.7.8.9.android&model=CLT-AL00&mid=9&imei=869714031552066&vendor=zhihuiyun&screen=1080x2159&ssid=%3Cunknown+ssid%3E&abtest=3', // 有道壹句
    MOJI_HOST: 'https://tianqi.moji.com/weather/china/', //墨迹天气url
    CITY: 'zhejiang',//收信者所在城市
    LOCATION: 'gongshu-district',//收信者所在区 （可以访问墨迹天气网站后，查询区的英文拼写）
    NICKNAME_LIST: ['W _cloudy明月🍓'], // 昵称列表
    ROOMNAME: ['Bug四大侠'], //群名称
    SENDDATE: '0 0 8 * * *',//定时发送时间 每天8点15分30秒发送，规则见 /schedule/index.js
    HEARTBEAT: '0 0 * * * *', // 心跳 每个整点
}
