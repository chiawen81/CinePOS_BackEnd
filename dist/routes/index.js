"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRouter = void 0;
const express = require('express');
const router = express.Router();
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
exports.indexRouter = router;
