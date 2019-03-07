//获取墨迹天气

const superagent = require('../utils/superagent')
const config = require('../config')
const cheerio = require('cheerio')

async function getWeather() {
    let url = config.MOJI_HOST + config.CITY + '/' + config.LOCATION
    let res = await superagent.req(url, 'GET')
    let $ = cheerio.load(res.text)
    let weatherTips = $('.wea_tips em').text()
    const today = $('.forecast .days').first().find('li');
    let todayInfo = {
        Day: $(today[0]).text().replace(/(^\s*)|(\s*$)/g, ""),
        WeatherText: $(today[1]).text().replace(/(^\s*)|(\s*$)/g, ""),
        Temp: $(today[2]).text().replace(/(^\s*)|(\s*$)/g, ""),
        Wind: $(today[3]).find('em').text().replace(/(^\s*)|(\s*$)/g, ""),
        WindLevel: $(today[3]).find('b').text().replace(/(^\s*)|(\s*$)/g, ""),
        PollutionLevel: $(today[4]).find('strong').text().replace(/(^\s*)|(\s*$)/g, "")
    }
    let obj = {
        weatherTips: weatherTips,
        todayWeather: todayInfo.Day + ':' + todayInfo.WeatherText + '<br>' + '温度:' + todayInfo.Temp + '<br>'
            + todayInfo.Wind + todayInfo.WindLevel + '<br>' + '空气:' + todayInfo.PollutionLevel + '<br>'
    }
    return obj
}

module.exports = getWeather
