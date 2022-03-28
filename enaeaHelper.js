// ==UserScript==
// @name         enaeaHelper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       xinyunaha
// @match        https://study.enaea.edu.cn/circleIndexRedirect.do*
// @match        https://study.enaea.edu.cn/viewerforccvideo.do*
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at: document-start
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.pathname
    var checkBtn = setInterval(clickContinueBtn,3000);
    var checkFinished = setInterval(awaitPageFinishe,5000);

    if (url == '/circleIndexRedirect.do' && testUrl('action','toNewMyClass') && testUrl('type','course')) {
        sleep(1000).then(() => {
            GM_setValue("baseUrl", window.location.href)
            var l1 = document.getElementsByClassName("progressvalue")
            var l2 = document.getElementsByClassName("golearn  ablesky-colortip  saveStuCourse")
            console.log('进入章节')
            for (var i=0;i<l1.length;i++) {
                if (l1[i].innerText != '100%'){
                    sleep(1000).then(()=>{
                        window.location.href='https://study.enaea.edu.cn' + l2[i].getAttribute("data-vurl")
                    })
                    break
                }
            }
            console.log('运行完成')
        })

    }

    if (url == '/viewerforccvideo.do') {
        sleep(2000).then(()=>{
            // 获取进度
            var l1 = document.getElementsByClassName("cvtb-MCK-CsCt-studyProgress")
            var l2 = document.getElementsByClassName("cvtb-MCK-CsCt-info clearfix")
            var l3 = document.getElementsByClassName("cvtb-MCK-CsCt-title cvtb-text-ellipsis")
            console.log(l1.length == 0 , l2.length == 0)
            if (l1.length == 0 && l2.length == 0) {
                alert('出错了')
            }
            for(var i=0;i<l1.length;i++){
                if (l1[i].innerText != "100%") {
                    console.log(l3[i])
                    l2[i].click()
                    break
                }
            }
            sleep(300).then(()=>{
                var continueBtn = document.getElementById("ccH5jumpInto")
                if (continueBtn != null) {
                    continueBtn.click()
                }
            })
        })
    }

    function testUrl(name,value) {
        var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == name){
                if (pair[1] == value){
                    return true
                } else{
                    return false
                };
               }
       }
       return false;
    }

    function clickContinueBtn() {
        if (url == '/viewerforccvideo.do') {
            if (document.getElementsByClassName("td-content").length != 0){
                console.log('找到暂停按钮')
                $("button:contains('继续学习')").click();
                $(".dialog-content input").click(); // 问答选项
                $(".dialog-button-container button").click(); // 问答弹窗
            } else {
                console.log('未找到暂停按钮')
            }
        } else {
                console.log('非播放界面，不判断是否完成')
            }
    }

    function awaitPageFinishe(){
        if (url == '/viewerforccvideo.do') {
            var l3 = document.getElementsByClassName("cvtb-MCK-CsCt-studyProgress")
            var count = 0;
            for(var j=0;j<l3.length;j++){
                if (l3[j].innerText != "100%") {
                    count += 1
                }
            }
            if (count == 0) {
                console.log('此章节已完成')
                var baseUrl = GM_getValue('baseUrl','')
                window.location.href=baseUrl
                clearInterval(checkFinished)
                clearInterval(checkBtn)
            } else{
                console.log('章节未完成')
            }
        } else {
            console.log('非播放界面，不判断是否完成')
        }
    }

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
})();