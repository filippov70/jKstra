'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _const = require('./const.js');

var _utils = require('./utils.js');

var Graph = function Graph() {
    var vertices = [];
    var edges = [];

    return {
        addVertex: function addVertex(data) {
            var vertex = {
                _in: [],
                _out: [],
                data: data
            };
            vertices.push(vertex);
            return vertex;
        },
        addEdge: function addEdge(from, to, data) {
            var edge = {
                from: from,
                to: to,
                data: data || {}
            };
            from._out.push(edge);
            to._in.push(edge);
            edges.push(edge);
            return edge;
        },


        /**
        Shortcut to add an edge and its reverse,
        sharing the same data.
        */
        addEdgePair: function addEdgePair(a, b, data) {
            return [this.addEdge(a, b, data), this.addEdge(b, a, data)];
        },
        removeEdge: function removeEdge(edge) {
            var index = edges.indexOf(edge);
            if (index !== -1) {
                // remove from extremity vertices first
                // TODO PERF: replace splice with a function operating in-place
                edge.from._out.splice(edge.from._out.indexOf(edge), 1);
                edge.to._in.splice(edge.to._in.indexOf(edge), 1);
                edges.splice(index, 1);
            }
        },
        removeVertex: function removeVertex(vertex) {
            var index = vertices.indexOf(vertex);
            if (index !== -1) {
                // remove all incident edges first
                var edgesToRemove = vertex._in.concat(vertex._out);
                for (var i = 0; i < edgesToRemove.length; i++) {
                    this.removeEdge(edgesToRemove[i]);
                }
                vertices.splice(index, 1);
            }
        },
        outEdges: function outEdges(vertex, filter) {
            return this.incidentEdges(vertex, _const.OUT, filter);
        },
        inEdges: function inEdges(vertex, filter) {
            return this.incidentEdges(vertex, _const.IN, filter);
        },


        /**
        Returns all edges incident to a vertex, in one direction (outgoing or incoming),
        optionnaly filtered by a given function.
        */
        incidentEdges: function incidentEdges(vertex, direction, filter) {
            if (!filter) {
                return direction ? vertex._out : vertex._in;
            }
            var edges = direction ? vertex._out : vertex._in;
            return edges.filter(filter);
        },
        vertex: function vertex(props) {
            var v = null;
            for (var i = 0, l = vertices.length; i < l && v == null; i++) {
                if ((0, _utils.propsMatch)(vertices[i].data, props)) {
                    v = vertices[i];
                }
            }
            return v;
        },
        edge: function edge(props) {
            var e = null;
            for (var i = 0, l = edges.length; i < l && e == null; i++) {
                if ((0, _utils.propsMatch)(edges[i].data, props)) {
                    e = edges[i];
                }
            }
            return e;
        },


        /**
        Perform an action on each vertex of the graph
        */
        forEachVertex: function forEachVertex(action) {
            vertices.forEach(function (v) {
                return action(v);
            });
        },


        /**
        Perform an action on each edge of the graph
        */
        forEachEdge: function forEachEdge(action) {
            edges.forEach(function (e) {
                return action(e);
            });
        }
    };
};

exports.default = Graph;
module.exports = exports['default'];