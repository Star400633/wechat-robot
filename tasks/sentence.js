// 获取每日一句
const superagent = require('../utils/superagent')
const config = require('../config')
const cheerio = require('cheerio')

async function getOne() {
    let res = await superagent.req(config.ONE, 'GET')
    let $ = cheerio.load(res.text)
    let todayOneList = $('#carousel-one .carousel-inner .item')
    let todayOne = $(todayOneList[0]).find('.fp-one-cita').text().replace(/(^\s*)|(\s*$)/g, "")
    return todayOne
}

module.exports = getOne
