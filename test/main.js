var should = require('should');
var sinon = require('sinon');

var Chintz = require('../lib/main');

var atomName = 'test-atom';
var moleculeName = 'test-molecule';
var invalidName = 'invalid-element-name';

var called;

describe('prepare', function() {

    describe('with no arguments', function() {
        it('returns itself', function() {
            var chintz = new Chintz(__dirname + '/chintz');
            var result = chintz.prepare();
            result.should.eql(chintz);
        });
    });

    describe('passed an element name', function() {
        it('returns itself', function() {
            var chintz = new Chintz(__dirname + '/chintz');
            var result = chintz.prepare(atomName);
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
            new Chintz(__dirname + '/chintz')
                .prepare(invalidName)
                .render(invalidName, null, callback);
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
                new Chintz(__dirname + '/chintz')
                    .prepare(atomName)
                    .render(atomName, null, callback);
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
                new Chintz(__dirname + '/chintz')
                    .prepare(atomName)
                    .render(atomName, { non_existent_key: 'blah' }, callback);
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
                new Chintz(__dirname + '/chintz')
                    .prepare(atomName)
                    .render(atomName, { string: string }, callback);
            });

            it('calls back with the template, expected', function() {
                called.should.be.true;
            });
        });
    });

    describe('prepared nested elements', function() {

        describe('with no data', function() {

            var expected = "Test molecule template, with nested Test atom template \n\n";

            beforeEach(function(done) {
                var callback = function(s) {
                    called = true;
                    s.should.eql(expected);
                    done();
                };
                called = false;
                new Chintz(__dirname + '/chintz')
                    .prepare(moleculeName)
                    .render(moleculeName, null, callback);
            });

            it('calls back with the template', function() {
                called.should.be.true;
            });
        });

        describe('with bad data', function() {

            var expected = "Test molecule template, with nested Test atom template \n\n";

            beforeEach(function(done) {
                var callback = function(s) {
                    called = true;
                    s.should.eql(expected);
                    done();
                };
                called = false;
                new Chintz(__dirname + '/chintz')
                    .prepare(moleculeName)
                    .render(moleculeName, { non_existent_key: 'blah' }, callback);
            });

            it('calls back with the template', function() {
                called.should.be.true;
            });
        });

        describe('with good data', function() {

            var string = "-- atom string --";
            var molString = "-- molecule string --";
            var expected = "Test molecule template, with nested Test atom template " + string + "\n" + molString + "\n";

            beforeEach(function(done) {
                var callback = function(s) {
                    called = true;
                    s.should.eql(expected);
                    done();
                };
                called = false;
                new Chintz(__dirname + '/chintz')
                    .prepare(moleculeName)
                    .render(moleculeName, { string: string, molString: molString }, callback);
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
            new Chintz(__dirname + '/chintz')
                .prepare(atomName)
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
            new Chintz(__dirname + '/chintz')
                .prepare(atomName)
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
            new Chintz(__dirname + '/chintz')
                .registerHandlers(
                    {
                        'handled_test_deps': {
                            format: function(deps) {
                                return expected
                            }
                        }
                    }
                )
                .prepare(atomName)
                .getDependencies('handled_test_deps', callback);
        });

        it('calls back with the expected dependencies', function() {
            called.should.be.true;
        });
    });
});
