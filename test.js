
const {FileBox} = require('file-box') //文件读取模块
const moment = require('moment')
const gm = require('gm')
const fs = require('fs')
const utils = require('./utils')
const tasks = require('./tasks')

const {createCanvas, loadImage} = require('canvas')
const canvas = createCanvas(670, 1192)
const ctx = canvas.getContext('2d')

// 自动发消息功能
async function main() {
    console.log('开始工作~')
    
    let one = await tasks.getOne() //获取每日一句
    let weather = await tasks.getWeather() //获取天气信息
    const { source, title, summary, image } = one
    const { weatherText, temp, } = weather
    const fileName = `./static/${moment().format('YYYY_MM_DD_hh_mm_ss')}.jpg`
    
    loadImage(image[0]).then((resolve) => {
        ctx.drawImage(resolve, 0, 0, 670, 1192)
    
        utils.textWrap(ctx, moment().format('D'), 490, 200, 128) // 本月几号
        utils.textWrap(ctx, `${moment().format('MMM')} / ${moment().format('YYYY')}`, 510, 260, 28) // 本月几号
        utils.textWrap(ctx, title, 40, 880, 42) // 英文
        utils.textWrap(ctx, summary, 40, 1020, 22) // 中文
        utils.textWrap(ctx, `#${source}`, 40, 1100, 20) // 出处
        utils.textWrap(ctx, `${utils.getWeekDay()} | ${weatherText} | ${temp}`, 630, 1150, 24, 'right') // 天气
    
        let imgData = canvas.toDataURL()
        let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "")
        let dataBuffer = Buffer.from(base64Data, 'base64')
        
        fs.writeFileSync(fileName, dataBuffer)
        return Promise.resolve(true)
    }).then(async (resolve) => {
        try {
            const resultimg = `./static/${Date.now()}.jpg`
            gm(fileName)
            .resize(670, 1192)
            .quality(100)
            .write(resultimg, async (err) => {
                if (err) console.log('error')
                
                let logMsg = FileBox.fromFile(resultimg)
                if(logMsg) {
                    console.log('发送成功~', logMsg)
                } else {
                    console.log('error')
                }
            })
            
            
        } catch (e) {
            console.log('message===', e.message)
        }
    })
}

main()
