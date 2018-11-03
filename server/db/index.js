import Sequelize from 'sequelize'
import config from './config.json'

var db;

if (process.env.NODE_ENV === 'production') {
  var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
  db = new Sequelize(match[5], match[1], match[2], {
    dialect: 'postgres',
    protocol: 'postgres',
    port: match[4],
    host: match[3],
    logging: false,
    dialectOptions: {
      ssl: true
    },
    operatorsAliases: false
  });
}
else {
 db = new Sequelize(config.database, config.username, config.password, config);
}

require('./models/user')(db);

db.authenticate()
.then(() => {
  console.log('Connection to database has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = db