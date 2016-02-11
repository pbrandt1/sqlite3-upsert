'use strict';

function keys (obj) {
  return Object.keys(obj).filter((k) => obj.hasOwnProperty(k)).sort();
}

module.exports = function(opts) {
  if (!opts.table) {
    throw new Error('must specify options.table')
  }
  if (!opts.key) {
    throw new Error('must specify options.key (usually the name of the primary key column)')
  }
  if (!opts.db) {
    throw new Error('must pass in options.db, the db you created with "let db = new sqlite3.Database()"')
  }
  var db = opts.db;

  return function (obj, cb) {
    if (typeof cb === 'undefined') {
      cb = function() {};
    }

    if (!obj[opts.key]) {
      return cb(new Error(`cannot upsert object without property "${opts.key}"`))
    }


    let columns = keys(obj).join(', ')
    let $columns = keys(obj).map((k) => '$' + k).join(',\n')
    let values = keys(obj).reduce((o, k) => {o['$' + k] = obj[k]; return o}, {})
    db.serialize(function() {
      keys(obj).map(function(column){
        db.run(`update ${opts.table} set ${column} = $val where ${opts.key} = $id`, {$val: obj[column], $id: obj[opts.key]})
      })
      db.run(`insert into ${opts.table} (${columns}) select ${$columns} where changes() = 0`, values)
      db.all(`select * from ${opts.table} where ${opts.key} = $id`, {$id: obj[opts.key]}, function(e, r) {
        if (e) { return cb(e) }
        if (r && r.length === 1) {
          cb(null, r[0])
        } else {
          cb(new Error('there was an undefined error, please submit an issue at https://github.com/pbrandt1/sqlite3-upsert'))
        }
      })
    })
  }
}
