const express = require("express");
const afterLoad = require('after-load');
const parse = require('node-html-parser');
const fs = require('fs');
const rp = require('request-promise');
const request = require('request');

exports.express = express;
exports.afterLoad = afterLoad;
exports.parse = parse;
exports.fs = fs;
exports.rp = rp;
exports.request = request;