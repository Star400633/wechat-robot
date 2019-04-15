/**
 * WechatBot
 *  - https://docs.chatie.io/v/zh/
 */
const {Wechaty, Friendship} = require('wechaty')
const {FileBox} = require('file-box') //文件读取模块
const moment = require('moment')
const gm = require('gm')
const fs = require('fs')
const schedule = require('./schedule')
const config = require('./config')
const utils = require('./utils')
const tasks = require('./tasks')
const bot = new Wechaty({name: 'WechatEveryDay'})

// canvas绘制图片相关
const {createCanvas, loadImage} = require('canvas')
const canvas = createCanvas(670, 1192)
const ctx = canvas.getContext('2d')

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)

bot.start()
.then(() => console.log('开始登陆微信'))
.catch(async e => {
    await bot.stop()
    process.exit(-1)
})

// 登录
async function onLogin(user) {
    console.log(`${user} 登陆成功~`)
    // 登陆后创建定时任务
    if(false) {
        setTimeout(async ()=> {
            await main()
        }, 1000)
    } else {
        schedule.setSchedule(config.SENDDATE, async () => {
            await main()
        })
        schedule.setSchedule(config.HEARTBEAT, () => {
            console.log(`现在是：${new Date()} 心跳正常~`)
        })
    }
}

// 自动发消息功能
async function main() {
    console.log('开始工作~')
    
    let one = await tasks.getOne() //获取每日一句
    let weather = await tasks.getWeather() //获取天气信息
    const { source, title, summary, image } = one
    const { weatherText, temp, } = weather
    const fileName = `./static/${Date.now()}.jpg`
    
    loadImage(image[0]).then((resolve) => {
        ctx.drawImage(resolve, 0, 0, 670, 1192)
    
        utils.textWrap(ctx, moment().format('D'), 490, 200, 128) // 本月几号
        utils.textWrap(ctx, `${moment().format('MMM')} / ${moment().format('YYYY')}`, 490, 260, 28) // 月/年
        utils.textWrap(ctx, title, 40, 880, 42) // 英文
        utils.textWrap(ctx, summary, 40, 1030, 20) // 中文
        utils.textWrap(ctx, `#${source}`, 40, 1100, 20) // 出处
        utils.textWrap(ctx, `${utils.getWeekDay()} | ${weatherText} | ${temp}`, 630, 1150, 20, 'right') // 天气
    
        let imgData = canvas.toDataURL()
        let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "")
        let dataBuffer = Buffer.from(base64Data, 'base64')
    
        fs.writeFileSync(fileName, dataBuffer)
        return Promise.resolve(true)
    }).then(async (resolve) => {
        try {
            const resultimg = `./static/${moment().format('YYYY_MM_DD_HH_mm_ss')}.jpg`
            gm(fileName)
            .resize(670, 1192)
            .quality(100)
            .write(resultimg, async (err) => {
                if (err) console.log('error')
                
                let sendMessage = FileBox.fromFile(resultimg)
                
                if(sendMessage) {
                    // 联系人
                    for(const item of config.NICKNAME_LIST) {
                        let contact = await bot.Contact.find({name: item}) // 获取你要发送的联系人
                        await contact.say(sendMessage) // 发送消息
                    }
                    
                    // 群
                    for(const item of config.ROOMNAME) {
                        let room = await bot.Room.find({topic: item})
                        console.log(room)
                        await room.say(sendMessage)
                    }
    
                    fs.unlinkSync(fileName) // 删除文件
                    
                } else {
                    console.log('error', sendMessage)
                }
            })
            
            
        } catch (e) {
            console.log('message===', e.message)
        }
    })
}

//  二维码生成
function onScan(qrcode, status) {
    require('qrcode-terminal').generate(qrcode)  // 在console端显示二维码
    const qrcodeImageUrl = [
        'https://api.qrserver.com/v1/create-qr-code/?data=',
        encodeURIComponent(qrcode),
    ].join('')
    console.log(qrcodeImageUrl)
}

//登出
function onLogout(user) {
    console.log(`${user} 登出`)
}

