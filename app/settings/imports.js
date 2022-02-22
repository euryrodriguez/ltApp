const express = require("express");
const afterLoad = require('after-load');
const parse = require('node-html-parser');
const fs = require('fs');
const rp = require('request-promise');
const request = require('request');
const mysql = require('mysql');
const inquirer = require('inquirer');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lotoApp'
});

const pathsJSONS = {
    national: {
        path: global.rootPath + "/app/data/national.json", title: 'Lotería Nacional'
    },
    loto: {
        path: global.rootPath + "/app/data/loto.json", title: 'Loto Más'
    },
    pega3: {
        path: global.rootPath + "/app/data/pega3.json", title: 'Pega 3'
    },
    quiniela: {
        path: global.rootPath + "/app/data/quinielaPale.json", title: 'Quiniela Pale'
    }
};

exports.express = express;
exports.afterLoad = afterLoad;
exports.parse = parse;
exports.fs = fs;
exports.rp = rp;
exports.request = request;
exports.connection = connection;
exports.pathsJSONS = pathsJSONS;
exports.inquirer = inquirer;

