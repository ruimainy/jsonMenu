jsonMenu
========
使用方法：

      var config = {
                  jsonData: 'SubMenu', <br/>
                  jsonName: 'Name',
                  itemClickCallBack: menuItemClick,  // 调用外部方法
                  isUrl: UrlContent // 调用外部方法
            };
            $('#menu_root').idbListWrap(config);

            function menuItemClick(itemsData) {
                  var clickedItem = itemsData[itemsData.length - 1];
                  document.title = clickedItem.Name;
            };

            function UrlContent(path) {
                  return path.replace(/^\//, '');
            };

      // 菜单列表的链接地址，修改idb.json.js文件的URL内容。
      // 即返回的JSON数据的URL值就是链接地址。


      idb.menu.js有二个公共方法：
      1、this.setData: //处理传入的JSON数据
      2、this.SetMenuInfo: 处理点击的选项的路径
