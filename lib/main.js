var mu = require('mu2');
var glob = require('glob');
var fs = require('fs');
var jsyaml = require('js-yaml');

var Chintz = function(root) {
    this.glob = glob;
    this.mu = mu;
    this.preparedElements = [];
    this.templateableElements = [];
    this.root = __dirname + root;
    this.mu.root = this.root;

    this.getElementConfig = function(element) {
        var path = this.getElementConfigPath(element);
        return typeof path === "string"
            ? jsyaml.load(
                fs.readFileSync(path, 'utf8')
            )
            : {};
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
        var path = this.getElementMustachePath(element);

        if (!path) return;

        var template = fs.readFileSync(path, { encoding: 'utf8' });
        this.mu.compileText(element, template);

        return true;
    }

    this.resolveDependencies = function() {};
};

Chintz.prototype.prepare = function(elements) {

    if (!elements) return this;

    elements = typeof elements === 'string' ? [ elements ] : elements;

    var prepped = this.preparedElements;
    unpreparedElements = elements.filter(function(i) {
        return prepped.indexOf(i) < 0
    });
    for (i in unpreparedElements) {
        var element = unpreparedElements[i];
        var config = this.getElementConfig(element);
        if (config.dependencies) {
            this.resolveDependencies(config.dependencies);
        }

        this.preparedElements.push(element);

        if (this.setTemplate(element)) {
            this.templateableElements.push(element);
        }
    }

    return this;
};

Chintz.prototype.render = function(elementName, content, callback) {
    var string = '';

    if (this.templateableElements.indexOf(elementName) < 0) {

        callback(string);
        return this;
    }

    content = content || {};
    var stream = this.mu.render(elementName, content);

    stream.on('data', function(data){
        string += data;
    });

    stream.on('end', function() {
        callback(string);
    });

    return this;
};

Chintz.prototype.getDependencies = function(name) {
    if (this.dependencyHandlers.indexOf(name) > -1) {
        return this.dependencyHandlers.name.format(this.dependencies.name);
    }
    return this.dependencies.name;
}

module.exports = Chintz;
