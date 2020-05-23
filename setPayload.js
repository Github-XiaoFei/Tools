// get Browser Url
const browserUrl = location.host + location.pathname;
window.mcAsyncInit = function () {
  // get widget ID
  const pageID = document.querySelector('.fb_iframe_widget').getAttribute('page_id')
  const widgetElement = document.querySelectorAll('.mcwidget-overlay');
  // Judge popup widget or plugin widget
  for (let i = 0; widgetElement.length > i; i++) {
    if (widgetElement[i].innerText != '') {
      popupWidgetID = widgetElement[i].getAttribute('data-widget-id');
      MC.getWidget(popupWidgetID).setPayload("POPUP-Website_" + getSource())
    } else {
      pluginWidgetID = widgetElement[i].getAttribute('data-widget-id');
    }
  }


  // get iframe Src
  const iframeElement = document.querySelector('.mc-customerchat span > iframe')
  const iframeSrc = iframeElement.getAttribute('src');


  // MC API close widget
  // MC.getWidget(widgetID).close();

  // changer iframe src attribute and ref value
  const url = new URL(iframeSrc);
  const urlSearchValue = new URLSearchParams(url.search);
  const getRefValue = urlSearchValue.getAll('ref')[0];
  // changer iframe ref value
  urlSearchValue.set('ref', getRefValue + '--PLUGIN_PC_' + getSource());
  let newRefValue = url.origin + url.pathname + '?' + urlSearchValue.toString();
  // changer iframe src attribute
  iframeElement.setAttribute('src', newRefValue);


  // 非移动的不执行
  if (window.innerWidth > 1156) { return };
  // popup custom click 
  let popupFbSend = document.querySelector('.fb-send-to-messenger');
  let popupCustomClick = `<a id="popup-custom-click" class="custom-click" href="https://m.me/${pageID}?ref=w${popupWidgetID}--POPUP-Website_${getSource()}" target=_blank" style="display: inline-block;width:70%;height: 50px;position: absolute;left:55px;margin-top:-7px;z-index:999"></a>`;
  popupFbSend ? popupFbSend.insertAdjacentHTML('beforebegin', popupCustomClick) : '';

  // plugin custom click 
  let getFbRoot = document.getElementById("fb-root");
  let pluginCustomClick = `<a id="plugin-custom-click" class="custom-click" style="display:block; opacity: 0; z-index: 2147483647; bottom: 18pt; height: 45pt; position: fixed; right: 18pt; top: auto; width: 45pt;" href="https://m.me/${pageID}?ref=w${pluginWidgetID}--PLUGIN_MB_${getSource()}" target="_black"></a>`;
  getFbRoot ? getFbRoot.insertAdjacentHTML("afterbegin", pluginCustomClick) : '';

}


/**
* 来源分析
* @des 获取地址栏信息进行分析，存储&清除本地存储
* @returns  {string}
*/
function getSource() {
  let url = location.host + location.pathname;
  // 存储&清除 source  start
  let oneDay = 86400000;
  let sourceLS = localStorage.getItem("source");
  let sourceLink = location.search;

  if (sourceLink) {
    let sourceLinkStr = new URLSearchParams(sourceLink),
      gclid = (sourceLinkStr.has("gclid")) && !(sourceLinkStr.get("utm_source") == "YT") ? "gclid_" : "",
      fbclid = sourceLinkStr.has("fbclid") ? "fbclid_" : "",
      sourceFbAd = sourceLinkStr.get("utm_source") == "fb_ad_gf" ? "FbAd_" : "",
      sourceNum = sourceLinkStr.has("num") ? sourceLinkStr.get("num") + "_" : "",
      sourceGroup = sourceLinkStr.has("source") ? sourceLinkStr.get("source") + "_" : sourceLinkStr.has("utm_source") ? sourceLinkStr.get("utm_source") + "_" : "",
      sourceEmail = sourceLinkStr.get("utm_medium") == "email" ? "Email_" : "";

    let sourceValue =
      gclid + fbclid + sourceFbAd + sourceGroup + sourceNum + sourceEmail;
    if (sourceValue) {
      let sourceJSON = {
        source_value: sourceValue,
        url: url,
        time_stamp: this.timeStamp
      };
      localStorage.setItem("source", JSON.stringify(sourceJSON));
      sourceLS = localStorage.getItem("source");
    }
  }

  if (sourceLS) {
    let sourceJSON = JSON.parse(localStorage.getItem("source"));
    let timeStampLS = parseFloat(JSON.parse(sourceLS).time_stamp);
    this.timeStamp > timeStampLS + oneDay
      ? localStorage.removeItem("source")
      : (url = sourceJSON.source_value + sourceJSON.url + "___" + url);
  }
  // 存储&清除 source end
  return url;
}
