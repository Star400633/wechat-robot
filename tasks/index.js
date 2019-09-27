const cheerio = require('cheerio')
const { request } = require('../utils/index')
const config = require('../config/index')

// 获取每日一句
async function getOne() {
    let res = await request(config.YOUDAO, 'GET')
    const content = JSON.parse(res.text)
    const lastDay = content[0]
    
    return lastDay
}

async function getWeather() { //获取墨迹天气
    let url = config.MOJI_HOST + config.CITY + '/' + config.LOCATION
    let res = await request(url, 'GET')
    
    let $ = cheerio.load(res.text)
    let weatherTips = $('.wea_tips em').text()
    const today = $('.forecast .days').first().find('li');
    let todayInfo = {
        weatherTips: weatherTips,
        day: $(today[0]).text().replace(/(^\s*)|(\s*$)/g, ""),
        weatherText: $(today[1]).text().replace(/(^\s*)|(\s*$)/g, ""),
        temp: $(today[2]).text().replace(/(^\s*)|(\s*$)/g, "").replace('° /', ' ~'),
        wind: $(today[3]).find('em').text().replace(/(^\s*)|(\s*$)/g, ""),
        windLevel: $(today[3]).find('b').text().replace(/(^\s*)|(\s*$)/g, ""),
        pollutionLevel: $(today[4]).find('strong').text().replace(/(^\s*)|(\s*$)/g, "")
    }
    return todayInfo
}


// 企业微信发送信息
async function sendWechatMessage() {
  let weather = await getWeather() //获取天气信息
  const { weatherText, temp, wind, windLevel, pollutionLevel, weatherTips } = weather
  const tips = `今日${weatherText}，气温${temp}，${wind}${windLevel}，空气质量：${pollutionLevel}，${weatherTips}`
  const data = {
    msgtype: 'text',
    text: {
      content: tips
    }
  }
  console.log('====tips', tips)
  await request(config.WEB_HOOK, 'POST', {}, data)
}


module.exports = {
    getOne,
    getWeather,
    sendWechatMessage,
}
