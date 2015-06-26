var shell = require('mesh-viewer')({
  meshColor: [0.0, 0.0, 0.0]
})

var mesh = require('./')(0.3, {
  segments: 16
})
shell.on('viewer-init', function() {
  mesh = shell.createMesh({
    positions: mesh.positions,
    cells: mesh.cells,
    vertexNormals: mesh.normals
  })
})
 
shell.on('gl-render', function() {
  mesh.draw()
})