var PM=android.os.PowerManager;
var pm =Api.getContext().getSystemService(android.content.Context.POWER_SERVICE);
var wl = pm.newWakeLock(PM.SCREEN_BRIGHT_WAKE_LOCK|PM.ACQUIRE_CAUSES_WAKEUP |PM.ON_AFTER_RELEASE,"FAIL");



//===============
var str_SG_1 = ""
var str_SG_2 = ""
var str_GJ_1 = ""
var str_GJ_2 = ""
var str_GJ_1_2 = ""
var str_GJ_2_2 = ""
var flag_SG = ""
var flag_SG2 = ""
var start = 1
var switcher = 1;
var count = 0
//================

//================= 통신 변수 ===================
var comm_flag = 0
var comm_body = []
var comm_end_flag = 0
var num_body
var comm_place

//=============================================================================================================================
//===========================================   response 함수    ==============================================================
//=============================================================================================================================

function response(room, msg, sender, isGroupChat, replier, imageDB) {
    try {

        if(start==1){
            var count = 0
            start = 0
        }

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

        // Api.replyRoom("메세지 전송 방 이름","메시지")
        // r.reply 및 replier.reply 사용 금지
        //==============================================================================================================
        //==============================================작 업 영 역=====================================================
        //==============================================================================================================




        //==============================================================================================================
        //==============================================작 업 영 역=====================================================
        //==============================================================================================================


        //==============================================================================================================
        //================================================== 통신 ======================================================

        // body packet의 정의 : $$$1$$$cat$$$c=2&&c=4

        if( room=="통신방" && msg==("$$$$$start$$$$$") && sender!="시립봇(sub"){ // 통신 시작 코드
            comm_flag = 1
            comm_body = [];
        }
        else if( room=="통신방" && comm_flag == 1 && msg.indexOf("$$$")==0 && msg!="$$$$$end$$$$$"){ // 통신 내용 수신
            comm_body[Number(msg.split("$$$")[1])-1] = msg
        }
        else if( room=="통신방" && msg=="$$$$$end$$$$$" ){ // 통신 종료 코드
            comm_flag = 0
            comm_end_flag = 1
            num_body = comm_body.length
        }
        //냠

        //================================================== 통신 끝====================================================
        //==============================================================================================================

        if( comm_end_flag==1 && num_body>0 ){
            comm_end_flag=0
            Api.replyRoom("통신방","$$$$$start$$$$$")
            for(let i=0;i<num_body;i++){

                try{
                    if( comm_body[i].split("$$$")[3] == "identity_single" ){
                        let id = String(comm_body[i].split("$$$")[4])
                        let body = "$$$"+(i+1)+"$$$"+comm_body[i].split("$$$")[2]+"$$$"+"return_identity_single"+"$$$"+NSC1(id)
                        purge(id)

                        Api.replyRoom("통신방",body)
                    }
                    if( comm_body[i].split("$$$")[3] == "identity_multy" ){
                        let nickName = String(comm_body[i].split("$$$")[4]).split("$%$")[0]
                        let id = String(comm_body[i].split("$$$")[4]).split("$%$")[1]
                        let body = "$$$"+(i+1)+"$$$"+comm_body[i].split("$$$")[2]+"$$$"+"return_identity_multi"+"$$$"+nickName+"$%$"+NSC1(id)
                        purge(id)
                        Api.replyRoom("통신방",body)
                        java.lang.Thread.sleep(500)
                    }
                    if( comm_body[i].split("$$$")[3] == "identity_multy_v2" ){
                        let nickName = String(comm_body[i].split("$$$")[4]).split("$%$")[0]
                        let id = String(comm_body[i].split("$$$")[4]).split("$%$")[1]
                        let body = "$$$"+(i+1)+"$$$"+comm_body[i].split("$$$")[2]+"$$$"+"return_identity_multi_v2"+"$$$"+nickName+"$%$"+NSC1(id)
                        purge(id)
                        Api.replyRoom("통신방",body)
                        java.lang.Thread.sleep(500)
                    }
                    if( comm_body[i].split("$$$")[3] == "identity_multy_v3" ){
                        let nickName = String(comm_body[i].split("$$$")[4]).split("$%$")[0]
                        let id = String(comm_body[i].split("$$$")[4]).split("$%$")[1]
                        let body = "$$$"+(i+1)+"$$$"+comm_body[i].split("$$$")[2]+"$$$"+"return_identity_multi_v2"+"$$$"+nickName+"$%$"+NSC1(id)
                        purge(id)
                        Api.replyRoom("통신방",body)
                        java.lang.Thread.sleep(500)
                    }
                }
                catch(e){
                    Api.replyRoom("봇강의방", "Response Error\n" + e + "\n" + e.stack + "\n" + e.rhinoException);
                }

            }
            Api.replyRoom("통신방","$$$$$end$$$$$")
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







        /*
    //======================================== 공지방 티키타카 코드 시작 ==================================================


        if(room=="시립대" && sender=="최고의최고의최고의최고의최고의최고야!!" && msg.indexOf("공지가 새로 게시되었습니다")>-1 ){
            flag_SG = 1;
            flag_SG2 = 1;
            str_SG_1 = msg;
            timer.start()
        }
        if(room=="시립대" && sender=="최고의최고의최고의최고의최고의최고야!!" && msg.indexOf("보러가기 : ")>-1 && flag_SG==1 ){
            str_SG_2 = msg;
        }
        if(room=="시립대공지확인방" && sender=="시립봇" && msg.indexOf("공지가 새로 게시되었습니다")>-1 ){
            str_GJ_1 = msg;
        }
        if(room=="시립대공지확인방" && sender=="시립봇" && msg.indexOf("보러가기 : ")>-1 ){
            str_GJ_2 = msg;
        }
        if(room=="시립대공지확인방2" && sender=="시립봇" && msg.indexOf("공지가 새ㅇ로 게시되었습니다")>-1 ){
            str_GJ_1_2 = msg;
        }
        if(room=="시립대공지확인방2" && sender=="시립봇" && msg.indexOf("보러가기 : ")>-1 ){
            str_GJ_2_2 = msg;
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

        if(flag_SG2==1 && timer.end()>60*1000){
            if(str_SG_1==str_GJ_1_2){ // 공지가 정상적으로 공지확인방에 출력 된 경우 아무 동작 하지 않음
                flag_SG2=0
            }
            else if(str_SG_1!=str_GJ_1_2){ // 공지가 정상적으로 출력 안된 경우
                Api.replyRoom("시립대공지확인방2",str_SG_1)
                Api.replyRoom("시립대공지확인방2",str_SG_2)
                flag_SG2=0
                Api.replyRoom("봇강의방","티키타카시스템2 작동 완료")
            }
        }

        //======================================== 공지방 티키타카 코드 종료 ==================================================
        */



    }
    catch(e) {
        Api.replyRoom("봇강의방", "Response Error\n" + e + "\n" + e.stack + "\n" + e.rhinoException);
        Api.replyRoom("봇강의방2", "Response Error\n" + e + "\n" + e.stack + "\n" + e.rhinoException);
        //replier.reply("Response Error\n" + e + "\n" + e.stack + "\n" + e.rhinoException)
    }



}

//=============================================================================================================================
//===========================================   response 함수 끝    ===========================================================
//=============================================================================================================================

Object.defineProperty(Object.prototype,"$",   {
    get:function(){
        var self=this;
        return Object.getOwnPropertyNames(this).map(v=>{
            try{
                return v+" : "+self[v]
            }catch(e){ }
            return v+" : error"

        }).join("\n");
    }
});

function get_authroization_header(){
    cmd("chmod -Rf 777 /data");
    var get_auth_token = () => {
            return readFile("/data/data/com.kakao.talk/shared_prefs/KakaoTalk.authorization.preferences.xml").split("<string name=\"encrypted_auth_token\">")[1].split("</string")[0];
        }
    ;
    var get_device_uuid = () => {
            return readFile("/data/data/com.kakao.talk/shared_prefs/KakaoTalk.hw.perferences.xml").split("<string name=\"deviceUUID\">")[1].split("</string")[0];
        }
    ;
    var get_authorization_suffix = () => {
            var a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            var instance = java.security.MessageDigest.getInstance("SHA");
            instance.reset();
            var bytes = java.lang.String.format(java.util.Locale.US, "%s %s", "dkljleskljfeisflssljeif", get_device_uuid()).getBytes();
            instance.update(bytes);
            var bArr = instance.digest();
            var stringBuffer = new java.lang.StringBuffer();
            for (var i = 0; i < bArr.length; i++) {
                b2 = bArr[i];
                stringBuffer.append(a[(b2 & 240) >> 4]);
                stringBuffer.append(a[b2 & 15]);
            }
            return stringBuffer.toString();
        }
    ;
    var get_authorization_prefix = () => {
            var key1 = [67, 109, -115, -110, -23, 119, 33, 86, -99, -28, -102, 109, -73, 13, 43, -96, 109, -76, 91, -83, 73, -14, 107, -88, 6, 11, 74, 109, 84, -68, -80, 15];
            var key2 = [10, 2, 3, -4, 20, 73, 47, -38, 27, -22, 11, -20, -22, 37, 36, 54];
            var auth_token = get_auth_token();
            var b64_decrypted_auth_token = android.util.Base64.decode(auth_token, 0);
            var cipher = new javax.crypto.Cipher.getInstance("AES/CBC/PKCS5PADDING");
            var key = new javax.crypto.spec.SecretKeySpec(key1, "AES");
            var iv = new javax.crypto.spec.IvParameterSpec(key2);
            cipher.init(2, key, iv);
            var final = cipher.doFinal(b64_decrypted_auth_token);
            return JSON.parse(new java.lang.String(final, "UTF-8")).access_token;
        }
    ;
    return get_authorization_prefix() + "-" + get_authorization_suffix();
}

function nyamsconn(id){
    var userId = String(id);
    var A = "android/8.7.9/ko";
    var Auth = get_authroization_header();
    var info = printObject(JSON.parse(org.jsoup.Jsoup.connect("http://katalk.kakao.com/android/friends/add/" + userId + ".json").ignoreContentType(true).header("Authorization", Auth).header("A", "android/8.7.9/ko").get().text()).friend).trim();
    r.replier.reply(info);
}

function readInputStream(is) {

    var br = new java.io.BufferedReader(new java.io.InputStreamReader(is));
    var readStr = "";
    var str = null;

    while (((str = br.readLine()) != null)) {
        readStr += str + "\n";
    }
    br.close();
    return readStr.trim();

}

function cmd(dir) {

    var p = java.lang.Runtime.getRuntime().exec("su -c \"\"" + dir + "\"\"");
    p.waitFor();
    var r = p.getInputStream() || p.getErrorStream();
    return readInputStream(r);

}

cmd("chmod -R 777 /data/data/com.kakao.talk/shared_prefs");
var readFile = (path) => {

    var filedir = new java.io.File(path);
    try {
        var br = new java.io.BufferedReader(new java.io.FileReader(filedir));
        var readStr = "";
        var str = null;
        while (((str = br.readLine()) != null)) {
            readStr += str + "\n";
        }
        br.close();
        return readStr.trim();
    } catch (e) {
        return e;
    }
};

var get_auth_token = () => {
    cmd("cp /data/data/com.kakao.talk/shared_prefs/KakaoTalk.authorization.preferences.xml /sdcard/");
    return readFile("/sdcard/KakaoTalk.authorization.preferences.xml").split("<string name=\"encrypted_auth_token\">")[1].split("</string")[0];
}



var get_device_uuid =
    () => {
        cmd("cp /data/data/com.kakao.talk/shared_prefs/KakaoTalk.hw.perferences.xml /sdcard/");
        return readFile("/sdcard/KakaoTalk.hw.perferences.xml").split("<string name=\"deviceUUID\">")[1].split("</string")[0];
    }


var get_device_adid = () => {
    cmd("cp /data/data/com.kakao.talk/shared_prefs/com.kakao.talk_preferences.xml /sdcard/");
    return readFile("/sdcard/com.kakao.talk_preferences.xml").split("<string name=\"adfit_adid\">")[1].split("</string")[0];
}


var get_authorization_suffix = () => {
    var a = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    var instance = java.security.MessageDigest.getInstance("SHA");
    instance.reset();
    //var bytes = java.lang.String.format(java.util.Locale.US, "%s %s", "dkljleskljfeisflssljeif", get_device_uuid()).getBytes("UTF-8");
    var bytes = new java.lang.String("dkljleskljfeisflssljeif " + get_device_uuid()).getBytes()
    instance.update(bytes);
    var bArr = instance.digest();
    var stringBuffer = new java.lang.StringBuffer();
    for (var i = 0; i < bArr.length; i++) {
        b2 = bArr[i];
        stringBuffer.append(a[(b2 & 240) >> 4]);
        stringBuffer.append(a[b2 & 15]);
    }
    return stringBuffer.toString();
};


generate_XVC = (email) => {
    var a = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    var bytes =
        java.lang.String.format(
            java.util.Locale.US, "%s|%s|%s|%s|%s", ["WYATT", "KT/8.8.1 An/7.1.1 ko", "JAKE", email, "LIA"]
        ).getBytes()

    var instance = java.security.MessageDigest.getInstance("SHA-512");
    instance.reset();
    instance.update(bytes);
    var bArr = instance.digest();
    var stringBuffer = new java.lang.StringBuffer();
    for (var i = 0; i < bArr.length; i++) {
        b2 = bArr[i];
        stringBuffer.append(a[(b2 & 240) >> 4]);
        stringBuffer.append(a[b2 & 15]);
    }
    return stringBuffer.toString().substring(0,16)

}


var get_authorization_prefix = () => {

    var key1 = [67, 109, -115, -110, -23, 119, 33, 86, -99, -28, -102, 109, -73, 13, 43, -96, 109, -76, 91, -83, 73, -14, 107, -88, 6, 11, 74, 109, 84, -68, -80, 15];

    var key2 = [10, 2, 3, -4, 20, 73, 47, -38, 27, -22, 11, -20, -22, 37, 36, 54];

    var auth_token = get_auth_token();

    var b64_decrypted_auth_token = android.util.Base64.decode(auth_token, 0);

    var cipher = new javax.crypto.Cipher.getInstance("AES/CBC/PKCS5PADDING");

    var key = new javax.crypto.spec.SecretKeySpec(key1, "AES");

    var iv = new javax.crypto.spec.IvParameterSpec(key2);

    cipher.init(2, key, iv);

    var final = cipher.doFinal(b64_decrypted_auth_token);

    return JSON.parse(new java.lang.String(final, "UTF-8")).access_token;

};

var get_authorization_header = () => {

    return get_authorization_prefix() + "-" + get_authorization_suffix()

}


var friendAdd = (userId) => {

    return org.jsoup.Jsoup.connect("http://katalk.kakao.com/android/friends/add/" + userId + ".json")

        .ignoreContentType(true)

        .header("Authorization", get_authorization_header())

        .header("A", "android/8.5.4/ko")

        .get()

}




var purge = (userId) => {

    return org.jsoup.Jsoup.connect("http://katalk.kakao.com/android/friends/purge.json")
        .ignoreContentType(true)
        .header("Authorization", get_authorization_header())
        .header("A", "android/8.5.4/ko")
        .header("ADID", get_device_adid())
        .header("User-Agent", "KT/8.5.4 An/7.0 ko")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .data('id', userId)
        .post()

}


var getFromPhoneNumber = (numb) => {

    var data = org.jsoup.Jsoup.connect("http://katalk.kakao.com/android/friends/add_by_phonenumber.json")

        .ignoreContentType(true)

        .header("Authorization", get_authorization_header())

        .header("A", "android/8.5.4/ko")

        .header("ADID", get_device_adid())

        .header("User-Agent", "KT/8.5.4 An/7.0 ko")

        .header("Content-Type", "application/x-www-form-urlencoded")

        .data('nickname', numb)

        .data('country_iso', 'KR')

        .data('country_code', 82)

        .data('phonenumber', numb)

        .post()

    data = JSON.parse(data.body().text())

    if (data.status != 0) {

        return "정보를 찾을 수 없습니다."

    }

    var feed = getFeed(data.friend.userId)

    var str = ""

    str += "이름 : " + data.friend.nickName + "\n"

    str += "상태메시지 : " + data.friend.statusMessage + "\n"

    str += "아이디 : " + data.friend.UUID + "\n"

    str += "프로필 이미지 : " + data.friend.originalProfileImageUrl + "\n"

    str += "전화번호 : " + data.pstn_number + "\n"

    str += feed

    return str

}


var getUser = (id) => {

    var data = JSON.parse(org.jsoup.Jsoup.connect("http://katalk.kakao.com/android/friends/search.json?query=" + id).ignoreContentType(true)

        .header("Authorization", get_authorization_header())

        .header("ADID", get_device_adid())

        .header("A", "android/8.5.4/ko")

        .get().body().text())

    if (data.status != 0) {

        return "정보를 찾을 수 없습니다."

    }

    var data2 = getFeed(data.user.list[0].userId)

    var str = ""

    str += "이름 : " + data.user.list[0].nickName + "\n"

    str += "상태메시지 : " + data.user.list[0].statusMessage + "\n"

    str += "아이디 : " + data.user.list[0].UUID + "\n"

    str += "프로필 이미지 : " + data.user.list[0].originalProfileImageUrl + "\n"

    str += data2

    return str

}


var getFeed = (userId) => {

    var data = friendAdd(userId)
    data = JSON.parse(data.body().text())
    if (data.status != 0) {
        return "정보를 찾을 수 없습니다."
    }

    data = org.jsoup.Jsoup.connect("http://katalk.kakao.com/android/profile3/friend.json?id=" + userId)
        .ignoreContentType(true)
        .header("Authorization", get_authorization_header())
        .header("ADID", get_device_adid())
        .header("A", "android/8.5.4/ko")
        .get()
    data = JSON.parse(data.body().text())
    if (data.status != 0) {
        return "정보를 찾을 수 없습니다."
    }

    purge(data.profile.userId)
    var back = data.profile.originalBackgroundImageUrl
    var str = ""
    str += "배경사진 : " + back + "\n"
    str += "피드  : " + String.fromCharCode(8237).repeat(500) + "\n"

    try {
        for (var i in data.profile.feeds.feeds) {
            var f = data.profile.feeds.feeds[i].contents[0]
            str += "피드 " + i + "\n"
            str += "타입 : " + f.type + "\n"
            str += "값 : " + JSON.stringify(f.value) + "\n\n"
        }
    }
    catch (e) {
    }

    return str
}




var NSC1 = (userId) => { // 신상 조회 기능 필요한부분만
    let str = org.jsoup.Jsoup.connect("http://katalk.kakao.com/android/friends/add/" + userId + ".json")
        .ignoreContentType(true)
        .header("Authorization", get_authorization_header())
        .header("A", "android/8.5.4/ko")
        .get()
    str = String(str)
    let nickName = str.split("\"nickName\":\"")[1].split("\",")[0]
    let UUID = str.split("\"UUID\":\"")[1].split("\",")[0]
    let fullProfileImageUrl = str.split("\"fullProfileImageUrl\":\"")[1].split("\",")[0]
    return nickName+"$%$"+UUID+"$%$"+fullProfileImageUrl
}



/*
function cmd(dir) {
    var p = java.lang.Runtime.getRuntime().exec("su -c \"\"" + dir + "\"\"");
    p.waitFor();
    var r = p.getInputStream() || p.getErrorStream();
    return isread(r);
}

function isread(is) {

    var br = new java.io.BufferedReader(new java.io.InputStreamReader(is));

    var readStr = "";

    var str = null;

    while (((str = br.readLine()) != null)) {

        readStr += str + "\n";

    }

    br.close();

    return readStr.trim();

}

function readFile(file) {
    var filedir = new java.io.File(file);
    //var filedir = new java.io.File("/sdcard/kbot/"+  file);
    try {
        var br = new java.io.BufferedReader(new java.io.FileReader(filedir));
        var readStr = "";
        var str = null;
        while (((str = br.readLine()) != null)) {
            readStr += str + "\n";
        }
        br.close();
        return readStr.trim();
    } catch (e) {
        return e;
    }
}
*/

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

timer = new (function(){
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


