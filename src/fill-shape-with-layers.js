const { SymbolMaster, fromNative, Page, getSelectedDocument, Rectangle } = require('sketch/dom')
const UI = require('sketch/ui')
const Settings = require('sketch/settings')
const { fillShapeWithSymbolMaster, isShapeLayer } = require('./common')

const TILE_LAYER_IDS = 'tileLayerIds'
const DOCUMENT_ID = 'documentId'
const PLUGIN_NAME = 'Layers as Tile Pattern'
const SYMBOL_PREFIX = 'Patterns/Pattern'

export default function() {
  const document = getSelectedDocument()
  if (document.selectedLayers.length === 0) {
    UI.alert('Error', 'Select one or more layers you want to use as a tile pattern.')
    return
  }
  Settings.setSessionVariable(TILE_LAYER_IDS, document.selectedLayers.layers.map(layer => layer.id))
  Settings.setSessionVariable(DOCUMENT_ID, document.id)
  UI.alert(PLUGIN_NAME, 'Now select the shape you want to fill with the layers with.')
}

export const onSelectionChanged = function(context) {
  const actionContext = context.actionContext
  const tileLayerIds = Settings.sessionVariable(TILE_LAYER_IDS)
  const documentId = Settings.sessionVariable(DOCUMENT_ID)
  if (tileLayerIds != null && documentId == actionContext.document.documentData().objectID() && actionContext.newSelection.length > 0) {
    const shapeLayer = fromNative(actionContext.newSelection[0])
    if (isShapeLayer(shapeLayer)) {
      const document = getSelectedDocument()
      const symbolMaster = convertLayersToSymbolMaster(getLayersFromLayerIds(tileLayerIds, document), document)
      fillShapeWithSymbolMaster(shapeLayer, symbolMaster)
      UI.message(`Created pattern symbol "${symbolMaster.name}" in Symbols page`)
      clearSession()
    } else {
      UI.alert('Error', 'You need to select a shape.')
    }
  } else {
    clearSession()
  }
}

const convertLayersToSymbolMaster = function(layers, document) {
  const symbolsPage = getSymbolsPage(document)
  const symbolMaster = new SymbolMaster({name: createUniqueSymbolMasterName(document), parent: symbolsPage})
  const layerBounds = getBoundsOfLayers(layers)
  symbolMaster.frame = new Rectangle(symbolMaster.frame.x, symbolMaster.frame.y, layerBounds.width, layerBounds.height)
  const offset = {x: -layerBounds.x, y: -layerBounds.y}
  layers.forEach(layer => {
    symbolMaster.layers.push(layer)
    layer.frame.x += offset.x
    layer.frame.y += offset.y
  })
  return symbolMaster
}

const getSymbolsPage = function(document) {
  let symbolsPage = document.pages.find(page => {
    return page.name === 'Symbols'
  })
  if (symbolsPage != null) {
    return symbolsPage
  } else {
    symbolsPage = new Page({name: 'Symbols', parent: document})
    return symbolsPage
  }
}

const getLayersFromLayerIds = function(layerIds, document) {
  const layers = []
  layerIds.forEach(layerId => {
    layers.push(document.getLayerWithID(layerId))
  })
  return layers
}

const getBoundsOfLayers = function(layers) {
  let minX, minY, maxX, maxY
  layers.forEach(layer => {
    if (minX == null || layer.frame.x < minX) {
      minX = layer.frame.x
    }
    if (minY == null || layer.frame.y < minY) {
      minY = layer.frame.y
    }
    if (maxX == null || layer.frame.x + layer.frame.width > maxX) {
      maxX = layer.frame.x + layer.frame.width
    }
    if (maxY == null || layer.frame.y + layer.frame.height > maxY) {
      maxY = layer.frame.y + layer.frame.height
    }
  })
  return new Rectangle(minX, minY, maxX - minX, maxY - minY)
}

const createUniqueSymbolMasterName = function(document) {
  const symbolMasterNames = getSymbolMasterNames(document)
  let i = 0, name
  do {
    i++
    name = `${SYMBOL_PREFIX} ${i}`
  } while(symbolMasterNames.has(name))
  return name
}

const getSymbolMasterNames = function(document) {
  const names = new Set()
  document.getSymbols().forEach(symbol => {
    names.add(symbol.name)
  })
  return names
}

const clearSession = function() {
  Settings.setSessionVariable(TILE_LAYER_IDS, null)
  Settings.setSessionVariable(DOCUMENT_ID, null)
}


