const fs = require('fs')
const path = require('path')
const moment = require('moment')
const logPath = path.resolve(__dirname,'../var/log/httpd')
const _today = moment(new Date())
const gen = (num) => {
    for(let i = 0; i < num; i++) {
        const fileName = _today.subtract(i,'days').format('YYYY-MM-DD')+'.log'
        let content = ''
        const lines = Math.floor(Math.random() * 1000 + 300)
        for(let i = 0; i < lines; i++) {
            const time = _today.add(i,'seconds').add(10 * i,'milliseconds').format('YYYY/MM/DD:HH:mm:ss')
            const ip = `10.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
            content += `${ip} [${time}] GET /api/playeritems?playerId=${Math.floor(Math.random() * 10000)} 200 ${Math.floor(Math.random() * 10000)}\n`
        }
        fs.writeFileSync(path.resolve(logPath, fileName),content,(err) => {
            if(err) {
                console.log('failed to write to log', err)
            }
        })
    }
    console.log('write to logs successfully')
}


gen(100)