(function ($, win, undefined) {
    $.fn.extend({

        idbListWrap: function (config) {
            //整个菜单对象
            var objData = [];
            var selectId = $(this);
            var menuPathData = [];
            var result;
            var _navPath;
            var _rootID = '#' + selectId.attr('id');
            // selectId.attr('tabindex','-1');
            // alert(_rootID)

            function createMenu(d) {
                //创建主导航条的选项按钮
                selectId.empty();

                result = $('<div/>', {
                            'class': 'r_result',
                        })
                        .attr('tabindex','-1')
						.appendTo(_rootID);

                var UL_root = $('<ul/>', {
                                'style': 'clear:both;background:#008CD6;'
                            })
                            .attr('tabindex','-1')
                            .appendTo(_rootID);
                var liClassId = 'columnLi_start';

                result.next().hide();
                result.addClass( liClassId );
                result.addClass( "mainSelectEd" );

                $('<i/>',{'class':'icon_i'}).appendTo( result );

                if (_navPath != undefined) {
                    _navPath.remove();
                    _navPath = null;
                }
                _navPath = $('<div/>', {
                    'class': 'navPath'
                });
                _navPath.insertAfter(result);
                
                for(var i=0; i<d.length;i++){
                    if(d[i].URL != null){
                        _navPath.html( d[i].Name ).css('color','#008CD6');
                        break;
                    }
                }

                for (var i in d) {
                    //第一层导航选项
                    switch(d[i].Id){
                        case '0':
                            liClassId='columnLi_start';
                            break;
                        case '1': 
                            liClassId = 'columnLi_1';
                            break;
                        case '2': 
                            liClassId = 'columnLi_2';
                            break;
                        case '3': 
                            liClassId = 'columnLi_3';
                            break;
                        default:
                            //alert("Create Menu Item Id Error");
                            console.log("Create Menu Item Id Error");
                            break;
                    }

                    UL_root.append($('<li class="'+ liClassId +' columnLi">').html('<b>' + isURL(d[i]) + '</b>' + drawListDiv(d[i][config.jsonData])));
                };

                var liGroup = UL_root.find("li");
                var hasDisplay = true;
                for (var i = 0; i < liGroup.length; i++) {

                    var _liChild = liGroup.eq(i).children();

                    if (_liChild.length && !_liChild.hasClass('.r_subMenuList2')) {
                        liGroup.eq(i).bind({
                            mouseenter: function (e) {
                                returnByChildren($(e.target));
                                UL_root.unbind();
                            },
                            mouseleave: function (e) {
                                UL_root.bind('focusout', function (e) {
                                    UL_root.css('display', 'none');
                                    // UL_root.children().eq(2).css('display', 'none');
                                    e.stopPropagation();
                                })
                            }
                        }).bind('click', function (e) {
                            var _int = parseInt($(e.target).attr("dataIndex"));
                            menuPathData = [];
                            returnDataArray([], objData[_int], d);
                            if (menuPathData.length == 0) return;

                            var _inx = $(this).parents(_rootID + '> ul > li').index();
                            var _txt = $(this).parents(_rootID + ':eq(0) > ul').children('li:eq(' + _inx + ')').children('b').text();
                            var _rsClass = $(this).parents(_rootID + ':eq(0) > ul').children('li:eq(' + _inx + ')').attr('class');
                            // result.removeClass().addClass('r_result ' + _rsClass).html('');
                            result.removeClass().addClass('r_result mainSelectEd ' + _rsClass).removeClass("columnLi").html('');

                            selectId.children().next().hide();
                            hasDisplay = false;
                            e.stopPropagation();
                            if (config.itemClickCallBack != undefined) {
                                config.itemClickCallBack(menuPathData);
                            }
                            _navPath.empty();
                            for (var i = 0; i < menuPathData.length; i++) {
                                var _s = menuPathData[i].Name;
                                if( i == (menuPathData.length - 1) ){
                                    $('<p/>').html( _s ).appendTo(_navPath );
                                } else {
                                    $('<p/>',{'class':'gray'}).html( _s + ' > ' ).appendTo(_navPath );
                                }
                            }
                            _navPath.show();
                            $('<i/>',{'class':'icon_i'}).appendTo( result );
                        });
                    }
                };

                result.bind({
                    'click': function () {
                        UL_root.css('display', 'block');
                        // selectId.trigger('focus');
                        UL_root.trigger('focus');
                    }
                });

            };

            function returnDataArray(_rda, clickItem, _data) {
                var copy = [];
                copy = clone(_rda);

                for (var d in _data) {
                    _rda = clone(copy);
                    if (clickItem == _data[d]) {
                        _rda.push(_data[d]);
                        menuPathData = clone(_rda);
                        return true;
                    } else {
                        if (_data[d][config.jsonData] != 'null') {
                            _rda.push(_data[d]);
                            if (returnDataArray(_rda, clickItem, _data[d][config.jsonData])) {
                                return true;
                            } else {
                                _rda = _rda.pop();
                            }
                        }
                    }
                };
            };

            function isURL(_data) {
                // 判断有没有url链接
                if (_data.URL != null) {
                    var html = "<a href=" + config.isUrl(_data.URL) + " class='js-pjax' dataIndex=" + objData.length + ">" + _data[config.jsonName] + "</a>";
                    pushData(_data);
                    return html;
                } else {
                    return _data[config.jsonName];
                }
            }

            function pushData(_d) {
                //存储有URL的数据
                objData.push(_d);
            }

            function returnByChildren(e) {
                //处理菜单
                var _left, _top, $_self;

                $_self = e;
                _left = $_self.innerWidth();
                _top  = $_self.position().top;

                $_self.children().next().css({
                    'position': 'absolute', 
                    'left': _left + 'px',
                    'top': _top + 'px',
                    'display': 'block'
                });

                $_self.mouseleave(function () {
                    hideDom($_self);
                });
            }

            function hideDom(_h) {
                _h.children().next().hide();
            }

            function drawListDiv(smD) {
                //下拉子菜单的HTML

                if (smD == null) return "";

                var subMenuHtml = '';
                subMenuHtml += '<div class="r_subMenuList2"><ul>';
                for (var i = 0; i < smD.length; i++) {
                    subMenuHtml += '<li>' + '<b>' + isURL(smD[i]) + '</b>';
                    if (smD[i][config.jsonData] != null) {
                        subMenuHtml += drawListDiv(smD[i][config.jsonData]);
                    }
                    subMenuHtml += '</li>';
                };
                subMenuHtml += '</ul></div>';
                return subMenuHtml;
            }

            function clone(obj) {
                // Handle the 3 simple types, and null or undefined
                if (null == obj || "object" != typeof obj) return obj;

                // Handle Date
                if (obj instanceof Date) {
                    var copy = new Date();
                    copy.setTime(obj.getTime());
                    return copy;
                }

                // Handle Array
                if (obj instanceof Array) {
                    var copy = [];
                    for (var i = 0; i < obj.length; i++) {
                        copy[i] = clone(obj[i]);
                    }
                    return copy;
                }

                // Handle Object
                if (obj instanceof Object) {
                    var copy = {};
                    for (var attr in obj) {
                        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
                    }
                    return copy;
                }

                throw new Error("Unable to copy obj! Its type isn't supported.");
            };

            this.setData = function(d) {
                //处理传入的JSON数据
                createMenu(d);
            };

            this.SetMenuInfo = function(url){
                var $links = $('.js-pjax');
                if ($links.length == 0) { return; }
                var stack = [];
                var $a = null;
                $links.each(function ()
                {
                    var $tmp = null;
                    $tmp=$(this);
                    if ($tmp.attr('href') == url)
                    {
                        $a = $tmp;
                        stack.push($tmp.html());
                        return true;
                    }
                });
                if (stack.length == 0) { return null; }
                var $li = $a.parents('.columnLi');
                var $p = $li.find('b');
                for (var i = $p.length-1; i >=0 ; i--) {
                    if ($($p[i]).find('a').length == 0) {
                        stack.push($p[i].innerHTML);
                    }
                };

                //var $target = $('.navPath');
                var $target = _navPath;
                if ($target.length == 0) {
                    $target=$('<div>',{"class":"navPath"});
                    $target.insertAfter($('.mainSelectEd'));
                };

                $target.empty();
                for (var i = stack.length-1; i >= 0; i--)
                {
                    if (i == 0)
                    {
                        $target.append('<p>' + stack[i] + '</p>');
                    } else
                    {
                        $target.append('<p class="gray">' + stack[i] + ' > </p>');
                    }
                }
                document.title = stack[0];
            }

            return this;
        }
    });
})(jQuery, window)