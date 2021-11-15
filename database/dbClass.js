const fs = require('fs');
const moment = require('moment');

class Database {
  constructor(_longUrl, _id, _shortUrl, _date = moment().format('LLL')) {
    this.longUrl = _longUrl;
    this.shortUrl = _shortUrl;
    this.id = _id;
    this.date = _date;
    this.count = 0;
  }
  saveToDB() {
    let db = JSON.parse(fs.readFileSync('./database/DB.json', 'utf8'));
    for (let id in db) {
      if (db[id].longUrl === this.longUrl) {
        return db[id].shortUrl;
      }
    }
    db[this.id] = this;
    fs.writeFileSync('./database/DB.json', JSON.stringify(db));
  }
}

module.exports = Database;
