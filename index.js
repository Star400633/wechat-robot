/**
 * Wechaty - 信息机器人
 *  - https://github.com/chatie/wechaty
 */
const { Wechaty } = require('wechaty')
const startSchedule = require('./tasks/index')
const bot = new Wechaty()

// 扫码
function onScan(qrcode, status) {
    require('qrcode-terminal').generate(qrcode, {small: true})  // show qrcode on console
    
    const qrcodeImageUrl = [
        'https://api.qrserver.com/v1/create-qr-code/?data=',
        encodeURIComponent(qrcode),
    ].join('')
    
    console.log(qrcodeImageUrl)
}

// 登陆
async function onLogin(user) {
    console.log(`${user} 已登录`)
    await startSchedule(bot)
}

// 退出
function onLogout(user) {
    console.log(`${user} 已退出登陆`)
}

// 获取到消息
async function onMessage(msg) {
    console.log(msg.toString())
}

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot.start()
.then(() => console.log('微信机器人已启动.'))
.catch(e => console.error(e))
