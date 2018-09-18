import './simTree.scss'
;(function (window, factroy) {
    if (!window || !window.document) {
        throw new Error('simTree need window')
    }
    factroy(window);
})(typeof window !== 'undefined' ? window : this, function(window) {
    "use strict";
    var name = 'simTree';
    var version = '0.0.1';
    var document = window.document;
    var defaultConfig = {
        response: {
            name: 'text',
            id: 'id',
            pid: 'parent',
            checked: 'state.checked'
        }
    };
    var err = function(msg) {
        throw new Error(msg);
    };
    var simTpl = function(tpl, data) {
        return tpl.replace(/\{\{(.+?)\}\}/g, function($1, $2) {
            return data[$2] ? data[$2] : '';
        });
    };
    
    var Class = function(options) {
        if (typeof $ === 'undefined') {
            err(name + 'need jquery');
        }
        if (!$.isPlainObject(options)) return;
        if (!options.el) {
            err('你没有传el');
        }
        if (!(this instanceof Class)) {
            return new Class(options);
        }
        this.options = $.extend(true, {}, defaultConfig, options);
        this.init();
    };
    var $prevA;
    Class.prototype = {
        version: version,
        constructor: Class,
        /**
         * 绑定自定义事件
         * 
         * @param type {string} 自定义事件名称 
         * @param cb {function} 回调函数 
         * @param isCover {boolean} 是否覆盖之前的回调
         * @return this {object} 实列对象
         */
        on: function(type, cb, isCover) {
            var isTriggered, args;
            this.handles[type] = this.handles[type] || [];
            isTriggered = this.handles[type].isTriggered;
            args = this.handles[type].args;
            if ($.isFunction(cb)) {
                if (isCover === true) {
                    this.handles[type] = [cb];
                } else {
                    this.handles[type].push(cb);
                }
                if (isTriggered) {
                    cb.call(this, args);
                }
            }
            return this;
        },
        // 解除绑定的自定义事件
        off: function(type) {
            this.handles[type] = [];
            return this;
        },
        // 触发自定义事件
        trigger: function(type, args) {
            var i, len;
            this.handles[type] = this.handles[type] || [];
            i = 0;
            len = this.handles[type].length;
            // isTriggered 表示已经触发过
            this.handles[type].isTriggered = true; 
            // args 参数
            this.handles[type].args = args;
            for (; i < len; i++) {
                this.handles[type][i].call(this, args);
            }
        },
        init: function() {
            var options = this.options;
            var data = options.data;
            this.handles = {};
            this.$el = $(options.el);
            this.data = data;
            this.event();
            this.render();
        },
        /**
         * 
         */
        dataCallback: function() {
            var args = arguments;
            if (args.length === 1) {
                this.render(args[0]);
            } else {
                this.doRender(args[0], args[1]);
            }
        },
        /**
         *  把data解析成树型数据
         */
        parse: function(data) {
            var options = this.options;
            var response = options.response;
            var res = [];
            var map = {};
            var i = 0;
            var len = data.length;
            var id = response.id;
            var pid = response.pid;
            // 如果子节点异步加载 直接返回
            if (options.childNodeAsy) {
                return data;
            }
            for (; i < len; i++) {
                var item = data[i];
                var tempId = item[id];
                // 如果节点有children这个字段则判断数据本就是树型结构 直接返回原始数据
                if (item.children) {
                    return data;
                }
                if (tempId) {
                    map[tempId] = item
                }
            }
            for (i = 0; i < len; i++) {
                var item = data[i];
                var tempPid = item[pid];
                var parent = map[tempPid];
                if (tempPid && parent) {
                   (parent.children || (parent.children = [])).push(item);
                } else {
                    res.push(item);
                }
            }
            return res;
        },
        render: function(data) {
            var data = data || this.data;
            if ($.isFunction(data)) {
                data({}, this.dataCallback.bind(this))
            } 
            if ($.isArray(data)) {
                data = this.parse(data);
                this.doRender(this.$el, data);
            }
        },
        doRender: function($el, data, level) {
            var self = this;
            var options = this.options;
            var response = options.response;
            var len = data.length;
            var i = 0;
            var item;
            var id = response.id;
            var text = response.name;
            var level = level || 1;
            var tpl = '<i data-type="{{asy}}" class="sim-tree-spread {{spreadIcon}}"></i><a href="javascript:;"><i class="sim-tree-checkbox"></i>{{text}}</a>';
            var isRootEle = ($el === this.$el);
            var $outEl = $(document.createElement('ul'));
            var oLi, $li, hasChild;
            var asy = options.childNodeAsy ? 'asy' : '';
            for (; i < len; i++) {
                item = data[i];
                oLi = document.createElement('li');
                hasChild = !!item.children;
                if (!options.check) { // 单选
                    tpl = tpl.replace('<i class="sim-tree-checkbox"></i>', '');
                }
                oLi.innerHTML = simTpl(tpl, {
                    asy: asy,
                    text: item[text],
                    spreadIcon: hasChild ? 'layui-icon-r' : 'hidden'
                });
                oLi.setAttribute('data-level', level);
                oLi.setAttribute('data-id', item.id);
                $li = $(oLi);
                $li.data('data', item);
                $outEl.append($li);
                if (hasChild) {
                    this.doRender($li, item.children, level + 1);
                }
            }
            len && $el.append($outEl);
            isRootEle && $outEl.addClass('sim-tree');    
            isRootEle && this.trigger('done', data);
        },
        /**
         * 
         */
        event: function() {
            var self = this;
            this.$el.off('click').on('click', function(e) {
                var $tar = $(e.target);
                if ($tar.hasClass('sim-tree-spread')) {
                    self.spread.call(self, $tar);
                }
                if ($tar.hasClass('sim-tree-checkbox')) {
                    $tar = $tar.parent();
                }
                
                if ($tar[0].tagName.toLowerCase() === 'a') {
                    self.clickNode.call(self, $tar);
                }
                return false;
            });
            this.$el.on('selectstart', function() {
                return false;
            });

            if (this.options.done) {
                this.on('done', this.options.done);    
            }

            if (this.options.onClick) {
                this.on('click', this.options.onClick);    
            }

            if (this.options.onSearch) {
                this.on('search', this.options.onSearch);    
            }
        },
        // 展开或收起
        spread: function($el) {
            if ($el.hasClass('layui-icon-r')) {
                this.doSpread($el, true);    
            } else {
                this.doSpread($el, false);
            }
            
        },
        /**
         *  展开或者收起
         *  @param $el {jquery object} jquery对象
         *  @param status {boolean} true 展开 false收起
         */
        doSpread: function($el, status) {
            var $pli = $el.parent();
            var $ul = $pli.children('ul');
            var item = $pli.data('data');
            if (!item.children) return;
            if (status) {
                $el.removeClass('layui-icon-r').addClass('layui-icon-d');
                // 异步加载子节点
                if ($el.data('type') === 'asy' && $.isFunction(this.data)) {
                    this.data($pli.data('data'), this.dataCallback.bind(this, $pli));
                    $ul = $pli.children('ul');
                    $el.data('type', '');
                }
                $ul.addClass('show');
            } else {
                $el.removeClass('layui-icon-d').addClass('layui-icon-r');
                $ul.removeClass('show');
            }
        },
        // 点击节点
        clickNode: function($tar) {
            var $pli = $tar.parent();
            var $li = this.$el.find('li');
            var len = $li.length;
            var i = 0;
            var list = [];
            var data;
            if(this.options.check) {
                this.doCheck($tar);
                for (; i < len; i++) {
                    data = $li.eq(i).data();
                    if (data['checked']) {
                        list.push(data.data);
                    }
                }
            } else {
                if ($prevA) {
                    $prevA.css('font-weight', 'normal');
                }
                $tar.css('font-weight', 'bold');
                $prevA = $tar;
                list = [$pli.data('data')];
            }
            this.sels = list;
            this.trigger('click', list);
        },
        // 多选设置选中状态
        doCheck: function($tar, status) {
            var $li = $tar.parent();
            var $check = $tar.find('.sim-tree-checkbox');
            if (status) {
                $check.addClass('checked')
            } else {
                $check.toggleClass('checked');
            }
            $li.data('checked', $check.hasClass('checked'));
        },
        // 树搜索
        search: function(val) {
            var val = $.trim(val);
            var $li = this.$el.find('li');
            var i = 0;
            var len = $li.length;
            var text, $mLi, data;
            var res = [];
            $li.hide().children('.sim-tree-spread').addClass('hidden');
            for (; i < len; i++) {
                $mLi = $li.eq(i);
                text = $mLi.children('a').text();
                data = $mLi.data('data');
                if (!val) {
                    $mLi.show();
                    if (data.children) {
                        $mLi.children('.sim-tree-spread').removeClass('hidden');
                    }
                } else if (text.indexOf(val) !== -1) {
                    if (parseInt($mLi.data('level')) !== 1) { // 不是顶级的需要展开父节点
                        this.expandNode(data[this.options.response.pid]);
                    }
                    $mLi.parents('li').add($mLi).show();
                    res.push($mLi);
                }
            }
            this.trigger('search', val);
            
        },
        // 展开某节点
        expandNode: function(id) {
            var $li = id.addClass ? id : this.$el.find('[data-id=' + id + ']');
            var data = $li.data('data');
            var pid = data[this.options.response.pid];
            var $spread = $li.children('.sim-tree-spread');
            var level = parseInt($li.data('level'));
            if (data.children && $spread.length) {
                $spread.removeClass('hidden');
                this.doSpread($spread, true);
            }
            if (level !== 1) {
                this.expandNode(pid);
            }
        },
        // 设置选中
        setSelected: function(id) {
            var self = this;
            var aId = id;
            var aData = [];
            var res = [];
            if (typeof(aId) === 'string' || typeof(aId) === 'number') {
                aId = [aId];
            }
            if (!$.isArray(aId)) {
                return;
            }
            if (!this.options.check) { // 单选
                aId = [aId[0]];
            }
            $.each(aId, function (index, id) {
                var $li = self.$el.find('[data-id=' + id + ']');
                var $a = $li.children('a');
                var $check = $a.children('.sim-tree-checkbox');
                var data = $li.data('data');
                if (!$li.length) {
                    return true;
                }
                if (!$check.length) { // 单选
                    $a.css('font-weight', 'bold');
                } else { // 多选
                    self.doCheck($a, true);
                }
                if (parseInt($li.data('level')) !== 1) { // 不是顶级的需要展开父节点
                    self.expandNode(data[self.options.response.pid]);
                }
                aData.push(data);
                res.push($li[0]);
            });
            self.sels = aData;
            self.trigger('click', aData);
        },
        // 获取选中值
        getSelected: function() {
            return this.sels;
        },
        // 树销毁
        destroy: function() {
            this.$el.html('');
            for (var key in this) {
                delete this[key]
            }
        },
        // 树刷新
        refresh: function(data) {
            this.$el.html('');
            this.render(data);
        }
    }
    window[name] = Class; 
});