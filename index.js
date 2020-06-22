const { Transform } = require('stream');
const { join } = require('path');
const { pipeline } = require('stream')
const { promisify } = require('util')
const pipelineAsync = promisify(pipeline)
const debug = require('debug')('app:concat')

const StreamConcat = require('stream-concat');
const csvtojson = require('csvtojson')
const jsontocsv = require('json-to-csv-stream')

const {
	createReadStream,
	createWriteStream,
	promises: { readdir },
} = require('fs');
const filesDir = `${__dirname}/files`
const output = `${__dirname}/final.csv`
const finalStreamFile = createWriteStream(output);

(async () => {
	const handleStream = Transform({
		transform: (chunk, enc, cb) => {
			const data = JSON.parse(chunk)
			const output = {
				...data,
				name: data.name.replace(' ', '_')
			}
			return cb(null, JSON.stringify(output));
		},
	});


	const files = await readdir(filesDir);
	const streams = files
		.map(item => createReadStream(join(filesDir, item)));

	debug(`there are ${streams.length} files`)
	debug('processing!!...')
	const ONE_SECOND = 1000
	setInterval(() => { process.stdout.write('.') }, ONE_SECOND).unref()

	const combinedStreams = new StreamConcat(streams);
	await pipelineAsync(
		combinedStreams,
		csvtojson(),
		handleStream,
		jsontocsv(),
		finalStreamFile
	)

	console.log(`${files.length} files merged! on ${output}`);
})()

