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

module.exports = {
    getOne,
    getWeather
}