var mu = require('mu2');
var glob = require('glob');
var fs = require('fs');
var jsyaml = require('js-yaml');

var Chintz = function(root) {
    this.glob = glob;
    this.mu = mu;
    this.preparedElements = [];
    this.root = __dirname + root;
    this.mu.root = this.root;

    this.getElementConfig = function(element) {
        return jsyaml.load(
            fs.readFileSync(this.getElementConfigPath(element), 'utf8')
        );
    }

    this.getElementConfigPath = function(element) {
        return this.getFilePathFromGlobPath(this.getElementGlobPath(element) + "/" + element + ".yaml");
    }

    this.getElementMustachePath = function(element) {
        return this.getFilePathFromGlobPath(this.getElementGlobPath(element) + "/" + element + ".mustache");
    }

    this.getFilePathFromGlobPath = function(globPath) {
        var files = glob.sync(globPath);
        return files.pop();
    }

    this.getElementGlobPath = function(element) {
        return this.root + "/[amo]*/" + element;
    }

    this.setTemplate = function(element) {
        var template = fs.readFileSync(this.getElementMustachePath(element), { encoding: 'utf8' });
        this.mu.compileText(element, template);
    }

    this.resolveDependencies = function() {};
};

Chintz.prototype.prepare = function(elements) {
    if (!elements) return this;

    elements = typeof elements === 'string' ? [ elements ] : elements;

    var prepped = this.preparedElements;
    unpreparedElements = elements.filter(function(i) { return prepped.indexOf(i) < 0 });
    for (i in unpreparedElements) {
        var element = unpreparedElements[i];
        var config = this.getElementConfig(element);
        if (config.dependencies) {
            this.resolveDependencies(config.dependencies);
        }

        this.setTemplate(element);
        this.preparedElements.push(element);
    }

    return this;
};

Chintz.prototype.render = function(elementName, content, callback) {
    if (this.preparedElements.indexOf(elementName) < 0) return "";

    content = content || {};
    var stream = this.mu.render(elementName, content);

    var string = '';
    stream.on('data', function(data){
        string += data;
    });

    stream.on('end', function() {
        return callback(string);
    });
};

module.exports = Chintz;
