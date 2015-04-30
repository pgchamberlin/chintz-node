var should = require('should');
var sinon = require('sinon');

var Chintz = require('../lib/main');

var validElementName = 'test-atom';
var invalidElementName = 'invalid-element-name';

describe('prepare', function() {
    describe('with no arguments', function() {
        it('returns itself', function() {
            var chintz = new Chintz('/../test/chintz');
            var result = chintz.prepare();
            result.should.eql(chintz);
        });
    });
    describe('passed an element name', function() {
        it('returns itself', function() {
            var chintz = new Chintz('/../test/chintz');
            var result = chintz.prepare(validElementName);
            result.should.eql(chintz);
        });
    });
});

describe('render', function() {
    describe('unprepared element', function() {
        it('returns an empty string', function() {
            var chintz = new Chintz('/../test/chintz');
            var result = chintz.render(validElementName);
            result.should.eql("");
        });
    });
    describe('prepared element', function() {
        describe('with no data', function() {
            it('calls back with the element\'s template', function() {
                var template = "Test atom template ";
                var callback = function(s) {
                    s.should.eql(template);
                };
                var chintz = new Chintz('/../test/chintz');
                var result = chintz.prepare(validElementName)
                    .render(validElementName, null, callback);
            });
        });
        describe('with good data', function() {
            var called = false;
            beforeEach(function(done) {
                var string = "foobar";
                var templated = "Test atom template " + string + "\n";
                var callback = function(s) {
                    called = true;
                    s.should.eql(templated);
                    done();
                };
                new Chintz('/../test/chintz')
                    .prepare(validElementName)
                    .render(validElementName, { string: string }, callback);
            });
            it('calls back the templated data', function() {
                called.should.be.true;
            });
        });
    });
});

