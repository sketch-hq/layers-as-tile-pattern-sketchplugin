const { getSelectedDocument } = require('sketch/dom')
const { fillShapeWithSymbolMaster, isShapeLayer, hasShapeLayer } = require('./common')
const UI = require('sketch/ui')

const SYMBOL_FOLDER = 'Patterns'

export default function() {
  const document = getSelectedDocument()
  if (document.selectedLayers.length === 0 || !hasShapeLayer(document.selectedLayers.layers)) {
    UI.alert('Error', 'Select one or more shapes you want to fill with a symbol.')
    return
  }
  const symbols = document.getSymbols().sort((symbol1, symbol2) => {
    const hasPrefix1 = symbol1.name.startsWith(SYMBOL_FOLDER)
    const hasPrefix2 = symbol2.name.startsWith(SYMBOL_FOLDER)
    if (hasPrefix1 && !hasPrefix2) {
      return -1
    } else if (!hasPrefix1 && hasPrefix2) {
      return 1
    }
    return symbol1.name.localeCompare(symbol2.name)
  })
  const symbolNames = symbols.map(symbol => symbol.name)
  UI.getInputFromUser('Select the symbol you want to use as a tile pattern', {
    type: UI.INPUT_TYPE.selection,
    possibleValues: symbolNames
  }, (error, value) => {
    if (!error) {
      const symbolMaster = symbols[symbolNames.indexOf(value)]
      fillShapesWithSymbolMaster(document.selectedLayers.layers, symbolMaster)
    }
  })
}

const fillShapesWithSymbolMaster = function(layers, symbolMaster) {
  layers.forEach(layer => {
    if (isShapeLayer(layer)) {
      fillShapeWithSymbolMaster(layer, symbolMaster)
    }
  })
}

