// 企业微信机器人 发送天气
const schedule = require('./schedule')
const config = require('./config')
const tasks = require('./tasks')


schedule.setSchedule(config.WECHAT_WEATHER, async () => {
  await tasks.sendWechatMessage()
})
