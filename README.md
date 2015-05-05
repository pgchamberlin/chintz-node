# chintz-node

[Chintz](https://github.com/BBC-News/chintz) client for Node.js

[![NPM](https://nodei.co/npm/chintz-node.png)](https://nodei.co/npm/chintz-node/)

## Usage

_This assumes you have a [Chintz](https://github.com/BBC-News/chintz) library of front end elements (mustache templates, css, js, etc. with a dependency manifest per-component)._

Initialise:

```javascript
var Chintz = require("chintz-node");
var chintz = new Chintz("/absolute/path/to/chintz/library");
```

Prepare elements:

```javascript
chintz->prepare('element-name');
```

Render content:

```javascript
chintz->render('element-name', { data: 'value' }, function(s) { sys.log('rendered content: ' + s); });
```

Resolve dependencies:

```javascript
chintz->getDependencies('dependency_key', function(d) { sys.log('dependencies: ' + d); });
```
