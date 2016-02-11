# sqlite3-upsert

simple module to allow you to use upsert, basically the only thing worth having. since upsert is a factory function, in the example we upsert "products"

### upsert(options) returns function(object, [callback])
```javascript
var upsert_product = upsert({table: 'products', key: 'id', db: db})
upsert_product({id: 'a', val: 'something'})
```

#### full example
```javascript
var sqlite3 = require('sqlite3')
var upsert = require('sqlite3-upsert')
var db = new sqlite3.Database('test.db')
var upsert_product = upsert({table: 'products', key: 'id', db: db})
db.serialize(function() {
  db.run('create table products (id text, val text)')
  upsert_product({id: 'a'}, console.log.bind(console))
  upsert_product({id: 'a', val: 'asdfasdf'}, console.log.bind(console))
})
```
