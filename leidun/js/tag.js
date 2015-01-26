(function($,undefined){
    $.Tag = function(options,element){
        this.$el = $(element) ;   // the div or ul which to be slided
        this._init(options);

    };
    $.Tag.defaults ={
        nav : null,        // the nav element
        content: null,         // the content element
        isAnimate:false,         // play or not
        time:5000 ,             // if play time
        navItem:"li",
        contentItem:"li",
        event:"click",        // the event target
        isLeftRight:false ,
        leftArrow:null,
        rightArrow:null,
        navShowNum: 6,
		cur_css: "on"
    };
    $.Tag.prototype = {
        _init  :function(options){
            this.options = $.extend(true,{}, $.Tag.defaults,options);

            this.$nav = this.$el.find(this.options.nav).find("ul:first");   
            this.$content = this.$el.find(this.options.content);

            this.$navItem = this.$nav.find(this.options.navItem);
            this.$contentItem = this.$content.find(this.options.contentItem);
            this.current = 0;
            this.length = this.$navItem.length;
			this.addClassName = this.options.cur_css;
            this._tagEvents();

            if(this.options.isLeftRight){
                this.$leArr = $(this.options.leftArrow);
                this.$riArr = $(this.options.rightArrow);
                this.leftPx = 0;
                this.leftest = 0;  //左边边界值
                this.rightest = this.options.navShowNum - 1;
                this.navItemWidth = this.$navItem.eq(0).outerWidth(true);
                this._lrEvent();
            }

            if(this.options.isAnimate){
                this.isSwitch = this.options.isAnimate;
                this._autoEvent();
            }
        },
        _addClass:function(i,className){
            this.$contentItem.removeClass(className);
            this.$contentItem.eq(i).addClass(className);
            this.$navItem.removeClass(className);
            this.$navItem.eq(i).addClass(className);
        },
        _tagEvents:function(){
            var _self = this, i,that;
            for(i=0;i<_self.length;i++){
                _self.$navItem.eq(i).on(_self.options.event,{num:i},function(event){
                    if(_self.isSwitch){
                        clearInterval(_self.interFun);
                    }
                    that = _self.$navItem.eq(event.data.num);
                    _self._addClass(event.data.num,_self.addClassName);
                    _self.current = event.data.num;
                    return false;
                });
                _self.$navItem.eq(i).on("mouseleave",{num:i},function(event){
                    if(_self.isSwitch){
                        _self._autoEvent();
                    }
                    return false;
                });
            }
        },
        toRight:function(){
            var _self = this,last_px;
            if(_self.current > _self.length - 1){
                _self.current = 0;
                last_px = 0;
                _self.leftPx = last_px;
                _self.leftest = 0;
                _self.rightest = _self.options.navShowNum - 1;
                _self._addClass(_self.current,_self.addClassName);
                _self.$nav.animate({left:last_px + 'px'}, 'slow');
                return false;
            }

            else if((_self.current - 1)==_self.rightest){
                last_px = _self.leftPx - _self.navItemWidth;
                _self._addClass(_self.current,_self.addClassName);
                _self.$nav.animate({left:last_px + 'px'}, 'slow');
                _self.leftPx = last_px;
                _self.leftest = _self.leftest + 1;
                _self.rightest = _self.rightest + 1;
                return false;
            }
            else{
                _self._addClass(_self.current,_self.addClassName);
                return false;
            }
        },
        _lrEvent:function(){
            var _self = this,last_px;
            this.$leArr.click(function(){
                clearInterval(_self.interFun);
                _self.current = _self.current - 1;
                if(_self.current < 0){
                    _self.current = _self.length - 1;
                    last_px = _self.leftPx - _self.navItemWidth * (_self.length - _self.options.navShowNum);
                    _self.leftPx = last_px;
                    _self.leftest = _self.length - _self.options.navShowNum;
                    _self.rightest = _self.length - 1;
                    _self._addClass(_self.current,_self.addClassName);
                    _self.$nav.animate({left:last_px + 'px'}, 'slow');
                }
                else if( (_self.current + 1)==_self.leftest){
                    last_px = _self.leftPx + _self.navItemWidth;
                    _self._addClass(_self.current,_self.addClassName);
                    _self.$nav.animate({left:last_px + 'px'}, 'slow');
                    _self.leftPx = last_px;
                    _self.leftest = _self.leftest - 1;
                    _self.rightest = _self.rightest - 1;
                }
                else{
                    _self._addClass(_self.current,_self.addClassName);
                }
                _self._autoEvent();
                return false;

            });

            this.$riArr.click(function(){
                clearInterval(_self.interFun);
                _self.current = _self.current + 1;
                _self.toRight();
                _self._autoEvent();
                return false;
            });

        },

        _autoEvent:function(){
            var _self = this;
            _self.interFun = setInterval(function(){
                    _self.current = _self.current + 1;            
                    _self.toRight();
            },this.options.time);
        }

    };
    var logError 			= function( message ) {
        if ( this.console ) {
            console.error( message );
        }
    };

    $.fn.tag = function(options){
        if ( typeof options === 'string' ) {

            var args = Array.prototype.slice.call( arguments, 1 );

            this.each(function() {

                var instance = $.data( this, 'tag' );

                if ( !instance ) {
                    logError( "cannot call methods on gallery prior to initialization; " +
                        "attempted to call method '" + options + "'" );
                    return;
                }

                if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
                    logError( "no such method '" + options + "' for gallery instance" );
                    return;
                }

                instance[ options ].apply( instance, args );

            });

        }
        else {

            this.each(function() {

                var instance = $.data( this, 'tag' );
                if ( !instance ) {
                    $.data( this, 'tag', new $.Tag( options, this ) );
                }
            });

        }

        return this;
    };
})(jQuery);