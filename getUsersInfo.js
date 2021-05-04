var FBID = location.pathname.split('/')[1];
var referrer = '';
var widgetJSON = [];
var aUsersId = [];
var saveUsersInfo = [];
var widgetHTML = "";
var usersListHTML = "";
var index = 1;
var limiter = false;
var assignment = [];
var userThreadNote = [];
var dateRange = Date.now() - (86400000 * 15);
var usersInfoBox = document.querySelector("nav.p-b-sm > ul:nth-child(2)");
// 上传的数据格式 主要是value定义了小部件的值
var dataUp = {
  q: "",
  filter: {
    operator: "AND",
    groups: [
      {
        operator: "AND",
        items: [
          {
            _oid: "",
            type: "widget",
            field: "widget",
            operator: "IS",
            value: 000000
          }
        ]
      }
    ]
  }
};

/**
 * 获取小部件的信息，生成工具
 * @func
 */
function getWidgetValue() {
  fetch("https://manychat.com/" + FBID + "/subscribers/segments", {
    method: "GET",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
      "Content-Type": "application/json"
    },
    referrer: referrer
  })
    .then(response => response.json())
    .then(data => {

      
      if (data.state) {
        data.segments.map(segment => {
          if ((segment.type === "widget" || segment.type === "tag") && segment.active) {
            widgetJSON.push({
              type: segment.type,
              label: segment.label,
              value: segment.value,
              count: segment.count
            });
          }
        });
      }

      // 处理 widgetJSON 生成 HTML
      for (let a in widgetJSON) {
        aUsersId.push([]);
        if (a == 0) {
          widgetHTML += `
          <tr id="allUser-0" style="background-color: #ffeeba78"}>
              <th scope="row">${a}</th>
              <td>全部用户</td>
              <td>xxxxx</td>
              <td>
                  <select id="data-select" class="form-control form-control-sm" style="width: 100px;">
                      <option value="7" selected>7天</option>
                      <option value="15">15天</option>
                      <option value="31">1个月</option>
                      <option value="62">3个月</option>
                      <option value="186">6个月</option>
                      <option value="3650">全部</option>
                      <option value="0" id="custom">自定义</option>
                  </select>
              </td>
              <td id="get-Btn-Box"><button id="get-Btn-${a}" type="button" class="btn btn-primary btn-sm" onclick="getUsersId('', '', ${a}, dataSelect('allUser-0'), 'allUser' )">开始</button></td>
              <td><button style="pointer-events:none" id="print-Btn-${a}"  type="button" class="btn btn-secondary btn-sm disabled" onclick="loopUserInfo(aUsersId[${a}], ${a})">等待</button></td>
          </tr>
          `;
        } else {
          widgetHTML += `
            <tr id="${widgetJSON[a].type + '-' + a}" ${widgetJSON[a].type === "tag" ? 'style="background-color: #cce5ff78"' : 'style="background-color: #d4edda78"'}>
                <th scope="row">${a}</th>
                <td>
                    ${widgetJSON[a].label}
                    <span class="badge ${widgetJSON[a].type === "tag" ? 'badge-primary' : 'badge-success'} ">${widgetJSON[a].type}</span>
                </td>
                <td>${widgetJSON[a].count}</td>
                <td>
                    <select id="data-select" class="form-control form-control-sm" style="width: 100px;">
                        <option value="7" selected>7天</option>
                        <option value="15">15天</option>
                        <option value="31">1个月</option>
                        <option value="62">3个月</option>
                        <option value="186">6个月</option>
                        <option value="3650">全部</option>
                        <option value="0" id="custom">自定义</option>
                    </select>
                </td>
                <td id="get-Btn-Box"><button id="get-Btn-${a}" type="button" class="btn btn-primary btn-sm" onclick="getUsersId(${widgetJSON[a].value}, '', ${a}, dataSelect('${widgetJSON[a].type + "-" + a}'), '${widgetJSON[a].type}' )">开始</button></td>
                <td><button style="pointer-events:none" id="print-Btn-${a}"  type="button" class="btn btn-secondary btn-sm disabled" onclick="loopUserInfo(aUsersId[${a}], ${a})">等待</button></td>
            </tr>
            `;
        }

      }
      // 调用 innerHTML 插入HTML
      innerHTML();
      // 调用 customData 创建控制表头
      customData();
    });
}

// Users Info 按钮生成 并插入到侧边栏
let usersInfoHtml = `
  <li id="get-users-info">
      <a data-test-id="nav-link-nav-templates" onclick="getWidgetValue()"
          class="_15e2f103080b1d4cb0129cea4047bb9b-styl" href="#">
          <div class="row middle e3ec2c7d34e054615a96722234ecfba9-styl">
              <div class="text-center _51bcde9071f1c948184e887cbd4dcdc8-styl col" data-title-at="right"
                  data-title-delay="0" style="flex: 0 0 64px; width: 64px; max-width: 64px;"><i class="i-info"></i>
              </div>
              <div class="p-r-sm col"><span class="d7326ff5c53e2b7cdafaca74be622b7e-styl">Users Info</span></div>
          </div>
      </a>
  </li>
  `
usersInfoBox.insertAdjacentHTML('afterbegin', usersInfoHtml);


/**
 * 返回 option 下拉列表中的 value
 * @param {string} widget 小部件列表的id名称
 * @returns {string}
 */
function dataSelect(widget) {
  let dataSelect = document.querySelector(`#${widget} #data-select`);
  let dataSelectValue = dataSelect.options[dataSelect.selectedIndex].value;
  return dataSelectValue;
}

/**
 * 给控制表头显示板块添加 onchange 事件
 */
function customData() {
  let dataSelectBox = document.querySelectorAll('#widget tbody tr');
  for (let i = 0; i < dataSelectBox.length; i++) {
    let dataSelect = dataSelectBox[i].querySelector('#data-select');
    dataSelect.onchange = () => {
      let dataSelectText = dataSelect.options[dataSelect.selectedIndex].text;
      let dataSelectValue = dataSelect.options[dataSelect.selectedIndex].value;
      // 判断是否是 自定义 
      if (dataSelectText == '自定义') {
        // 弹出询问框，输入天数
        result = window.prompt('👋请输入想要的天数。');
        if (result && !(isNaN(parseFloat(result)))) {
          result = parseFloat(result).toFixed();
          dataSelect.options[dataSelect.selectedIndex].value = result;
          dataSelectValue = result;
        } else {
          alert('🔔你没有输入任何内容，自定义日期为空。');
          dataSelect.firstElementChild.selected = true; // 选中第一个option
          dataSelectValue = dataSelect.firstElementChild.value;
        }
      }
      dataSelect.title = dataSelectValue + "天";
      // 获取数据和输出数据 按钮重置
      let oGetBtn = document.querySelector(`#get-Btn-${i}`);
      let oPintBtn = document.querySelector(`#print-Btn-${i}`);
      oGetBtn.innerText = '开始';
      oGetBtn.classList.add('btn-primary');
      oGetBtn.classList.remove('disabled', 'btn-success');
      oGetBtn.style.pointerEvents = '';
      oPintBtn.innerText = '等待';
      oPintBtn.classList.add('disabled', 'btn-secondary');
      oPintBtn.classList.remove('btn-success', 'btn-warning');
      init();
    }
  }

}

/**
 * 插入自定义的HTML结构
 */
function innerHTML() {
  var getBootstrap =
    `<style>
            .img-box{
                width: 50px; 
                height: 50px;
                min-width: 50px;
                min-height: 50px;
                padding: 2px!important;
            }
            .img-box img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
            }
            .row {
                margin-right: unset!important;
                margin-left: unset!important;
            }
            .col {
                padding-right: unset!important;
                padding-left: unset!important;
            }

            #widget .row,
            #usersList .row {
                margin-right: -15px!important;
                margin-left: -15px!important;
            }
            #widget .col,
            #usersList .col {
                padding-right: -15px!important;
                padding-left: -15px!important;
            }
        </style>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
        `;
  var widgetList = `
        <div id="widget" class="container" style="margin-bottom:20px">
            <div class="row">
                <div class="col-9">
                <p>
                    <button id="widgetBtn" class="btn btn-success btn-sm" onclick="hid(this,'widget')">隐藏小部件(Widgets)</button>
                    <button id="tagBtn" class="btn btn-primary btn-sm" onclick="hid(this,'tag')">隐藏标签(Tags)</button>
                </p>
                    <table class="table">
                        <thead class="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">名称</th>
                            <th scope="col">用户总数</th>
                            <th scope="col">日期范围</th>
                            <th scope="col">获取数据</th>
                            <th scope="col">输出数据</th>
                        </tr>
                        </thead>
                        <tbody>
                            ${widgetHTML}
                        </tbody>
                    </table>
                    <form class="form-inline p-3 mb-2 bg-light text-dark " id="form">
                        <h6 class="w-100 text-left font-weight-bold text-muted">控制表头显示</h6>
                        <div class="custom-control custom-checkbox my-1 mr-sm-2">
                            <input checked type="checkbox" disabled class="custom-control-input" id="my_avatar">
                            <label class="custom-control-label" for="my_avatar">头像</label>
                        </div>
                        <div class="custom-control custom-checkbox my-1 mr-sm-2">
                            <input checked type="checkbox" disabled class="custom-control-input" id="my_name">
                            <label class="custom-control-label" for="my_name">姓名</label>
                        </div>
                        <div class="custom-control custom-checkbox my-1 mr-sm-2">
                            <input checked type="checkbox" disabled class="custom-control-input" id="my_gender">
                            <label class="custom-control-label" for="my_gender">性别</label>
                        </div>
                        <div class="custom-control custom-checkbox my-1 mr-sm-2">
                            <input  type="checkbox" disabled class="custom-control-input" id="my_raw_ts_added">
                            <label class="custom-control-label" for="my_raw_ts_added">订阅时间</label>
                        </div>
                        <div class="custom-control custom-checkbox my-1 mr-sm-2">
                            <input  type="checkbox" disabled class="custom-control-input" id="my_locale">
                            <label class="custom-control-label" for="my_locale">地区</label>
                        </div>
                        <div class="custom-control custom-checkbox my-1 mr-sm-2">
                            <input  type="checkbox" disabled class="custom-control-input" id="my_language">
                            <label class="custom-control-label" for="my_language">语言</label>
                        </div>
                        <div class="custom-control custom-checkbox my-1 mr-sm-2">
                            <input checked type="checkbox" disabled class="custom-control-input" id="my_widgets">
                            <label class="custom-control-label" for="my_widgets">来源渠道</label>
                        </div>
                        <div class="custom-control custom-checkbox my-1 mr-sm-2">
                            <input checked type="checkbox" disabled class="custom-control-input" id="my_fields">
                            <label class="custom-control-label" for="my_fields">来源值</label>
                        </div>
                        <div class="custom-control custom-checkbox my-1 mr-sm-2">
                            <input  type="checkbox" disabled class="custom-control-input" id="my_assignment">
                            <label class="custom-control-label" for="my_assignment">跟进人员</label>
                        </div>
                        <div class="custom-control custom-checkbox my-1 mr-sm-2">
                            <input  type="checkbox" disabled class="custom-control-input" id="my_tags">
                            <label class="custom-control-label" for="my_tags">标签</label>
                        </div>
                        <div class="custom-control custom-checkbox my-1 mr-sm-2">
                            <input  type="checkbox" disabled class="custom-control-input" id="my_userThreadNote">
                            <label class="custom-control-label" for="my_userThreadNote">笔记</label>
                        </div>
                    </form>

                    <div id="progress-box" class="progress d-none">
                      <div id="progress" class="progress-bar" role="progressbar"></div>
                    </div>
                   
                </div>
                <div class="col-3">
                    <ul class="list-group">
                      <li class="list-group-item active">使用说明</li>
                      <li class="list-group-item">1. 点击“获取”列的“开始”按钮，等待约2秒；</li>
                      <li class="list-group-item">2. 点击“输出”列按钮输出数据，等待进度完成；</li>
                      <li class="list-group-item">3. 输出数据后，可以把数据复制到 Google sheet 进一步操作；</li>
                      <li class="list-group-item list-group-item-warning">4. 操作中请不要刷新页面，如误操作请重复1~3步。</li>
                      <li class="list-group-item list-group-item-danger font-weight-bold"><a href="https://docs.google.com/forms/d/e/1FAIpQLScufPuLEoJiNqFPDuZXXp2WtBpdSsEy0cF3n6n9eu0fGc9nnA/viewform?usp=sf_link" target="_blank" >✉ 章鱼铃铛问题反馈表</a></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
  var usersList = `
        <div id="usersList" class="container d-none" style="max-width: 98%;">
        <div class="row">
            <div class="col-xl">
                <table class="table table-hover">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col" class="my_avatar">头像</th>
                            <th scope="col" class="my_name" colspan="2">姓名</th>
                            <th scope="col" class="my_gender">性别</th>
                            <th scope="col" class="my_raw_ts_added d-none">订阅时间</th>
                            <th scope="col" class="my_locale d-none">地区</th>
                            <th scope="col" class="my_language d-none">语言</th>
                            <th scope="col" class="my_widgets" colspan="2">来源渠道</th>
                            <th scope="col" class="my_fields" colspan="3">来源值</th>
                            <th scope="col" class="my_assignment d-none">跟进人员</th>
                            <th scope="col" class="my_tags d-none">标签</th> 
                            <th scope="col" class="my_userThreadNote d-none" colspan="3">笔记</th> 
                        </tr>
                    </thead>
                    <tbody id="usersListBody"> </tbody>
                </table>
            </div>
        </div>
    </div>
    `;
  document.querySelectorAll("#appContent")[0].innerHTML = getBootstrap + widgetList + usersList;
  widgetJSON.length = '';
  widgetHTML = '';
}

/**
 * 插入最终生成的 UserList
 */
function innerUserListHTML() {
  let oUsersListBody = document.querySelector("#usersListBody");
  oUsersListBody.innerHTML = usersListHTML;
  formCheckBox('');
  init();
}

/**
 * 表头控制 checkbox 检测 添加 onchange 事件，控制table显隐效果
 * 返回 name id 元素对应的 checkbox 状态
 * @param {string} name 元素的id值
 * @returns {boolean} checkbox checked 状态
 */
function formCheckBox(name) {
  let checkBox = document.querySelector('#form').querySelectorAll('input[type="checkbox"]');
  for (let i = 0; i < checkBox.length; i++) {
    if (name) {
      if (checkBox[i].id == name) {
        return checkBox[i].checked
      }
    } else {
      checkBox[i].removeAttribute('disabled');
      checkBox[i].onchange = (ev) => {
        let getClass = document.querySelectorAll(`.${ev.target.id}`);
        if (ev.target.checked) {
          for (let i = 0; i < getClass.length; i++) {
            getClass[i].classList.remove('d-none')
          }
        } else {
          for (let i = 0; i < getClass.length; i++) {
            getClass[i].classList.add('d-none')
          }
        }
      }
    }


  }
}


/**
 * 获取用户信息并把 user_id 保存到 aUsersId 数组中
 * @param {number} value 小部件的 value 值
 * @param {number} limiterValue 每次传回40个 超过40个将传回 极限值 便于下一次继续请求
 * @param {number} index 小部件的索引值
 * @param {number} dateRange 日期范围 天数
 */
function getUsersId(value, limiterValue, index, dateRange, type) {
  // 保存小部件值、索引值和日期范围 便于下一次循环使用
  let valueS = value;
  let indexS = index;
  let dateRangeS = dateRange;
  let typeS = type;
  let dateRangeOnOff = true;
  if (typeS == 'allUser') {
    dataUp = { "q": "" };
  } else {
    // 上传数据的 value 赋值为小部件的 value
    dataUp.filter.groups[0].items[0].type = type;
    dataUp.filter.groups[0].items[0].field = type;
    dataUp.filter.groups[0].items[0].value = value;    
  }

  fetch(
    `https://manychat.com/${FBID}/subscribers/search${limiterValue}`,
    {
      method: "POST", // or 'PUT'
      body: JSON.stringify(dataUp), // data can be `string` or {object}!
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      referrer: referrer
    }
  )
    .then(response => response.json())
    .then(data => {
      if (data.state) {
        limiter = data.limiter;
        // 如果不是有极限值 清空数组
        limiterValue ? '' : aUsersId[indexS].length = 0;
        data.users.map(user => {
          // 如果大于指定日期范围的用户 不把id保存到数组中
          if (!(Math.trunc(user.raw_ts_added / 1000) >= Date.now() - (86400000 * dateRange))) {
            dateRangeOnOff = false;
            return
          };
          aUsersId[indexS].push(user.user_id);
        });
        // 如果有极限值，递归
        if (dateRangeOnOff && limiter) {
          getUsersId(valueS, "?limiter=" + limiter, indexS, dateRangeS, typeS);
        }
      }

    });
  // 设置定时器 延迟操作 并判断是否有数据
  if (limiterValue == '') {
    setTimeout(() => {
      if (aUsersId[indexS].length == 0) {
        alert('🔔没有获取到数据，可能是此日期范围内没有数据，请重新选择一个新的日期。')
      } else {
        let oGetBtn = document.querySelector(`#get-Btn-${index}`);
        let oPintBtn = document.querySelector(`#print-Btn-${index}`);
        oGetBtn.innerText = `完成 有${aUsersId[indexS].length}人`;
        oGetBtn.classList.remove('btn-primary');
        oGetBtn.classList.add('disabled', 'btn-success');
        oGetBtn.style.pointerEvents = 'none';
        oPintBtn.innerText = '开始';
        oPintBtn.style.pointerEvents = '';
        oPintBtn.classList.remove('disabled', 'btn-secondary', 'btn-warning');
        oPintBtn.classList.add('btn-success');
      }
    }, 10000)
  }


}

function hid(item, value) {
  let oSub = document.querySelectorAll(`tr[id*=${value}-]`);
  for (let i = 0; i < oSub.length; i++) {
    if (oSub[i].classList == 'd-none') {
      oSub[i].classList.remove('d-none');
    } else {
      oSub[i].classList.add('d-none');
    }
  }
  if (value == "tag") {
    return item.innerHTML = item.innerHTML == "隐藏标签(Tags)" ? "显示标签(Tags)" : "隐藏标签(Tags)";
  } else if (value == "widget") {
    return item.innerHTML = item.innerHTML == "隐藏小部件(Widgets)" ? "显示小部件(Widgets)" : "隐藏小部件(Widgets)";
  }
}

/**
 * 逐个循环 user_id
 * @param {Aarray} arr 传入保存的 user_id
 * @param {number} index 小部件的索引值
 */
function loopUserInfo(arr, index) {
  let oGetBtn = document.querySelector(`#get-Btn-${index}`);
  let oPintBtn = document.querySelector(`#print-Btn-${index}`);
  // 如果数组为空 提示重新获取
  if (arr.length == 0) {
    result = window.confirm('🔔数据已经输出，你想重新获取吗？');
    if (result) {
      oGetBtn.innerText = '开始';
      oGetBtn.classList.add('btn-primary');
      oGetBtn.classList.remove('disabled', 'btn-success');
      oGetBtn.style.pointerEvents = '';
      oPintBtn.innerText = '等待';
      oPintBtn.classList.add('disabled', 'btn-secondary');
      oPintBtn.classList.remove('btn-success', 'btn-warning');
      init();
    }
    return;
  }

  // 预先获取到 “笔记”和“跟进人员”信息
  arr.map(i => {
    getUserThreadNote(i, '');
    getAssignment(i)
  });

  // 保存数组信息和进度条信息
  let per = 0;
  let i = 0;
  let length = arr.length;
  let oProgressBox = document.querySelector('#progress-box');
  let oProgress = document.querySelector('#progress');
  let oUsersList = document.querySelector('#usersList');
  let oUsersListBody = document.querySelector("#usersListBody");
  oProgressBox.classList.remove('d-none');
  oUsersList.classList.add('d-none');
  oUsersListBody.innerHTML = '';
  oPintBtn.style.pointerEvents = 'none';

  // 进度条进度控制和 
  function progressBox() {
    per = parseInt(i / length * 100);
    oProgress.style.width = `${per}%`;
    oProgress.setAttribute('aria-valuenow', per);
    oProgress.setAttribute('aria-valuemin', 0);
    oProgress.setAttribute('aria-valuemax', length);
    oProgress.innerText = `${per}%`;
  }

  // 请求用户详细数据 定时器控制传入 user_id 的速率
  let foot = setInterval(() => {
    if (i < length) {
      // 获取单个用户的详细信息，重组用户信息
      getUserInfo(arr[i]);
      progressBox();
    } else {
      oUsersList.classList.remove('d-none');
      oPintBtn.innerText = '完成&重新开始';
      oPintBtn.style.pointerEvents = '';
      oPintBtn.classList.remove('btn-success');
      oPintBtn.classList.add('btn-warning');
      progressBox();
      // 把重组后的用户信息传入到 saveUsersInfoFun 中
      saveUsersInfoFun(saveUsersInfo, index);
      clearInterval(foot);
    }
    i++;
  }, 900)

}

// 初始化
function init() {
  // aUsersId.length = 0;
  saveUsersInfo.length = 0;
  userThreadNote.length = 0;
  assignment.length = 0;
  index = 1;
  usersListHTML = '';
  let oProgressBox = document.querySelector('#progress-box');
  oProgressBox.classList.add('d-none');
}

/**
 * 获取单个用户的详细信息，重组用户信息，保存到 saveUsersInfo
 * @param {number} userId 单个 user_id
 */
function getUserInfo(userId) {
  if (userId == '') return false;
  fetch(
    "https://manychat.com/" + FBID + "/subscribers/details?user_id=" +
    userId,
    {
      method: "GET",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
        "Content-Type": "application/json"
      },
      referrer: referrer
    }
  )
    .then(response => response.json())
    .then(uI => {
      if (uI.state) {
        saveUsersInfo.push({
          num: index++,
          user_id: uI.user.user_id,
          name: uI.user.name,
          avatar: uI.user.avatar,
          raw_ts_added: uI.user.raw_ts_added,
          gender: uI.user.gender,
          locale: uI.user.locale,
          language: uI.user.language,
          widgets: uI.user.widgets.map(i => i.tag_name),
          fields: uI.user.fields.map(i => i.value),
          tags: uI.user.tags.map(i => i.tag_name)
        });
      }
    });
}

/**
 * 获取 assignment（分配） 的值
 * @param {number} userId  单个 user_id
 * @returns {string} 返回字符串
 */
function getAssignment(userId) {
  if (userId == '') return false;
  fetch(
    "https://manychat.com/" + FBID + "/im/loadThread?user_id=" + userId,
    {
      method: "GET",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
        "Content-Type": "application/json"
      },
      referrer: referrer
    }
  )
    .then(response => response.json())
    .then(uI => {
      if (uI.state) {
        assignment.push({
          user_id: uI.thread.user_id,
          value: uI.thread.assignment ? uI.thread.assignment.name : '',
        })
      }
    });
}

/**
 * 获取笔记
 * @param {string} userId 用户id
 * @param {string} limiterValue 极限值
 */
function getUserThreadNote(userId, limiterValue) {
  if (userId == '') return false;
  return fetch(
    "https://manychat.com/" + FBID + "/im/loadMessages?limit=50&user_id=" + userId + limiterValue,
    {
      method: "GET",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
        "Content-Type": "application/json"
      },
      referrer: referrer
    }
  )
    .then(response => response.json())
    .then(uI => {
      if (uI.state) {
        let limiter = uI.limiter;
        if (limiterValue == '') {
          userThreadNote.push({
            user_id: uI.messages ? uI.messages[0].user_id : '',
            value:
              // 过滤符合条件的值 并返回
              uI.messages.filter(i => {
                return i.type == 'user_thread_note'
              }).map(i => {
                return i.model.messages[0].content.text
              })
          })
        } else {
          // 递归情况下 往 userThreadNote.value 中添加新值
          userThreadNote.map((item, index) => {
            if (userId == item.user_id) {
              userThreadNote[index].value.push.apply(userThreadNote[index].value,
                uI.messages.filter(i => {
                  return i.type == 'user_thread_note'
                }).map(i => {
                  return i.model.messages[0].content.text
                })
              )

            }
          })
        }

        // 如果有极限值 => 递归
        if (limiter) {
          getUserThreadNote(userId, "&type=facebook&limiter=" + limiter);
          return
        }
      }
    });
}

/**
 * 过滤当前用户对应的信息并返回
 * @param {string} id 用户id
 * @param {array} arr 要过滤的数组
 * @returns {string} 数组中存储的值
 */
function filter(id, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].user_id == id) {
      return arr[i].value
    }
  }
}
/**
 * 使用用户的详细信息生成 HTML
 * @param {Array} aSUI 单个用户详细的信息
 */
function saveUsersInfoFun(aSUI, index) {
  if (typeof (aSUI[0]) == 'undefined') return false;
  // 定义一个对象，保存数值
  let oNames = {};
  // 存储td的类名
  let tdClassName = ['my_avatar', 'my_name', 'my_gender', 'my_raw_ts_added', 'my_locale', 'my_language', 'my_widgets', 'my_fields', 'my_assignment', 'my_tags', 'my_userThreadNote'];
  // 遍历 td，formCheckBox() 返回表头 checked 状态
  tdClassName.map((i) => {
    oNames[i] = formCheckBox(i) ? '' : 'd-none';
  })

  usersListHTML = "";
  aSUI.map(i => {
    usersListHTML += `
            <tr>
                <th scope="row">${i.num}</th>

                <td class="text-center img-box my_avatar ${oNames.my_avatar}">
                    <img src="${i.avatar}" onclick='window.open("https://manychat.com/${FBID}/chat/${i.user_id}", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=0,width=1024,height=680")' style="cursor:pointer">
                </td>

                <td class="my_name ${oNames.my_name}" colspan="2">${i.name}</td>

                <td class="my_gender ${oNames.my_gender}">${i.gender}</td>

                <td class="my_raw_ts_added  ${oNames.my_raw_ts_added}">${new Date(Number(String(i.raw_ts_added).substring(0, 13))).toISOString().substring(0, 10)}</td>

                <td class="my_locale ${oNames.my_locale}">${i.locale}</td>

                <td class="my_language ${oNames.my_language}">${i.language}</td>

                <td class="my_widgets ${oNames.my_widgets}" colspan="2">${i.widgets ? i.widgets.join("<br>") : ""}</td>

                <td class="my_fields ${oNames.my_fields}" colspan="3" style="word-break: break-all;">${i.fields ? i.fields.join("<br>") : ""}</td>

                <td class="my_assignment ${oNames.my_assignment}">${filter(i.user_id, assignment)}</td>

                <td class="my_tags ${oNames.my_tags}"><span style="font-size:14px" class="badge badge-pill badge-info">${i.tags}</span></td>

                <td class="my_userThreadNote ${oNames.my_userThreadNote}" colspan="3" style="word-break: break-all;">${filter(i.user_id, userThreadNote)}</td>
            </tr>
        `;
  });
  aUsersId[index].length = 0;
  innerUserListHTML()
}
