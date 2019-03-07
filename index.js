/**
 * Wechaty - WeChat Bot SDK for Personal Account, Powered by TypeScript, Docker, and 💖
 *  - https://github.com/chatie/wechaty
 */
const {Wechaty} = require('wechaty')
const bot = new Wechaty()

// 微信扫码
function onScan(qrcode, status) {
    require('qrcode-terminal').generate(qrcode, {small: true})  // show qrcode on console
    
    const qrcodeImageUrl = [
        'https://api.qrserver.com/v1/create-qr-code/?data=',
        encodeURIComponent(qrcode),
    ].join('')
    
    console.log(qrcodeImageUrl)
}

// 登陆微信
function onLogin(user) {
    console.log(`${user} login`)
    setTimeout(async () => {
        await sendMessage()
    }, 5000)
}

// 退出微信
function onLogout(user) {
    console.log(`${user} logout`)
}

// 获取到消息
async function onMessage(msg) {
    console.log(msg.toString())
}

// 发送消息
async function sendMessage() {
    let msg = '没什么话可说~'
    let room = await bot.Room.find({topic: '测试群'})
    try{
        await room.say(msg)
    } catch(e){
        console.log(e)
    }
}

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot.start()
.then(() => console.log('Starter Bot Started.'))
.catch(e => console.error(e))
