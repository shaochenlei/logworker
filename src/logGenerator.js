const fs = require('fs')
const path = require('path')
const moment = require('moment')
const logPath = path.resolve(__dirname,'../var/log/httpd')



const getNumberInNormalDistribution = (mean,std_dev) => {
    return mean+(randomNormalDistribution()*std_dev) 
}

const randomNormalDistribution = () => {
    let u=0.0, v=0.0, w=0.0, c=0.0
    do {
        u=Math.random()*2-1.0
        v=Math.random()*2-1.0
        w=u*u+v*v
    } while(w==0.0||w>=1.0)
    c = Math.sqrt((-2*Math.log(w))/w)
    return u*c
}


const gen = (num) => {
    for(let i = 0; i < num; i++) {
        const fileName = moment(new Date()).subtract(i,'days').format('YYYY-MM-DD')+'.log'
        let content = ''
        const lines = 10000
        for(let i = 0; i < lines; i++) {
            const time = moment(new Date()).add(i,'seconds').add(10 * i,'milliseconds').format('YYYY/MM/DD:HH:mm:ss')
            const ip = `10.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
            content += `${ip} [${time}] GET /api/playeritems?playerId=${Math.floor(Math.random() * 10000)} 200 ${Math.floor(getNumberInNormalDistribution(500,200))}\n`
        }
        fs.writeFileSync(path.resolve(logPath, fileName),content,(err) => {
            if(err) {
                console.log('failed to write to log', err)
            }
        })
    }
    console.log(`write to ${num} logs successfully`)
}

gen(30)