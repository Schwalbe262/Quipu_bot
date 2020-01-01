var PM=android.os.PowerManager;
var pm =Api.getContext().getSystemService(android.content.Context.POWER_SERVICE);
var wl = pm.newWakeLock(PM.SCREEN_BRIGHT_WAKE_LOCK|PM.ACQUIRE_CAUSES_WAKEUP |PM.ON_AFTER_RELEASE,"FAIL");

//=============================================================================================================================
//===========================================   response 함수    ==============================================================
//=============================================================================================================================

var str_SG_1 = ""
var str_SG_2 = ""
var str_GJ_1 = ""
var str_GJ_2 = ""
var flag_SG = ""

function response(room, msg, sender, isGroupChat, replier, imageDB) {
    try {

        // r객체선언
        var r = {replier: replier, m: msg, msg: msg, s: sender, sender: sender, r: room, room: room, g: isGroupChat, i: imageDB, imageDB:imageDB,
            reply: function (str) {
                this.replier.reply(new String(str).encoding().trim()); // rmspace에서 trim으로 수정함 (2019/12/31)
            },
            intervalReply: function (tag, msg, interval) {
                var lastTime = getNum("__intervalReply__" + tag);
                var currentTime = new Date().valueOf();
                if (lastTime == 0 || currentTime - lastTime >= interval * 1000) {
                    this.reply(msg);
                    setDB("__intervalReply__" + tag, currentTime);
                    return true;
                } else {
                    return false;
                }
            },
            replyRoom:function(room,str){
                var replier;
                if((replier=ObjKeep.get("replier."+room))!=null) {
                    ObjKeep.get("replier."+room).reply(new String(str).encoding().rmspace());
                    return true;
                } else return false;
            }
        };

        blankFunc(r)
        blankFunc1(r)
        blankFunc2(r)
        blankFunc3(r)
        blankFunc4(r)
        blankFunc5(r)

        if(msg=="고양이"){
            r.reply("야옹")
        } // “고양이”라는 메시지를 받을 경우 “야옹” 출력
        else if(msg=="강아지"){
            r.reply("멍멍")
        }
        else if(msg=="고양이"){
            r.reply("삐약삐약")
        }
        else{
            r.reply("꼬끼오")
        }







        // test 코드
        if (msg == "test") {
            replier.reply("test11")
        }

        // eval 반응 코드
        if (msg.indexOf(">") == 0 && (room=="봇강의방"||room=="봇강의방2")) { // 해당 조건 만족시 eval 실행
            //replier.reply(eval(msg).toString().encoding())
            replier.reply(">" + new String(eval(msg.substring(1))).encoding()); // 봇이 eval 응답
        }







    //======================================== 공지방 티키타카 코드 시작 ==================================================

        if(room=="시갤톡방" && sender=="최고의최고의최고의최고의최고의최고야!!" && msg.indexOf("공지가 새로 게시되었습니다")>-1 ){
            flag_SG = 1;
            str_SG_1 = msg;
            timer.start()
        }
        if(room=="시갤톡방" && sender=="최고의최고의최고의최고의최고의최고야!!" && msg.indexOf("보러가기 : ")>-1 && flag_SG==1 ){
            str_SG_2 = msg;
        }
        if(room=="시립대공지확인방" && sender=="시립봇" && msg.indexOf("공지가 새로 게시되었습니다")>-1 ){
            str_GJ_1 = msg;
        }
        if(room=="시립대공지확인방" && sender=="시립봇" && msg.indexOf("보러가기 : ")>-1 ){
            str_GJ_2 = msg;
        }

        if(flag_SG==1 && timer.end()>60*1000){
            if(str_SG_1==str_GJ_1){ // 공지가 정상적으로 공지확인방에 출력 된 경우 아무 동작 하지 않음
                flag_SG=0
            }
            else if(str_SG_1!=str_GJ_1){ // 공지가 정상적으로 출력 안된 경우
                Api.replyRoom("시립대공지확인방",str_SG_1)
                Api.replyRoom("시립대공지확인방",str_SG_2)
                flag_SG=0
                Api.replyRoom("봇강의방","티키타카시스템 작동 완료")
            }
        }

        //======================================== 공지방 티키타카 코드 종료 ==================================================



    }
    catch(e) {
        Api.replyRoom("봇강의방", "Response Error\n" + e + "\n" + e.stack + "\n" + e.rhinoException);
        //replier.reply("Response Error\n" + e + "\n" + e.stack + "\n" + e.rhinoException)
    }



}

//=============================================================================================================================
//=============================================   balnkFunc   =================================================================
//=============================================================================================================================

function blankFunc(r){}
function blankFunc1(r){}
function blankFunc2(r){}
function blankFunc3(r){}
function blankFunc4(r){}
function blankFunc5(r){}


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
        Api.replyRoom("봇강의방",msg2)
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
    Api.replyRoom("봇강의방","updating...");
    Git.pull("https://github.com/Schwalbe262/Quipu_bot","/sdcard/kbot") // 반드시 이부분을 본인 링크로 바꿀 것
    Api.replyRoom("봇강의방","complete");
    var time = timer.end();
    var msg = "time : " + java.lang.String.format("%.2f",time/1000) + "sec";
    Api.replyRoom("봇강의방",msg);
    return ""
}

function reload () { // 코드 리로드
    timer.start();
    //switcher=0;
    Api.replyRoom("봇강의방","리로드 시작...");
    wake.on();
    try{
        Api.reload();
    }catch(e){
        Api.replyRoom("봇강의방",e + "\n" + e.stack);
    }
    wake.off();
    var time = timer.end();
    Api.replyRoom("봇강의방","리로드 완료!");
    msg = "경과시간: " + java.lang.String.format("%.2f",time/1000) + "초";
    Api.replyRoom("봇강의방",msg);
}

wake=(function() {
    var PM=android.os.PowerManager;
    var pm =Api.getContext().getSystemService(android.content.Context.POWER_SERVICE);

    var wl= pm.newWakeLock(PM.SCREEN_DIM_WAKE_LOCK|PM.ACQUIRE_CAUSES_WAKEUP |PM.ON_AFTER_RELEASE,"FAIL");
    return {
        on :function(){
            if(!wl.isHeld()){
                wl.acquire();
                Api.replyRoom("봇강의방","cpu온");
            }
        },
        off:function(){
            if(wl.isHeld()){
                wl.release();
                Api.replyRoom("봇강의방","cpu오프");
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
