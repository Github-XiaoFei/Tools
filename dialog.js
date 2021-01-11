function notification() {
    const href = location.href;
    let idArr = ["439452453536447", "781692052034265", "1678094015605774"];
    let body = document.querySelector('body');
    // html code
    let html = `
    <style>
    #xf-box {
        opacity: .5;
        z-index: 1071;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: #000
    }
    
    .xf-hidden {
        display: none;
    }
    
    #xf-dialog {
        position: fixed;
        top: 5%;
        left: 35%;
        width: 400px;
        height: 200px;
        pointer-events: none;
        max-width: 500px;
        margin: 1.75rem auto;
        transform: none;
        z-index: 1080
    }
    
    #xf-dialog .xf-modal-content {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        pointer-events: auto;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid rgba(0, 0, 0, .2);
        border-radius: .3rem;
        outline: 0
    }
    
    #xf-dialog .xf-modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 1rem 1rem;
        border-bottom: 1px solid #e9ecef;
        border-top-left-radius: .3rem;
        border-top-right-radius: .3rem
    }
    
    #xf-dialog h5 {
        margin-bottom: 0;
        line-height: 1.5;
        font-size: 1.25rem;
        font-weight: 800;
        font-family: inherit;
        margin-top: 0;
    }
    
    #xf-dialog .xf-modal-body {
        position: relative;
        flex: 1 1 auto;
        padding: 1rem
    }
    
    #xf-dialog .xf-modal-body p {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 16px
    }
    
    #xf-dialog .xf-modal-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 1rem;
        border-top: 1px solid #e9ecef;
        border-bottom-right-radius: .3rem;
        border-bottom-left-radius: .3rem
    }
    
    #xf-dialog .xf-btn-primary {
        color: #fff;
        background-color: #007bff;
        border-color: #007bff
    }
    
    #xf-dialog .xf-btn {
        display: inline-block;
        font-weight: 400;
        color: #212529;
        text-align: center;
        vertical-align: middle;
        user-select: none;
        border: 1px solid transparent;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: .25rem;
        transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out
    }
    
    #xf-dialog .xf-btn-primary {
        color: #fff;
        background-color: #007bff;
        border-color: #007bff
    }
    
    #xf-dialog .xf-btn-primary:hover {
        background-color: #0a5cb3
    }
    
    #xf-dialog .xf-btn {
        cursor: pointer
    }
    </style>
    <div id="xf-box-dialog" class="xf-hidden">
        <div id="xf-dialog">
            <div class="xf-modal-dialog" role="document">
                <div class="xf-modal-content">
                    <div class="xf-modal-header">
                        <h5 class="xf-modal-title">提示</h5>
                        <button type="button" id="xf-close"> <span>&times;</span> </button>
                    </div>
                    <div class="xf-modal-body">
                        <p>🔔👋<br><br>新的会话(Live Chat)被启动! (有新用户加入或新信息)</p>
                    </div>
                    <div class="xf-modal-footer">
                        <button type="button" id="xf-click-btn"" class="xf-btn xf-btn-primary">我知道了</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="xf-box"></div>
    </div>
    `;
    body.insertAdjacentHTML('afterbegin', html);

    // 音频是否循环
    function isAudioLoop(ids) {
        let isAudioLoop = false;

        ids.map((i) => {
          if (~href.indexOf(i)) {
            isAudioLoop = true;
          }
        })

        return isAudioLoop;

    }
    
    // 声明需要的元素
    let clickBtn = document.querySelector('#xf-click-btn');
    let close = document.querySelector('#xf-close');
    let dialogBox = document.querySelector('#xf-box-dialog');
    let manychatChatNum = document.querySelectorAll('li[data-test-id="chat"] a>div>span')[0];
    let silferbotsChatNum = document.getElementById('num_live_chat');
    
    // 声明提示音 js 创建一个 Audio
    let myAudio = new Audio("https://raw.githack.com/Github-XiaoFei/Tools/master/sound/samsung_s7.mp3");
    myAudio.loop = true; // 循环

    let saveValue = null;
    let observables = null;
    if (manychatChatNum) {
        saveValue = manychatChatNum.innerText;
        observables = manychatChatNum;
    } else {
        saveValue = silferbotsChatNum.innerText;
        observables = silferbotsChatNum;
    }

    // MutationObserver 它会在指定的DOM发生变化时被调用 (监控会话数量是否变化)
    // by https://jsfiddle.net/9P83S/1/
    let observer = new MutationObserver(function (mutations) {
        let newValue = mutations[0].target.innerText;
        // 判断新值和保存的值 触发音频播放和显示对话框
        if (newValue > saveValue) {
            myAudio.play();
            dialogBox.classList.remove('xf-hidden');
            if (!isAudioLoop(idArr)) {
                setTimeout(() => { 
                    myAudio.pause();
                    myAudio.currentTime = 0;
                }, 15000)     
            }
        }
        saveValue = newValue;
    });
    let config = { childList: true, attributes: true, characterData: true, subtree: true };
    observer.observe(observables, config);

    // 点击停止音频播放并隐藏对话框
    function stop() {
        myAudio.pause();
        myAudio.currentTime = 0;
        dialogBox.classList.add('xf-hidden');
    }
    close.onclick = () => stop();
    clickBtn.onclick = () => stop();
    clickBtn.onclick = () => document.location.reload();

}

window.onload = function() {
    setTimeout(() => { notification() }, 4000);
};
