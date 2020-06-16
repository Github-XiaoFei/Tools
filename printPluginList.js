if( location.pathname !== '/wp-admin/plugins.php' ){
  alert('🔔 你不在插件页面，请先进入到插件页面。再执行这个脚本。') ;
} else {

  var pluginList = $('#the-list');
  // 移除更新信息 排除统计数据时的干扰
  pluginList.find('tr[id*=update]').remove();

  var pluginListTr = $('#the-list tr');
  var pluginTitle = {};
  pluginTitle.desc = "下面列出来的是安装的所有插件，分为启用和没有启用两种。"
  pluginTitle.inactive = [];
  pluginTitle.inactive[0] = "没有启用👇";
  pluginTitle.line = '-----------------分割线------------------------';
  pluginTitle.active = [];
  pluginTitle.active[0] = "启用👇";
  for (let i = 0; i < pluginListTr.length; i++) {
    if ($(pluginListTr[i]).hasClass('inactive')) {
      pluginTitle.inactive.push($(pluginListTr[i]).find('td.plugin-title strong').text());
    } else if ($(pluginListTr[i]).hasClass('active')) {
      pluginTitle.active.push($(pluginListTr[i]).find('td.plugin-title strong').text());
    } else {
      console.log('未知元素');
    }
  }
  
  // 弹窗
  var html = `
  <div id="TB_overlay" class="TB_overlayBG"></div>
  <div id="TB_window" class="plugin-details-modal" role="dialog" aria-label="插件详情"
    style="width: 772px; height: auto; margin-left: -386px; top: 30px; margin-top: 0px; visibility: visible;">
    <div id="TB_title">
      <div id="TB_ajaxWindowTitle"></div>
      <div id="TB_closeAjaxWindow"><button type="button" id="TB_closeWindowButton"><span
            class="screen-reader-text">关闭</span><span class="tb-close-icon"></span></button></div>
    </div>
    <div><pre style="font-size:15px; max-height:700px">${JSON.stringify(pluginTitle, null, 4)}</pre></div>
  </>
  `
  // 弹窗插入到页面中
  document.querySelector('body').insertAdjacentHTML('beforeend', html);
  $('#TB_closeWindowButton').on('click', () => {
    $('#TB_overlay').remove();
    $('#TB_window').remove();
  })
  
}
