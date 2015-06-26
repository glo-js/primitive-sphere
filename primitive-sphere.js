var defined = require('defined')
var normalize = require('gl-vec3/normalize')

module.exports = primitiveSphere
function primitiveSphere (opt) {
  if (typeof opt === 'number') {
    opt = { radius: opt }
  }

  opt = opt || {}

  var radius = defined(opt.radius, 1)
  var segments = defined(segments, 16)
  if (!Array.isArray(segments)) {
    segments = [ segments, segments ]
  }
  var phiStart = opt.phiStart || 0
  var thetaStart = opt.thetaStart || 0
  var phiLength = defined(opt.phiLength, Math.PI*2) 
  var thetaLength = defined(opt.thetaLength, Math.PI)

  var segX = segments[0]
  var segY = segments[1]
  var positions = []
  var normals = []
  var cells = []
  var uvs = []

  var vertexCellRows = []
  var uvCellRows = []
  var x, y

  for (y = 0; y <= segY; y++) {
    var vertRow = []
    var uvRow = []
    
    for (x=0; x<=segX; x++) {
      var u = x / segX
      var v = y / segY

      var vertex = [
        -radius 
          * Math.cos(phiStart + u * phiLength)
          * Math.sin(thetaStart + v * thetaLength),
        radius
          * Math.cos(thetaStart + v * thetaLength),
        radius
          * Math.sin(phiStart + u * phiLength)
          * Math.sin(thetaStart + v * thetaLength)
      ]
      positions.push(vertex)
      normals.push(normalize([ 0, 0, 0 ], vertex))
      uvs.push([ u, 1 - v ])

      vertRow.push(positions.length - 1)
    }

    vertexCellRows.push(vertRow)
    uvCellRows.push(uvRow)
  }

  for (y = 0; y < segY; y++) {
    for (x = 0; x < segX; x++) {
      var v1 = vertexCellRows[ y ][ x + 1 ]
      var v2 = vertexCellRows[ y ][ x ]
      var v3 = vertexCellRows[ y + 1 ][ x ]
      var v4 = vertexCellRows[ y + 1 ][ x + 1 ]

      // test for poles
      if (Math.abs(positions[v1][1] === radius)) {
        cells.push([ v1, v3, v4 ])
      } else if (Math.abs(positions[v3][1] === radius)) {
        cells.push([ v1, v2, v3 ])
      } else {
        cells.push([v1, v2, v4])
        cells.push([v2, v3, v4])
      }
    }
  }

  return {
    uvs: uvs,
    normals: normals,
    positions: positions,
    cells: cells
  }
}
