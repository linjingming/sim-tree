# sim-tree
一个操作简单的基于jquery写的树展示插件,支持异步展示子节点

> 没有那么多复杂功能，回归简单

## 安装
npm install sim-tree --save

## 简单使用
![image](https://note.youdao.com/yws/public/resource/c388c5d31f70ef784dbddb6e11e120bd/xmlnote/4EC2776D27394FA6A453D816B4A9ACD2/1763)
```html
    <div id="tree"></div>
```
```js
    // 数据格式1 有children
    var list = [{
        "id": '350102000000',
        "fid": '',
        "name": "鼓楼区",
        "children": [
            {
                "id": '350103000000',
                "fid": '350102000000',
                "name": "东街口"
            }
        ]
    },
    {
        "id": '350103000000',
        "fid": '',
        "name": "台江区"
    },
    {
        "id": '350104000000',
        "fid": '',
        "name": "仓山区"
    }];
    // 数据格式2 同级
    var list = [{
        "id": '350102000000',
        "fid": '',
        "name": "鼓楼区",
    },
    {
        "id": '350103000000',
        "fid": '350102000000',
        "name": "东街口"
    },
    {
        "id": '350103000000',
        "fid": '350101000000',
        "name": "宝龙"
    },
    {
        "id": '350103000000',
        "fid": '',
        "name": "台江区"
    },
    {
        "id": '350104000000',
        "fid": '',
        "name": "仓山区"
    }];
    var tree = simTree({
        el: '#tree',
        data: list,
        // 返回数据对应
        response: {
            name: 'name', 
            id: 'id',
            pid: 'fid'
        },
        //check: true, // true 开启多选
        //linkParent: true, // 父子关联
        // 点击节点触发
        onClick: function (item) {
            console.log(item);
        },
        // 改变节点触发
        onChange: function (item) {
            console.log(item);
        },
        // 树生成后触发
        done: function (data) {

        }
    });
    ----或者这样----
    // 点击节点触发
    tree.on('click', function (item) {
        console.log(item);
    });
    // 改变节点触发
    tree.on('change', function (item) {
        console.log(item);
    });
    // 树生成后触发
    tree.on('done', function (item) {
        console.log(item);
    })
```
## 简单说明文档
- [https://github.com/linjingming/sim-tree/blob/master/doc/sim-tree.md]

## 交流 & 提问
- 提问： https://github.com/linjingming/sim-tree/issues
- 点击链接加入群聊【simTree】：https://jq.qq.com/?_wv=1027&k=5dKG0tn （及时反馈）

## todo
- 根据节点数据状态初始化设置 展开 或者选中
- 下拉树

## 关于作者
- linjingming