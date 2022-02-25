const {Pool} = require('pg')

const pool = new Pool({
    connectionString: 'postgres://iizfnkrnslnzot:c08f4e97aef07f3311e473615c19df62f07130814e9030dec9ee9ffe134adddc@ec2-3-232-22-121.compute-1.amazonaws.com:5432/d9kt24m66e3v7g',
    ssl: {
		rejectUnauthorized: false
	}
})

pool.on('error', (err) => {
    debug('Connect db error: ${err}')
    process.exit(-1)
})

module.exports = pool