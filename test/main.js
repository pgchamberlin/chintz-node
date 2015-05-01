var should = require('should');
var sinon = require('sinon');

var Chintz = require('../lib/main');

var validElementName = 'test-atom';
var invalidElementName = 'invalid-element-name';

var called;

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

    var chintz;
    var result;

    describe('unprepared element', function() {

        var expected = "";

        beforeEach(function(done) {
            var callback = function(s) {
                called = true;
                s.should.eql(expected);
                done();
            };
            called = false;
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

            beforeEach(function(done) {
                var callback = function(s) {
                    called = true;
                    s.should.eql(expected);
                    done();
                };
                called = false;
                new Chintz('/../test/chintz')
                    .prepare(validElementName)
                    .render(validElementName, null, callback);
            });

            it('calls back with the template', function() {
                called.should.be.true;
            });
        });

        describe('with bad data', function() {

            var expected = "Test atom template \n";

            beforeEach(function(done) {
                var callback = function(s) {
                    called = true;
                    s.should.eql(expected);
                    done();
                };
                called = false;
                new Chintz('/../test/chintz')
                    .prepare(validElementName)
                    .render(validElementName, { non_existent_key: 'blah' }, callback);
            });

            it('calls back with the template', function() {
                called.should.be.true;
            });
        });

        describe('with good data', function() {

            var string = "-- string value to template in --";
            var expected = "Test atom template " + string + "\n";

            beforeEach(function(done) {
                var callback = function(s) {
                    called = true;
                    s.should.eql(expected);
                    done();
                };
                called = false;
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

describe('getDependencies', function() {

    describe('get non existent deps', function() {

        beforeEach(function(done) {
            var expected = [];
            var callback = function(d) {
                called = true;
                d.should.eql(expected);
                done();
            };
            called = false;
            new Chintz('/../test/chintz')
                .prepare(validElementName)
                .getDependencies('nonexistent', callback);
        });

        it('calls back with an empty array', function() {
            called.should.be.true;
        });
    });

    describe('get existing dependencies', function() {

        beforeEach(function(done) {
            var expected = [ "test dependency" ];
            var callback = function(d) {
                called = true;
                d.should.eql(expected);
                done();
            };
            called = false;
            new Chintz('/../test/chintz')
                .prepare(validElementName)
                .getDependencies('test_deps', callback);
        });

        it('calls back with the expected dependencies', function() {
            called.should.be.true;
        });
    });

    describe('get handled dependencies', function() {

        beforeEach(function(done) {
            var expected = [ "a handled dependency" ];
            var callback = function(d) {
                called = true;
                d.should.eql(expected);
                done();
            };
            called = false;
            new Chintz('/../test/chintz')
                .registerHandlers(
                    {
                        'handled_test_deps': {
                            format: function(deps) {
                                return expected
                            }
                        }
                    }
                )
                .prepare(validElementName)
                .getDependencies('handled_test_deps', callback);
        });

        it('calls back with the expected dependencies', function() {
            called.should.be.true;
        });
    });
});
