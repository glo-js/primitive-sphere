// validates API
var sphere = require('./')
var test = require('tape')

test('a sphere mesh with normals, texture coordinates and indices', function(t) {
  var geom = sphere(1, { segments: 1 })
  t.equals(geom.positions.length, 28)
  geom = sphere(0.5, { segments: 2 })
  t.equals(geom.positions.length, 45, 'changes segments')

  validate('positions')
  validate('normals')
  validate('cells')
  validate('uvs', 2)
  function validate(key, length) {
    t.equals(Array.isArray(geom[key]), true, key)
    t.equals(Array.isArray(geom[key][0]), true, 'nested '+key)
    t.equals(geom[key][0].length, length || 3, 'nested '+key+' count')    
  }
  t.end()
})