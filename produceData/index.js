const cp = require('child_process')
const moduleName = `${__dirname}/populateFile.js`
const debug = require('debug')('app:parent')
const f1 = 'file1.csv'
const f2 = 'file2.csv'
const f3 = 'file3.csv' 
const header = 'name,phone,city\n'

const AMOUNT_ITEMS = 100000
async function run() {
    console.log('It\'d take a while! If you wanna see logs try DEBUG=app* on package.json!')
    const files = [f1, f2, f3]
    for (file of files) { 
        const process = cp.fork(moduleName, [])
        process.send({ file, header, amout: AMOUNT_ITEMS });
        process.on('message', msg => debug(msg))
    }
}

run()