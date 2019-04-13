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
bot.on('message', onMessage)
bot.on('friendship', onFriendShip)
bot.on('room-join', roomJoin)

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
    }
}

// 自动发消息功能
async function main() {
    console.log('开始工作~')
    let contact = await bot.Contact.find({name: config.NICKNAME}) || await bot.Contact.find({alias: config.NAME}) // 获取你要发送的联系人
    
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
                
                let logMsg = FileBox.fromFile(resultimg)
                
                if(logMsg) {
                    await contact.say(logMsg) // 发送消息
                    fs.unlinkSync(fileName)
                    console.log('发送成功~')
                } else {
                    console.log('error', logMsg)
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

// 监听对话 根据关键词自动加群
async function onMessage(msg) {
    const contact = msg.from() // 发消息人
    const content = msg.text() //消息内容
    const room = msg.room() //是否是群消息
    const roomCodeUrl = FileBox.fromUrl(config.ROOMCODEURL) //来自url的文件
    const roomCodeLocal = FileBox.fromFile(config.ROOMLOCALPATH) //添加本地文件
    if(msg.self()) {
        return
    }
    if(room) { // 如果是群消息
        const topic = await room.topic()
        // console.log(`群名: ${topic} 发消息人: ${contact.name()} 内容: ${content}`)
    } else { // 如果非群消息
        // console.log(`发消息人: ${contact.name()} 消息内容: ${content}`)
        if(config.AUTOADDROOM) { //判断是否开启自动加群功能
            let addRoomReg = eval(config.ADDROOMWORD)
            let roomReg = eval(config.ROOMNAME)
            if(addRoomReg.test(content) && !room) {
                let keyRoom = await this.Room.find({topic: roomReg})
                if(keyRoom) {
                    try {
                        await contact.say(roomCodeLocal || roomCodeUrl)
                    } catch (e) {
                        console.error(e)
                    }
                }
            } else {
                await contact.say('你好，不要轻易调戏我，我只会发群二维码，不会聊天的！')
                await contact.say('请回复暗号：加群  获取群二维码图片')
            }
        }
    }
}

// 自动加好友功能
async function onFriendShip(friendship) {
    let logMsg
    try {
        logMsg = '添加好友' + friendship.contact().name()
        console.log(logMsg)
        
        switch (friendship.type()) {
            /**
             *
             * 1. New Friend Request
             *
             * when request is set, we can get verify message from `request.hello`,
             * and accept this request by `request.accept()`
             */
            case Friendship.Type.Receive:
                let addFriendReg = eval(config.ADDFRIENDWORD)
                if(addFriendReg.test(friendship.hello()) && config.AUTOADDFRIEND) { //判断是否开启自动加好友功能
                    logMsg = '自动添加好友，因为验证信息中带关键字‘每日说’'
                    await friendship.accept()
                } else {
                    logMsg = '没有通过验证 ' + friendship.hello()
                }
                break
            /**
             *
             * 2. Friend Ship Confirmed
             *
             */
            case Friendship.Type.Confirm:
                logMsg = 'friend ship confirmed with ' + friendship.contact().name()
                break
        }
    } catch (e) {
        logMsg = e.message
    }
    console.log(logMsg)
}


// 加群提醒
function roomJoin(room, inviteeList, inviter) {
    const nameList = inviteeList.map(c => c.name()).join(',')
    room.topic().then(function(res) {
        const roomNameReg = eval(config.ROOMNAME)
        if(roomNameReg.test(res)) {
            console.log(`群名： ${res} ，加入新成员： ${nameList}, 邀请人： ${inviter}`)
            room.say(`${res}：欢迎新朋友 @${nameList}，<br>使用过程中有什么问题都可以在群里提出`)
        }
    })
}