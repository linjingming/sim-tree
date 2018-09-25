# 核心方法
### 语法：oTree = simTree(options)

```
// 示列
var oTree = simTree({
    el: '#demo1',
    check: true, // 开启多选
    data: function (obj, callback) {
        request({
            url: 'getTreeList', // ajax请求地址
        }).then(function (res) {
            // res.data 树数据
            callback(res.data);
        })
    }
    // 点击节点回调
    onClick: function (item) { // item节点数据
    },
    // 树加载完成后回调
    done: function () {
    }
});
```
#### ==options==是一个对象参数，目前 tree 模块所支持的全部参数如下：

参数 | 类型 | 描述
---|---|---
el | string/jquery selecter|指定元素的选择器 或者jquery selecter
check | Boolean | true 开启多选 默认值：false
linkParent | Boolean | true 开启父子关联 默认值 false
childNodeAsy | Boolean | true 开启子节点异步加载 默认值：false
data | Array/Function|数据数据来源，详细例子见下文
onClick | Function|点击节点的回调
onChange | Function | 改变节点的回调
done | Function|树加载完成后回调
response | Object|用于对返回的数据字段名称的自定义

> response 用于对返回的数据字段名称的自定义

```
response: {
    name: "NAME",
    id: "RESOURCE_ID",
    pid: "PARENT_ID"
}
```
> 你接口返回的数据格式，比如遵循 response 对应的字段名称。比如上面对应的格式为：

```
{
  code: 0,
  msg: "返回成功",
  data: [
    {
        "NAME": '父节点1',
        "RESOURCE_ID": '0001',
        "PARENT_ID": ''
    },
    {
        "NAME": '子节点1',
        "RESOURCE_ID": '00010001',
        "PARENT_ID": '0001'
    },
    {
        "NAME": '子节点2',
        "RESOURCE_ID": '00010002',
        "PARENT_ID": '0001'
    }
  ]
}
```

#### oTree 返回对象，目前支持如下方法：
1. getSelected()  返回选中节点
2. setSelected(id) id(string/array)是选中节点的id  设置选中节点
3. disableNode(id) id(string/array)是选中节点的id  设置禁止操作某些节点
4. expandNode(id) 根据id展开某个节点
5. search(val) val(string)是搜索的节点关键字 树内搜索
6. destroy() 树销毁
7. refresh(data) data(object) 节点数据 可选 树刷新

### 使用列子

---

>已知节点数据

```
// 已有数据
var nodes = [ //节点
    {
        name: '父节点1',
        id: '0001',
        pid: ''
    },
    {
        name: '子结点1',
        id: '00010001',
        pid: '0001',
        disabled: true // 节点禁止操作
    },
    {
        name: '子结点1的1',
        id: '000100010001',
        pid: '00010001'
    }
];
// 生成树
simTree({
    el: '#demo',
    data: nodes,
    // 点击节点回调
    onClick: function (item) {
        // item节点数据
        console.log(item)
    }
});
// 或者
simTree({
    el: '#demo',
    data: function (obj, callback) {
        callback(nodes);
    },
    // 点击节点回调
    onClick: function (item) {
        // item节点数据
        console.log(item)
    }
});
```
> ajax请求数据

```
simTree({
    el: '#demo1',
    data: function (obj, callback) {
        request({
            url: 'getTreeList', // ajax请求地址
        }).then(function (res) {
            // res.data 树数据
            callback(res.data);
        })
    }
    // 点击节点回调
    onClick: function (item) {
    },
    // 树加载完成后回调
    done: function () {
    }
});
```
>子节点异步加载

```
// 假如后端返回数据格式如下，必须返回children, 有子节点的值为true 或者 空数组
{
  "code": "0",
  "msg": "",
  "data": [
    {
      "name": "父节点",
      "id": "0001",
      "pid": "",
      "children": true
    },
    {
      "name": "父节点2",
      "id": "0002",
      "pid": "",
      "children": false
    }
  ]
}
simTree({
    el: '#demo',
    childNodeAsy: true,
    data: function (obj, callback) {
        var id = obj.id; // 节点id
        if (!id) { // 加载顶级数据
            request({
                url: 'tree.json'
            }).then(function (res) {
                callback(res.data);
            })
        } else { // 加载子节点
            request({
                url: 'treeChild.json',
                data: {
                    id: id
                }
            }).then(function (res) {
                callback(res.data);
            })
        }
    },
    onClick: function (item) {
        console.log(item)
    },
    // 树加载完成后回调
    done: function () {

    }
});
```