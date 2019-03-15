const { Rectangle, Group } = require('sketch/dom')

export const fillShapeWithSymbolMaster = function(shape, symbolMaster) {
  const group = new Group({
    name: shape.name,
    parent: shape.parent
  })
  shape.name = 'Mask'
  shape.sketchObject.hasClippingMask = true
  shape.style.fills.forEach(fill => {
    fill.enabled = false
  })
  group.layers.push(shape)
  group.layers.push(...buildSymbolInstances(symbolMaster, shape))
  group.adjustToFit()
}

export const isShapeLayer = function(layer) {
  return layer.type === 'ShapePath' || layer.type === 'Shape'
}

export const hasShapeLayer = function(layers) {
  return layers.some(layer => isShapeLayer(layer))
}

const buildSymbolInstances = function(symbolMaster, maskLayer) {
  const symbolInstances = []
  const numHorzItems = Math.ceil(maskLayer.frame.width / symbolMaster.frame.width)
  const numVertItems = Math.ceil(maskLayer.frame.height / symbolMaster.frame.height)
  for (let y = 0; y < numVertItems; y++) {
    for (let x = 0; x < numHorzItems; x++) {
      const symbolInstance = symbolMaster.createNewInstance()
      symbolInstance.frame = new Rectangle(maskLayer.frame.x + (x * symbolMaster.frame.width), maskLayer.frame.y + (y * symbolMaster.frame.height), symbolMaster.frame.width, symbolMaster.frame.height)
      symbolInstance.name = 'Tile'
      symbolInstances.push(symbolInstance)
    }
  }
  return symbolInstances
}