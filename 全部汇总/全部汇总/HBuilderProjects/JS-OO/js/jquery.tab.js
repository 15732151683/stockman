//为了避免与其他第三方类库变量名冲突,造成变量污染,添加作用域来防止该问题
((function($) {
	/*
	 *options: 外界设置的配置项  可选
	 * 
	 * */
	$.fn.tab = function(options) {
		//遍历JQ匹配到的所有元素
		return this.each(function() {
			new tab(this, options);
		})
	};
	var tab = function(obj, options) {
		var that = this;
		//如果参数2不给,下面是默认的配置项
		this.defaults = {
			type: "click",
			effect: "show",
			initital: 0,
			titleColor: 'gray',
			titleColorActive: "gold",
			title: ["菜菜1", "菜菜2", "菜菜3", "菜菜4"]
		};
		//配置项
		this.settings = $.extend({}, this.defaults, options); //{}内的键值对为 默认和配置项的总和
		this.navItems = $(obj).find(".tab-item");
		this.tabCon = $(obj).find(".tab-con");
		this.pages = $(obj).find(".tab-page");
		this.navItems.text(function(i) {
			return that.settings.titles[i];
		});
		this.navItems.eq(this.settings.initital).css("color", this.settings.titleColor).siblings().css("color", this.settings.titleColor);
		this.pages.eq(this.settings.initital).show().siblings().hide();
		this.navItems.on(this.settings.type, function() {
			that.switchPage($(this));
			return false;
		});
	}
	//原型中添加方法: 
	tab.prototype = {
		switchPage: function(_this) {
			var i = _this.index();
			_this.css("color", this.settings.titleColorActive).siblings().css("color", this.settings.titleColor);
			var effect = this.settings.effect;
			if(effect == "show") {
				this.pages.eq(i).show().siblings().hide();
			} else if(effect == "fade") {
				this.pages.eq(i).fadeIn().siblings().hide()
			}
		}
	};
})(jQuery));