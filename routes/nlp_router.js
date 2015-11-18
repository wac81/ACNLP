'use strict';

var router = require('express').Router();
var nlp_api = require('../lib/nlp_api');
var fs = require('fs');

//ubuntu
var articleDir = '/home/workspace/news/';

//mac
//var articleDir = '/Users/ancheng/PycharmProjects/LSI-for-ChineseDocument/news/';

//windows
//var articleDir = 'C:\\Users\\wuanc\\PycharmProjects\\filetools\\news';

// ccnlp page
router.get('/', function (req, res) {
	res.render('home');
});

// ccnlp-api page
router.get('/api', function (req, res) {
	res.render('api');
});

// ccnlp-demo page
router.get('/demo/:text?', function (req, res) {
	var text = req.params.text || '掌柜人不错，质量很好，下次再来。';
	res.render('demo', { text: text });
});

// ccnlp-vv-demo page
router.get('/demovv', function (req, res) {
	res.render('vv');
});

router.get('/product', function (req, res) {
	res.render('product');
});

router.get('/about', function (req, res) {
	res.render('about');
});
// ACNLP处理
//router.get('/atc/:no', function(req, res) {
//    var iconv = new Iconv('GBK', 'UTF-8');
//    fs.readFile('/home/workspace/dict/' + req.params.no, function(err, data){
//        if (err) {
//            console.error('error');
//            res.send({data: err});
//        } else {
//            var str = iconv.convert(data).toString();
//            res.send({data: str});
//        }
//    });
//});

// 查看文章处理
router.get('/atc/:no', function (req, res) {
	fs.readdir(articleDir, function (err, files) {
		fs.readFile(articleDir + "/"+req.params.no, function (err, data) {
		//fs.readFile(articleDir + files[req.params.no], function (err, data) {
			if (err) {
				console.error('error');
				res.send({ data: err });
			} else {
				var str = data.toString();
				res.send({ data: str });
			}
		});
	});
});

//取文件id函数
router.get('/filerealid/:no', function (req, res) {
	fs.readdir(articleDir, function (err, files) {
		if (err) {
			console.error('error');
			res.send({ data: err });
		} else {
			var str = files[req.params.no];
			str = str.split('_');
			res.send({ fileid: str[0] });
		}
	});
});

// action过滤器
router.use('/:action/:nl', function (req, res, next) {
	var action = req.params.action;
	var actions = ['exactCut', 'searchCut', 'kwAnalyse', 'wordFlag', 'sentiments', 'similar','abstract','classification'];
	if (actions.indexOf(action) == - 1) res.send('不支持的行为');
	else next();
});

// 自然语义分析路由
// 参数action是行为，nl是用户输入的自然语言
//router.get('/:action/:nl', function (req, res) {
//	console.log(req.params.action);
//	var nl = req.params.nl.replace(/\s/g, '');
//	nlp_api[req.params.action](nl, function (result) {
//		res.send(result);
//	});
//});

// post
router.post('/:action/', function (req, res) {
	console.log(req.params.action);
	//var nl = req.body.nl.replace(/\s/g, '');
	var nl = req.body.nl;
	nlp_api[req.params.action](nl, function (result) {
		res.send(result);
	});
});


module.exports = router;
