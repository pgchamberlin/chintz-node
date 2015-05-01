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
        var expected = "";
        var called = false;
        beforeEach(function(done) {
            var callback = function(s) {
                called = true;
                s.should.eql(expected);
                done();
            };
            new Chintz('/../test/chintz')
                .prepare(invalidElementName)
                .render(invalidElementName, null, callback);
        });
        it('calls back with an empty string', function() {
            called.should.be.true;
        });
    });
    describe('prepared element', function() {
        describe('with no data', function() {
            var expected = "Test atom template \n";
            var called = false;
            beforeEach(function(done) {
                var expected = "Test atom template \n";
                var callback = function(s) {
                    called = true;
                    s.should.eql(expected);
                    done();
                };
                new Chintz('/../test/chintz')
                    .prepare(validElementName)
                    .render(validElementName, null, callback);
            });
            it('calls back with the template', function() {
                called.should.be.true;
            });
        });
        describe('with bad data', function() {
            var called = false;
            beforeEach(function(done) {
                var expected = "Test atom template \n";
                var callback = function(s) {
                    called = true;
                    s.should.eql(expected);
                    done();
                };
                new Chintz('/../test/chintz')
                    .prepare(validElementName)
                    .render(validElementName, { non_existent_key: 'blah' }, callback);
            });
            it('calls back with the template', function() {
                called.should.be.true;
            });
        });
        describe('with good data', function() {
            var called = false;
            beforeEach(function(done) {
                var string = "foobar";
                var expected = "Test atom template " + string + "\n";
                var callback = function(s) {
                    called = true;
                    s.should.eql(expected);
                    done();
                };
                new Chintz('/../test/chintz')
                    .prepare(validElementName)
                    .render(validElementName, { string: string }, callback);
            });
            it('calls back with the template, expected', function() {
                called.should.be.true;
            });
        });
    });
});

xdescribe('getDependencies', function() {
    describe('get non existent deps', function() {
        var called = false;
        beforeEach(function(done) {
            var expected = [ "deps" ];
            var callback = function(d) {
                called = true;
                d.should.eql(expected);
                done();
            };
            new Chintz('/../test/chintz')
                .prepare(validElementName)
                .getDependencies('nonexistent');
        });
        it('calls back with an empty array', function() {
            called.should.be.true;
        });
    });
});
