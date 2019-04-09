const gm = require('gm')

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
    
    context.font = `${size}px Arial`
    context.fillStyle = color
    context.textAlign = position
    
    for (let n = 0; n < arrText.length; n++) {
        let testLine = line + arrText[n]
        let metrics = context.measureText(testLine)
        let testWidth = metrics.width
        if (testWidth > maxWidth-x && n > 0 && position === 'left') {
            context.fillText(line, x, y)
            line = arrText[n]
            y += lineHeight
        } else {
            line = testLine
        }
    }
    
    context.fillText(line, x, y)
}

module.exports = {
    textWrap
}
