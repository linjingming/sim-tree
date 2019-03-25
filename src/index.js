var list = [{
	"id": '350102000000',
	"pid": '',
	"name": "鼓楼区"
},
{
	"id": '350103000000',
	"pid": '350102000000',
	"name": "东街口",
	"disabled": true
},
{
	"id": '350103000000',
	"pid": '',
	"name": "台江区",
},
{
	"id": '350104000000',
	"pid": '',
	"name": "仓山区"
}];

var tree = simTree({
    el: '#tree',
	data: list,
	linkParent: false,
	check: true,
	onClick: function (item) {
		console.log(item)
	},
	onChange: function (item) {
		console.log(item)
	}
});
$('#tree2-ser-submit').on('click', function() {
	var val = $('#tree2-ser-int').val();
	console.log(tree)
	tree.search(val);
});
var tree1 = simTree({
    el: '#tree',
	data: list,
	//check: true,
	onClick: function (item) {
		console.log(item)
	},
	onChange: function (item) {
		console.log(item)
	}
});
tree.disableNode(['350103000000', '350104000000']);

// var tree2 = simTree({
// 	el: '#tree2',
// 	check: true,
// 	response: {
// 		name: 'text'
// 	},
// 	linkParent: true,
//     data: function(node, cb) {
// 		$.get('api/getTreeList').then(function (res) {
// 			cb(res.data);
// 		});
// 	},
// 	onClick: function (item) {
// 		console.log(item)
// 	},
// 	onChange: function (item) {
// 		console.log(item)
// 	},
// 	done: function(data) {
// 		// this.off('click');
// 		console.log(data);
// 		this.setSelected(['200300010001']);
// 	}
// });

// var tree2 = $('#tree2').simTree({
// 	check: true,
// 	response: {
// 		name: 'text'
// 	},
// 	linkParent: true,
//     data: function(node, cb) {
// 		$.get('api/getTreeList').then(function (res) {
// 			cb(res.data);
// 		});
// 	},
// 	onClick: function (item) {
// 		console.log(item)
// 	},
// 	onChange: function (item) {
// 		console.log(item)
// 	},
// 	done: function(data) {
// 		// this.off('click');
// 		console.log(data);
// 		this.setSelected(['200300010001']);
// 	}
// })

// tree2.on('click', function(item) {
// 	console.log('click2');
// });
// tree2.on('done', function(item) {
// 	console.log('done2');
// 	console.log(this.getSelected());
// });

// $('#tree2-ser-submit').on('click', function() {
// 	var val = $('#tree2-ser-int').val();
// 	console.log(tree2)
// 	tree2.search(val);
// });
// 异步加载子节点
var tree3 = simTree({
	el: '#tree3',
	check: true,
	response: {
		name: 'title'
	},
	childNodeAsy: true,
    data: function(node, cb) {
		var id = node.id; // 节点id
        if (!id) { // 加载顶级数据
            $.get('api/getTreeList').then(function (res) {
				cb(res.data);
			});
        } else { // 加载子节点
            $.get('api/getTreeList', {id: id}).then(function (res) {
				cb(res.data);
			});
        }
	},
	//check: true,
	onClick: function (item) {
		console.log(item)
	}
});