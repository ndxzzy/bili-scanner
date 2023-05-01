// ==UserScript==
// @name         B站成分检测器Pro
// @version      2.1
// @author       xulaupuz,trychen,ndxzzy
// @namespace    ndxzzy.top
// @license      GPLv3
// @description  B站评论区成分检查（自动挡+超多成分修改）
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/read/*
// @match        https://t.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.min.js
// ==/UserScript==

$(function () {
    // 在这里配置要检查的成分
    const checkers = [
        {
            displayName: "原神",
            displayIcon: "https://i2.hdslb.com/bfs/face/d2a95376140fb1e5efbcbed70ef62891a3e5284f.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #原神", "米哈游", "miHoYo" , "#原神#", "原神"],
            followings: [401742377] // 原神官方号的 UID
        },
        {
            displayName: "Phigros",
            displayIcon: "https://i0.hdslb.com/bfs/face/b3dd022d03c32a91be673d195a9f60c46217c406.jpg@240w_240h_1c_1s.webp",
            keywords: ["Phigros", "#Phigros#", "#鸽游#" , "#Pigeon Games#"],
            followings: [414149787]
        },
        {
            displayName: "明日方舟",
            displayIcon: "https://i0.hdslb.com/bfs/face/d4005a0f9b898d8bb049caf9c6355f8e8f772a8f.jpg@240w_240h_1c_1s.webp",
            keywords: ["#明日方舟#", "明日方舟"],
            followings: [161775300]
        },
        {
            displayName: "第五人格",
            displayIcon: "https://i0.hdslb.com/bfs/game/3dfbd7a83f3136924f741fedfd6f78d7d4d42f5f.png@280w_280h_1c_!web-search-game-cover.avif",
            keywords: ["第五人格", "#第五人格#", "深渊的呼唤", "演绎之星", "潘大帅", "潘毒奶"],
            followings: [452627895,34000583,211005705,105022844,311864840]
        },
        {
            displayName: "光·遇",
            displayIcon: "https://i2.hdslb.com/bfs/face/6a32a6914c6d4c95cd2bbe5bf1ac3c11aa5c763e.jpg@240w_240h_1c_1s.webp",
            keywords: ["光·遇", "#光·遇#", "光遇", "#SKY光遇#"],
            followings: [211700578]
        },
        {
            displayName: "熊出没",
            displayIcon: "https://i1.hdslb.com/bfs/face/10b719a57ed090d091963f63333658fb3f477d50.jpg@240w_240h_1c_1s.webp",
            keywords: ["熊出没", "BoonieBears"],
            followings: [14373586]
        },
        {
            displayName: "喜灰",
            displayIcon: "https://i2.hdslb.com/bfs/face/09730be918be0e59d72e2557444b4da09e276370.jpg@240w_240h_1c_1s.webp",
            keywords: ["喜羊羊", "灰太狼", "小灰灰", "#喜羊羊与灰太狼#"],
            followings: [31832612,1091253726,523637998]
        },
        {
            displayName: "我的世界",
            displayIcon: "https://i2.hdslb.com/bfs/face/c5578966c447a70edf831bbf7e522b7be6090fea.jpg@240w_240h_1c_1s.webp",
            keywords: ["我的世界", "Minecraft", "hypixel", "PVP", "起床战争", "bedwars", "空岛战争", "skywars", "skyblock", "FoFTG"],
            followings: [
                43310262, // 网易我的世界
                9596327, // 卡慕sama
                686127, // 籽岷
                19428259, // 黑山大叔
                2170934, // 明月庄主
                305586284, // guiwow
                19525533, //pipi
                26032219, // fo
                5836069, // 脏小豆
                27996286 // 老迪
            ]
        },
        {
            displayName: "崩坏3",
            displayIcon: "https://i0.hdslb.com/bfs/face/f861b2ff49d2bb996ec5fd05ba7a1eeb320dbf7b.jpg@240w_240h_1c_1s.jpg",
            keywords: ["崩坏3第一偶像爱酱" , "#崩坏3#", "崩坏3"],
            followings: [27534330] // 崩坏3官方号的 UID
        },
        {
            displayName: "崩坏星穹铁道",
            displayIcon: "https://i2.hdslb.com/bfs/face/e76fc676b58f23c6bd9161723f12da00c7e051c5.jpg@240w_240h_1c_1s.webp",
            keywords: ["崩坏星穹铁道" , "#崩坏星穹铁道#"],
            followings: [1340190821]
        },
        {
            displayName: "王者荣耀",
            displayIcon: "https://i2.hdslb.com/bfs/face/effbafff589a27f02148d15bca7e97031a31d772.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #王者荣耀" , "王者荣耀"],
            followings: [57863910, 392836434] // “王者荣耀” & “哔哩哔哩王者荣耀赛事”
        },
        {
            displayName: "小黑子",
            displayIcon: "https://i0.hdslb.com/bfs/face/c9f9e503e2b40f32fbd7f0e778cb79c09f50d683.jpg@240w_240h_1c_1s.webp",
            keywords: ["蔡徐坤", "鸡你太美", "只因你太美", "ikun", "小黑子", "鸡你"],
            followings: [692565348,417371020,1304376959,3493262365035488]
        },
        {
            displayName: "HOMO",
            displayIcon: "https://i1.hdslb.com/bfs/face/875eb66bb952f16afa9634081a820dea8e3fac96.jpg@240w_240h_1c_1s.webp",
            keywords: ["田所浩二", "李田所", "HOMO", "homo", "食雪", "114514", "1919810", "逸一时", "误一世"],
            followings: [114514]
        },
        {
            displayName: "技术",
            displayIcon: "https://i2.hdslb.com/bfs/face/a409335bd345cdeac1ece6715cc5ef737b860cbc.jpg@240w_240h_1c_1s.webp",
            keywords: ["Java","Python","C++","JavaScript","PHP","HTML","CSS","MySQL","MongoDB","Node.js","React","Angular","Vue","Git","GitHub","Visual Studio Code","Eclipse","IntelliJ IDEA","调试","算法","数据结构","面向对象编程","函数式编程","Web开发","移动开发","人工智能","机器学习","自然语言处理","计算机视觉","大数据","云计算","敏捷开发","Scrum","看板","测试驱动开发"],
            followings: [451913461,37974444,12890453,314076440,29959830,383814461]
        },
        {
            displayName: "VTB",
            displayIcon: "https://i2.hdslb.com/bfs/face/d399d6f5cf7943a996ae96999ba3e6ae2a2988de.jpg@240w_240h_1c_1s.jpg",
            keywords: ["嘉然","東雪蓮","永雏塔菲","东雪莲"],
            followings: [
                672328094, // 嘉然今天吃什么
                1437582453, // 東雪蓮Official
                1265680561, // 永雏塔菲
            ]
        }
    ]

    // 空间动态api
    const spaceApiUrl = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const followingApiUrl = 'https://api.bilibili.com/x/relation/followings?vmid='

    const checked = {}
    const checking = {}
    var printed = false

    // 监听用户ID元素出现
    waitForKeyElements(".user-name", installCheckButton);
    waitForKeyElements(".sub-user-name", installCheckButton);
    waitForKeyElements(".user .name", installCheckButton);
    waitForKeyElements("#h-name", installCheckButton);

    // 直接检查 如果卡死请删掉
    waitForKeyElements(".composition-name-control", function(element) {
        setTimeout(function() {
            element.trigger("mouseenter");
        }, Math.floor(Math.random() * 3000)); // 0-3s随机 防止请求过猛
    });

    console.log("开启B站用户成分检查器...")

    // 添加检查按钮
    function installCheckButton(element) {
        let node = $(`<div style="display: inline;" class="composition-checkable"><div class="composition-badge-control">
  <a class="composition-name-control">${searchIcon}</a>
</div></div>`)

        node.on('mouseenter', function () {
            node.find(".composition-name-control").text("检查中...")
            checkComposition(element, node.find(".composition-name-control"))
            node.find(".composition-name-control").trigger("click")
        })

        element.after(node)
    }

    // 添加标签
    function installComposition(id, element, setting) {
        let node = $(`<div style="display: inline;"><div class="composition-badge">
  <a class="composition-name">${setting.displayName}</a>
  <img src="${setting.displayIcon}" class="composition-icon">
</div></div>`)

        element.after(node)
    }

    // 检查标签
    function checkComposition(element, loadingElement) {
        // 用户ID
        let userID = element.attr("data-user-id") || element.attr("data-usercard-mid")
        // 用户名
        let name = element.text().charAt(0) == "@" ? element.text().substring(1) : element.text()

        if (checked[userID] != undefined) {
            // 已经缓存过了
            let found = checked[userID]
            if (found.length > 0) {
                for (let setting of found) {
                    installComposition(userID, element, setting)
                }
                loadingElement.parent().remove()
            } else {
                loadingElement.text('无')
            }
        } else if (checking[userID] != undefined) {
            // 检查中
            if (checking[userID].indexOf(element) < 0)
                checking[userID].push(element)
        } else {
            checking[userID] = [element]
            console.log("正在检查用户 " + name + " 的成分...");

            new Promise(async (resolve, reject) => {
                try {
                    // 找到的匹配内容
                    let found = []

                    let spaceRequest = request({
                        data: "",
                        url: spaceApiUrl + userID,
                    })

                    let followingRequest = request({
                        data: "",
                        url: followingApiUrl + userID,
                    })

                    try {
                        let spaceContent = await spaceRequest

                        if (!printed) {
                            console.log(spaceContent)
                            printed = true
                        }

                        // 动态内容检查
                        if (spaceContent.code == 0) {
                            // 解析并拼接动态数据
                            let st = JSON.stringify(spaceContent.data.items)

                            for (let setting of checkers) {
                                // 检查动态内容
                                if (setting.keywords) {
                                    if (setting.keywords.find(keyword => st.includes(keyword))) {
                                        if (found.indexOf(setting) < 0)
                                            found.push(setting)
                                        continue;
                                    }
                                }
                            }
                        }
                    } catch(error) {
                        console.error(`获取 ${name} ${userID} 的动态失败`, error)
                    }

                    try {
                        let followingContent = await followingRequest

                        // 可能无权限
                        let following = followingContent.code == 0 ? followingContent.data.list.map(it => it.mid) : []
                        if (following) {
                            for (let setting of checkers) {
                                // 检查关注列表
                                if (setting.followings)
                                    for (let mid of setting.followings) {
                                        if (following.indexOf(mid) >= 0) {
                                            if (found.indexOf(setting) < 0)
                                                found.push(setting)
                                            continue;
                                        }
                                    }
                            }
                        }
                    } catch(error) {
                        console.error(`获取 ${name} ${userID} 的关注列表失败`, error)
                    }

                    // 添加标签
                    if (found.length > 0) {
                        // 输出日志
                        console.log(`检测到 ${name} ${userID} 的成分为 `, found.map(it => it.displayName))

                        checked[userID] = found

                        // 给所有用到的地方添加标签
                        for (let element of checking[userID]) {
                            for (let setting of found) {
                                installComposition(userID, element, setting)
                            }
                        }
                        loadingElement.parent().remove()
                    } else {
                        loadingElement.text('无')
                    }

                    checked[userID] = found
                    delete checking[userID]

                    resolve(found)
                } catch (error) {
                    console.error(`检测 ${name} ${userID} 的成分失败`, error)
                    loadingElement.text('失败')
                    delete checking[userID]
                    reject(error)
                }
            })
        }
    }

    const searchIcon = `<svg width="12" height="12" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.3451 15.2003C16.6377 15.4915 16.4752 15.772 16.1934 16.0632C16.15 16.1279 16.0958 16.1818 16.0525 16.2249C15.7707 16.473 15.4456 16.624 15.1854 16.3652L11.6848 12.8815C10.4709 13.8198 8.97529 14.3267 7.44714 14.3267C3.62134 14.3267 0.5 11.2314 0.5 7.41337C0.5 3.60616 3.6105 0.5 7.44714 0.5C11.2729 0.5 14.3943 3.59538 14.3943 7.41337C14.3943 8.98802 13.8524 10.5087 12.8661 11.7383L16.3451 15.2003ZM2.13647 7.4026C2.13647 10.3146 4.52083 12.6766 7.43624 12.6766C10.3517 12.6766 12.736 10.3146 12.736 7.4026C12.736 4.49058 10.3517 2.1286 7.43624 2.1286C4.50999 2.1286 2.13647 4.50136 2.13647 7.4026Z" fill="currentColor"></path></svg>`

    // 添加标签样式
    addGlobalStyle(`
.composition-badge {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  background: #00AEEC26;
  border-radius: 10px;
  margin: -6px 0;
  margin: 0 5px;
  font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
}

.composition-name {
  line-height: 13px;
  font-size: 13px;
  color: #00AEEC !important;
  padding: 2px 8px;
}

.composition-icon {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 2px solid white;
  margin: -6px;
  margin-right: 5px;
}

.composition-badge-control {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    background: #00000008 !important;
    border-radius: 10px;
    margin: -6px 0;
    margin: 0 5px;
    font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
}

.composition-name-control {
    line-height: 13px;
    font-size: 12px;
    color: #00000050 !important;
    padding: 2px 8px;
}
    `)

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function request(option) {
        return new Promise((resolve, reject) => {
            let requestFunction = GM_xmlhttpRequest ? GM_xmlhttpRequest : GM.xmlHttpRequest

            requestFunction({
                method: "get",
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                },
                ...option,
                onload: (response) => {
                    let res = JSON.parse(response.responseText)
                    resolve(res)
                },
                onerror: (error) => {
                    reject(error);
                }
            });
        })
    }

    /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.
    Usage example:
        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );
        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }
    IMPORTANT: This function requires your script to have loaded jQuery.
    */
    function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents()
                .find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            targetNodes.each(function () {
                var jThis = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound) btargetsFound = false;
                    else jThis.data('alreadyFound', true);
                }
            });
        } else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey]
        } else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function () {
                    waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
                }, 300);
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }
})
