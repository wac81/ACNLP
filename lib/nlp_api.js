'use strict';

var config = require('../lib/config'); // 配置文件
var util = require("util");
var events = require("events");
function Proxy() {
    events.EventEmitter.call(this);
}
util.inherits(Proxy, events.EventEmitter);

var proxy = new Proxy(); // 能发射的

// 建立两个redis客户端，toJieba负责向jieba发送请求，formJieba负责接收jieba的处理结果
var toJieba = require('redis').createClient(6379, config.redisServer);
var formJieba = require('redis').createClient(6379, config.redisServer);

toJieba.on('error', function(err) {
    console.log('toJieba连接失败 ：' + err);
});

formJieba.on('error', function(err) {
    console.log('formJieba连接失败 ：' + err);
});

// 订阅频道
formJieba.subscribe('cutResult', 'kwAnalyseResult', 'wordFlagResult', 'sentimentsResult', 'similarResult','abstractResult','classificationResult');

// 订阅事件触发后将结果向后传递
formJieba.on('message', function(channel, jiebaResult) {
    // !@# 是用户与处理结果的分隔符
    var infoList = jiebaResult.split('!@#');
    proxy.emit(infoList[0], infoList[1]);
});

// 精确分词
exports.exactCut = function(nl, callback) {
    var random = Math.round(Math.random() * 100000);
    toJieba.publish('exactCut', random + '!@#' + nl);
    proxy.once(random, function(returnList) {
        var result = {};
        returnList = returnList.split(',');
        result.wordsList = returnList;
        callback(result);
    });
}

// 搜索引擎分词
exports.searchCut = function(nl, callback) {
    var random = Math.round(Math.random() * 100000);
    toJieba.publish('searchCut', random + '!@#' + nl);
    proxy.once(random, function(returnList) {
        var result = {};
        returnList = returnList.split(',');
        result.wordsList = returnList;
        callback(result);
    });
}

// 关键词提取
exports.kwAnalyse = function(nl, callback) {
    var random = Math.round(Math.random() * 100000);
    toJieba.publish('kwAnalyse', random + '!@#' + nl);
    proxy.once(random, function(returnList) {
        var result = {};
        // $%^ 是数据项的分隔符
        returnList = returnList.split('$%^');
        var resultList = [];
        for (var i=0, k=returnList.length-1; i<k; i+=2) {
            resultList.push({
                word: returnList[i],
                weight: returnList[i+1]
            });
        }
        result.rankList = resultList;
        callback(result);
    });
}

// 词性标注
exports.wordFlag = function(nl, callback) {
    var random = Math.round(Math.random() * 100000);
    toJieba.publish('wordFlag', random + '!@#' + nl);
    proxy.once(random, function(returnList) {
        var result = {};
        // $%^ 是数据项的分隔符
        returnList = returnList.split('$%^');
        var resultList = [];
        for (var i=0, k=returnList.length-1; i<k; i+=2) {
            resultList.push({
                word: returnList[i],
                flag: returnList[i+1]
            });
        }
        result.flagsList = resultList;
        callback(result);
    });
}

// 情感分析
exports.sentiments = function(nl, callback) {
    var random = Math.round(Math.random() * 100000);
    toJieba.publish('sentiments', random + '!@#' + nl);
    proxy.once(random, function(returnList) {
        var result = {};
        // $%^ 是数据项的分隔符
        returnList = returnList.split('$%^');
        result.sentiments = returnList;
        callback(result);
    });
}

// 相似性
exports.similar = function(nl, callback) {
    var random = Math.round(Math.random() * 100000);
    toJieba.publish('similar', random + '!@#' + nl);
    proxy.once(random, function (returnList) {
        var result = {};
        returnList = returnList.split('$%^');
        result.similarNO = returnList[0].split(',');
        result.similarQZ = returnList[1].split(',');
        return callback(result);
    });
}


// 文本抽取
exports.abstract = function(nl, callback) {
    var random = Math.round(Math.random() * 100000);
    toJieba.publish('abstract', random + '!@#' + nl);
    proxy.once(random, function(returnList) {
        var result = {};
        returnList = returnList.split('$%^');
        result.text = returnList;
        callback(result);
    });
}

//文本分类 classificationResult
exports.classification = function(nl, callback) {
    var random = Math.round(Math.random() * 100000);
    toJieba.publish('classification', random + '!@#' + nl);
    proxy.once(random, function(returnList) {
        var result = {};
        returnList = returnList.split('_');
        result.classification = returnList;
        callback(result);
    });
}