const {Pool} = require('pg')

const pool = new Pool({
    connectionString: 'postgres://phhohdethdjccw:8402fac8dd4f04caf6f7b34c7813b1c32c4cbb0d095095884a4d2063632920d0@ec2-54-205-149-187.compute-1.amazonaws.com:5432/d5gu6dargtnps7',
    ssl: {
		rejectUnauthorized: false
	}
})

pool.on('error', (err) => {
    debug('Connect db error: ${err}')
    process.exit(-1)
})

module.exports = pool