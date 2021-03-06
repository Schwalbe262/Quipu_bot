var PM=android.os.PowerManager;
var pm =Api.getContext().getSystemService(android.content.Context.POWER_SERVICE);
var wl = pm.newWakeLock(PM.SCREEN_BRIGHT_WAKE_LOCK|PM.ACQUIRE_CAUSES_WAKEUP |PM.ON_AFTER_RELEASE,"FAIL");

var admin = "봇강의방2" // 관리자 콘솔방 이름


//=============================================================================================================================
//===========================================   response 함수    ==============================================================
//=============================================================================================================================

function response(room, msg, sender, isGroupChat, replier, imageDB) {



    try {
        // test 코드
        if (msg == "test") {
            replier.reply("test")
        }


        // eval 반응 코드
        if (msg.indexOf(">") == 0) { // 해당 조건 만족시 eval 실행
            //replier.reply(eval(msg).toString().encoding())
            replier.reply(">" + new String(eval(msg.substring(1))).encoding()); // 봇이 eval 응답
        }

    }
    catch(e) {
        Api.replyRoom(admin, "Response Error\n" + e + "\n" + e.stack + "\n" + e.rhinoException);
        //replier.reply("Response Error\n" + e + "\n" + e.stack + "\n" + e.rhinoException)
    }



}


//=============================================================================================================================
//================================================   eval    ==================================================================
//=============================================================================================================================

// eval 코드
String.prototype.encoding=function(){
    var res=this.toString();
    var tmp;
    while(tmp=/\\u[\da-fA-F]{4}/.exec(res)){
        res=res.replace(tmp[0],String.fromCharCode(parseInt(tmp[0].substring(2),16)));
    }

    return res;
}

//=============================================================================================================================
//=============================================   eval 종료    ================================================================
//=============================================================================================================================


//=============================================================================================================================
//=============================================   Git class    ================================================================
//=============================================================================================================================

Git = function() {

    //Constructor//
    function Git(){
    }
    //Git.ignore_list = getDB("ignore_update").split("\n") //update시 내려받지 않을 파일들의 이름 리스트
    Git.ignore_list=[]

    Git.getFileList = function(gitlink) {
        //정보 추출경로로 변형
        var gitlink = gitlink.includes("/file-list/master") ? gitlink : gitlink+"/file-list/master" //TODO - 이름이 file-list/master일수도 있으니 정규화 하자
        //연결
        var html = org.jsoup.Jsoup.connect(gitlink).get()
        //파싱
        var typelist = html.select(".js-active-navigation-container").select("td[class=icon]").select("svg").eachAttr("class").toArray().slice(1)
        var namelist = html.select(".js-active-navigation-container").select("td[class=content]").select("a").eachText().toArray().slice()
        var pathlist = html.select(".js-active-navigation-container").select("td[class=content]").select("a").eachAttr("href").toArray().slice()
        var checklist = html.select(".js-active-navigation-container").select("td[class=message]").select("a").eachAttr("href").toArray().slice()
        var filelist = []

        for(var i=0; i<namelist.length;i++){
            //js string 화
            typelist[i] = String(typelist[i])
            namelist[i] = String(namelist[i])
            pathlist[i] = String(pathlist[i])
            checklist[i] = String(checklist[i])
            //데이터 추출
            if(typelist[i] == "octicon octicon-file-directory"){
                typelist[i] = "folder"
            }
            else if(typelist[i] == "octicon octicon-file"){
                typelist[i] = "file"
            }
            else {
                typelist[i] = "other" //??
            }
            pathlist[i] = pathlist[i].substr(pathlist[i].indexOf("/master/")+7)
            checklist[i] = checklist[i].substr(checklist[i].indexOf("/commit/")+8)
            //파일 객체로 변환
            var file = {type: typelist[i], name : namelist[i] , path : pathlist[i] , check : checklist[i] }
            filelist.push(file)
        }

        for  (var i=0;i<filelist.length;i++ ) { //재귀로 폴더 탐사


            if(filelist[i].type == "folder") {
                var newlink = gitlink + "/"+filelist[i].name
                filelist[i] = Git.getFileList(newlink)
            }
        }

        return flatten(filelist)
    }

    Git.pull = function(gitlink, folderpath) {
        var filelist = Git.getFileList(gitlink)
        for(var i = 0; i<filelist.length ; i++ ) {
            if(filelist[i].type == "file" && !Git.ignore_list.includes(filelist[i].name)){
                var rawlink = "https://raw.githubusercontent.com"+gitlink.substr(gitlink.indexOf("github.com")+10) +"/"+ filelist[i].check + filelist[i].path
                var conn = new java.net.URL(rawlink).openConnection();
                conn.setRequestProperty("Content-Type", "text/xml;charset=utf-8");
                var is=conn.getInputStream();
                var br=new java.io.BufferedReader(new java.io.InputStreamReader(is));
                var str = ''
                var tmp=null;
                while (((tmp = br.readLine()) != null)) {
                    str += tmp+"\n";
                }
                br.close();
                saveFile(filelist[i].path.substr(1) , str)
            }
        }
    }

    Git.showme = function(arr) {
        msg2 = ''
        for(var i=0;i<arr.length;i++) {
            msg = i+".\n"+"type: " + arr[i].type + "\n"+"name: " + arr[i].name + "\n"+"path: " + arr[i].path + "\n"+"checksum: " + arr[i].check ;
            msg2 += msg +"\n\n"

        }
        Api.replyRoom(admin,msg2)
    }

    return Git

}()

Object.defineProperty(Array.prototype,"includes",	{
    value:function(target){
        return this.indexOf(target)!=-1
    }
});

function flatten(arr) {
    return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
}

function update() { // 깃헙 파일 -> 휴대폰 response.js 업데이트
    timer.start();
    Api.replyRoom(admin,"updating...");
    Git.pull("https://github.com/Schwalbe262/Quipu_bot","/sdcard/kbot") // 반드시 이부분을 본인 링크로 바꿀 것
    Api.replyRoom(admin,"complete");
    var time = timer.end();
    var msg = "time : " + java.lang.String.format("%.2f",time/1000) + "sec";
    Api.replyRoom(admin,msg);
    return ""
}

function reload () { // 코드 리로드
    timer.start();
    //switcher=0;
    Api.replyRoom(admin,"리로드 시작...");
    wake.on();
    try{
        Api.reload();
    }catch(e){
        Api.replyRoom(admin,e + "\n" + e.stack);
    }
    wake.off();
    var time = timer.end();
    Api.replyRoom(admin,"리로드 완료!");
    msg = "경과시간: " + java.lang.String.format("%.2f",time/1000) + "초";
    Api.replyRoom(admin,msg);
}

wake=(function() {
    var PM=android.os.PowerManager;
    var pm =Api.getContext().getSystemService(android.content.Context.POWER_SERVICE);

    var wl= pm.newWakeLock(PM.SCREEN_DIM_WAKE_LOCK|PM.ACQUIRE_CAUSES_WAKEUP |PM.ON_AFTER_RELEASE,"FAIL");
    return {
        on :function(){
            if(!wl.isHeld()){
                wl.acquire();
                Api.replyRoom(admin,"cpu온");
            }
        },
        off:function(){
            if(wl.isHeld()){
                wl.release();
                Api.replyRoom(admin,"cpu오프");
            }
        },
        toString: function(){
            return wl.toString();
        }
    }
})();

timer = new (function(){ // 타이머
    var low=new Date();
    return {
        start : function() {
            low = new Date();
        },
        end : function() {
            var present = new Date;
            return present - low;
        }
    }})();

function saveFile(file, str) {
    //var filedir = new java.io.File("/sdcard/kbot/"+ file);
    //var filedir = new java.io.File("/sdcard/ChatBot/BotData/시립"+ file);
    var filedir = new java.io.File("/sdcard/katalkbot/"+ file);
    try {
        var bw = new java.io.BufferedWriter(new java.io.FileWriter(filedir));
        bw.write(str.toString());
        bw.close();
    } catch (e) {
        return e;
    }
}

//=============================================================================================================================
//==========================================   Git class 종료    ==============================================================
//=============================================================================================================================
