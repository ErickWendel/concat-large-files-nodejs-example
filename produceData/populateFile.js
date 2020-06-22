const { promises: { appendFile } } = require('fs')
const faker = require('faker')
const { join, resolve } = require('path')
const flagForNotExistentFile = { flag: 'a' }
const debug = require('debug')('app:child')

const populateFile = async ({ file, header, amout }) => {
    const filename = join(__dirname, '../', 'files', file)
    await appendFile(filename, header, flagForNotExistentFile)
    for (let i = 0; i < amout; i++) {
        const data = `${faker.name.findName()},${faker.phone.phoneNumber()},${faker.address.city()}\n`
        debug(`appending: ${data}`)
        await appendFile(filename, data, flagForNotExistentFile)
    } 
}

process.on('message', (m) => {
    const pid = process.pid
    debug(`${pid} got message: ${m}`);
    populateFile(m)
        .then(
            _ => process.send(`${pid} has finished`)
        ).catch(
            error => process.send(`${pid} has crashed: ${error.stack}`)
        ).finally(_ => {
            process.exit(0)
        })

});