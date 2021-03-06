// 任务初始页
const getWeather = require('../tasks/weather')
const getSentence = require('../tasks/sentence')
const schedule = require('../utils/schedule')
const config = require('../config')

async function main(bot) {
    
    // const contact = await bot.Contact.find({name: config.NICKNAME}) || await bot.Contact.find({alias: config.NAME}) // 获取你要发送的联系人
    let oneSentence = await getSentence() //获取每日一句
    let weather = await getWeather() //获取天气信息
    const str = '<h1>今日天气早知道：<h1><br>' + weather.weatherTips + '<br>' + weather.todayWeather +
              '<br>每日一句:<br>' + oneSentence + '<br>'
    
    try {
        // 给微信群发送消息
        config.ROOMNAME.forEach( async item => {
            let room = await bot.Room.find({topic: item})
            console.log(`${new Date()}: 已经给群 =>${item} 发送消息~`)
            await room.say(str)
        })
    } catch (e) {
        console.log(e)
    }
}

async function starSchedule(bot) {
    schedule.setSchedule(config.SCHEDULE, async () => {
        await main(bot)
    })
    schedule.setSchedule(config.HEARTBEAT, () => {
        console.log(`现在是：${new Date()} 心跳正常~`)
    })
    // setTimeout(async ()=> {
    //     await main(bot)
    // }, 3000)
}

module.exports = starSchedule
