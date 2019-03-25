module.exports = function (req, res, next) {
    res.send({
            code: 0,
            msg: '请求成功',
            "data": [{
                "id": "0001",
                "title": "总公司(10000411)",
                "data": {
                    "ageDate": "2018/03/31 00:00:00",
                    "ageFid": "",
                    "ageId": "0001",
                    "ageNO": "10000411",
                    "ageName": "总公司",
                    "ageOper": 1,
                    "urlType": 1
                },
                "children": [],
                "checked": false
            }, {
                "id": "0002",
                "title": "翔融支付(1804260001)",
                "data": {
                    "ageDate": "2018/04/26 15:24:14",
                    "ageFid": "",
                    "ageId": "0002",
                    "ageNO": "1804260001",
                    "ageName": "翔融支付",
                    "ageOper": 0,
                    "urlType": 1
                },
                "checked": false
            }],
            
    })
};