# Layers as Tile Pattern

Use layers as a tile pattern to fill a shape. The layers you use as a tile pattern is converted to a symbol and then tiled to fill the shape. You can also fill a shape with an existing symbol.

<img src="https://user-images.githubusercontent.com/1472553/54437005-9924c380-472b-11e9-9abe-12e16e085112.gif" alt="Animated screenshot"/>

## Installation
 
### From a release (simplest)
 
- [Download](https://github.com/BohemianCoding/layers-as-tile-pattern-sketchplugin/releases/latest) the latest release of the plugin
- Double-click the .zip file to extract the plugin
- Double-click `layers-as-tile-pattern.sketchplugin` to install the plugin

### From source
 
- Clone the repo
- Install the dependencies with `npm install`

## Usage

### To fill a shape with selected layers

- Select the layers you want to use as a tile pattern.
- Go to _Plugins > Layers as Tile Pattern > Fill Shape with Selected Layers_
- Select the shape you want to fill. The tile pattern layers are converted to a symbol, named in the format of `Patterns/Pattern n` and the shape is filled with tiled symbol instances.

### To fill a shape with a symbol

- Select the shape you want to fill
- Go to _Plugins > Layers as Tile Pattern > Fill Selected Shape with Symbol_
- Select the symbol you want to use as a tile pattern. Symbols starting with `Patterns/` will appear first.

