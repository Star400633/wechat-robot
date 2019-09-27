const superagent = require('superagent')

/**
 * canvas支持文字换行
 * @param ctx canvas上下文
 * @param text 绘制文字
 * @param color
 */
function textWrap(context, text='', x=0, y=0, size=20, position='left', color="white", maxWidth=670, lineHeight=size+10) {
    if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
        console.log("text || x || y 传值不正确！")
        return
    }
    
    // 字符分隔为数组
    let arrText = text.split('')
    let line = ''
    
    context.font = `${size}px Microsoft YaHei`
    context.fillStyle = color
    context.textAlign = position
    
    for (let n = 0; n < arrText.length; n++) {
        let testLine = line + arrText[n]
        let metrics = context.measureText(testLine)
        let testWidth = metrics.width
        if (testWidth > maxWidth-(x+30) && n > 0 && position === 'left') {
            context.fillText(line, x, y)
            line = arrText[n]
            y += lineHeight
        } else {
            line = testLine
        }
    }
    
    context.fillText(line, x, y)
    return line
}

//请求
function request(url, method, params, data, cookies) {
    let contentType = ''
    if(method === 'GET') {
        contentType = 'application/x-www-form-urlencoded'
    } else if(method === 'POST') {
        contentType = 'application/json'
    }
    return new Promise(function(resolve, reject) {
        superagent(method, url)
        .set('Content-Type', contentType)
        .send(data)
        .end(function(err, response) {
            if(err) {
                reject(err)
            }
            console.log('====method, url', response)
            resolve(response)
        })
    })
}

// 获取星期几
function getWeekDay() {
    const day = new Date().getDay()
    switch(day) {
        case 0:
            return '周日'
        case 1:
            return '周一'
        case 2:
            return '周二'
        case 3:
            return '周三'
        case 4:
            return '周四'
        case 5:
            return '周五'
        case 6:
            return '周六'
    }
}
module.exports = {
    textWrap,
    request,
    getWeekDay,
}
