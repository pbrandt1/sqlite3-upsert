var upsert = require('../')
var sql = require('sqlite3')
var db = new sql.Database('test.db')
var upsert_product = upsert({table: 'products', key: 'id', db: db})
var should = require('should')

describe('upsert', function() {

  before(function(done) {
    db.serialize(function() {
      db.run('drop table if exists products')
      db.run('create table products (id text, val text)', done)
    })

  })

  it('should insert a product', function(done) {
    upsert_product({id: 'a'}, function(e, product) {
      should.not.exist(e)
      product.id.should.equal('a')
      should.not.exist(product.val)
      // let's double check
      db.all('select * from products', function(e, products) {
        should.not.exist(e)
        products.length.should.equal(1)
        products[0].id.should.equal('a')
        done();
      })
    })
  })

  it('should update a product', function(done) {
    upsert_product({id: 'a', val: 'something'}, function(e, product) {
      should.not.exist(e)
      product.id.should.equal('a')
      product.val.should.equal('something')
      // let's double check
      db.all('select * from products', function(e, products) {
        should.not.exist(e)
        products.length.should.equal(1)
        products[0].id.should.equal('a')
        products[0].val.should.equal('something')
        done();
      })
    })
  })

  it('should not mess with undefined properties', function(done) {
    upsert_product({id: 'a'}, function(e, product) {
      should.not.exist(e)
      product.id.should.equal('a')
      product.val.should.equal('something')
      // let's double check
      db.all('select * from products', function(e, products) {
        should.not.exist(e)
        products.length.should.equal(1)
        products[0].id.should.equal('a')
        products[0].val.should.equal('something')
        done();
      })
    })
  })
})
