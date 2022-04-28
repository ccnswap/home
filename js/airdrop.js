var account;
var user;
var last_time;
var timer;
var loading=false;
function initTwitter(){
    let url = window.location.href;
    let params = url.split('#');
    (params.length>1)?params=params[1]:params="ccnswap";
    hello.init({twitter:"4v8GOCxUGCHTPaxYsIoPhFpC0"},{redirect_uri:'https://api.ccnswap.org/oauth?ref='+params+'&address='+account});
}

function receiveMsg(e) {
    try{
        let data = JSON.parse(e.data);
        if(data.key=="oauth_msg"){
            tlogin(data.code,data.msg,data.data);
        }
    }catch(e){

    }  
}

function connectwallet(){
    if (typeof window.aleereum !== "undefined") {
        const aleereum = window["aleereum"];
        if(aleereum.networkId!==3){
            $("#wallet_info").html("Network error switch to huygens");
            $("#wallet_info").css("color","red");
            return;
        }

        if(!aleereum.isConnected || aleereum.islocked){
            aleereum.connect();
        }
        updateAccount(aleereum.account);
    }else{
        window.open("https://alewallet.io/#download");
    }
}

function connecttwitter(){
    if(!account){
        $("#twitter_info").html("Please connect to the ale wallet");
        $("#twitter_info").css("color","red");
        return;
    }
    initTwitter();
    hello('twitter').login();
}

window.onload = function(){
    if(window.addEventListener) {
        window.addEventListener('message',receiveMsg,false);
    }else {
        window.attachEvent('message',receiveMsg);
    }
    if (typeof window.aleereum !== "undefined") {
        const aleereum = window["aleereum"];
        aleereum.on("on_networkId_change", function(networkID){
            updateAccount(aleereum.account);
        });
        aleereum.on("on_islocked_change", function(status){
            updateAccount(aleereum.account);
        });
        aleereum.on("on_isConnected_change", function(status){
            updateAccount(aleereum.account);
        });
        aleereum.on("on_account_change", function(account){
            updateAccount(aleereum.account);
        });
    }else{
        $("#connectWallet").html("Install Ale")
    }
}

function updateAccount(addr){
    if(!account && addr){
        $("#step1").css("display","none");
        $("#step2").css("display","flex");
    }
    account = addr;
}

function updateUserInfo(data){
    if(data){
        user = data;
        $("#user_photo").attr("src",data.photo);
        $("#user_name").html(data.username);
        $("#user_addr").html(account);
        $("#total_css").html(data.totalReward+" CCS");
        last_time = data.lastdate/1000;
        if(timer)clearInterval(timer);
        timer = setInterval(TimeRow, 1000);
        if(last_time<=0 && !data.isGetccs){
            $("#claim_ccs").attr("class","deposit_btn");
        }
        if(data.isFollowCCN==1){
            $("#follow_ccn").html("√")
            $("#follow_ccn").css("color","#00ffa3")
            $("#follow_ccn").css("background-color","rgba(0,0,0,0)")
        }else{
            $("#follow_ccn").css("background-color","#ffffff")
            $("#follow_ccn").html("Follow")
        }
        if(data.isFollow==1){
            $("#follow_ccs").html("√")
            $("#follow_ccs").css("color","#00ffa3")
            $("#follow_ccs").css("background-color","rgba(0,0,0,0)")
        }else{
            $("#follow_ccs").css("background-color","#ffffff")
            $("#follow_ccs").html("Follow")
        }
        if(data.isRetween==1){
            $("#retween_btn").html("√")
            $("#retween_btn").css("color","#00ffa3")
            $("#retween_btn").css("background-color","rgba(0,0,0,0)")
        }else{
            $("#retween_btn").css("background-color","#ffffff")
            $("#retween_btn").html("Retween")
        }
        if(data.ccnReward==1 && !data.isGetccn){
            $("#claim_ccn").attr("class","deposit_btn");
        }
        $("#invite_count").html(" "+data.refs+" ");
        $("#invite_reward").html("+"+data.refReward+" CCS");
        
    }
}

function TimeRow() {
    last_time = last_time-1;
    var d = parseInt(last_time / (24*60*60))
    var h = parseInt(last_time / (60 * 60) % 24);
    var m = parseInt(last_time / 60 % 60);
    var s = parseInt(last_time % 60);
    let txt = (d>9?d:'0'+d)+" Day "+(h>9?h:'0'+h)+":"+(m>9?m:'0'+m)+":"+(s>9?s:'0'+s);
    $("#lastdate").html(txt)
    if(last_time<=0){
        if(timer)clearInterval(timer);
        $("#lastdate").html("00:00:00");
        if(!user.isGetccs){
            $("#claim_ccs").attr("class","deposit_btn");
        }
    }
}

function tlogin(code,msg,data){
    if(code=="0"){
        if(data.isAllow==1){
            $("#step2").css("display","none");
            $("#step3").css("display","flex");
            updateUserInfo(data);
        }else{
            $("#twitter_info").html("Account registration less than 6 months");
            $("#twitter_info").css("color","red");
        }
    }else{
        $("#twitter_info").html(msg);
        $("#twitter_info").css("color","red");
    }
}

async function retween(){
    if(loading)return;
    loading=true;
    $("#retween_btn").css("background-color","rgba(0,0,0,0)")
    $("#retween_btn").html('<div class="spinner"></div>')
    let r = await fetch("https://api.ccnswap.org/info?user_id="+user.user_id);
    r = await r.json();
    updateUserInfo(r);
    if(!r.isRetween){
        window.open("https://twitter.com/intent/tweet?in_reply_to=1519614419906535424&text=Get%20%23computecoin%20%23ccnswap%20%24css%20and%20%24ccn%20%23airdrop%20url%20https%3A%2F%2Fccnswap.org%2Fairdrop.html%23"+user.username)
    }
    loading=false;
}

async function followccs(){
    if(loading)return;
    loading=true;
    $("#follow_ccs").css("background-color","rgba(0,0,0,0)")
    $("#follow_ccs").html('<div class="spinner"></div>')
    let r = await fetch("https://api.ccnswap.org/info?user_id="+user.user_id);
    r = await r.json();
    updateUserInfo(r);
    if(!r.isFollow){
        window.open('https://twitter.com/intent/user?screen_name=ccnswap');
    }
    loading=false;
}

async function followccn(){
    if(loading)return;
    loading=true;
    $("#follow_ccn").css("background-color","rgba(0,0,0,0)")
    $("#follow_ccn").html('<div class="spinner"></div>')
    let r = await fetch("https://api.ccnswap.org/info?user_id="+user.user_id);
    r = await r.json();
    updateUserInfo(r);
    if(!r.isFollowCCN){
        window.open('https://twitter.com/intent/user?screen_name=computecoinnet');
    }
    loading=false;
}

async function claimCCN(){
    if(loading)return;
    loading=true;
    if(user.isGetccn || user.ccnReward!=1){
        return;
    }
    $("#claim_ccn").html('<div class="spinner"></div>');
    let r = await fetch("https://api.ccnswap.org/claim?user_id="+user.user_id);
    r = await r.json();
    $("#claim_ccn").html('<img style="width: 29px;height: 29px;margin-right: 10px" src="./img/ccn_min.png" alt="" />Claim CCN');
    if(r.code==0){
        $("#claim_ccn").attr("class","disable_btn");
    }else{
        alert(r.msg);
    }
    loading=false
}


async function claimCCS(){
    if(loading)return;
    loading=true;
    if(user.isGetccs || last_time>0){
        return;
    }
    $("#claim_ccs").html('<div class="spinner"></div>');
    let r = await fetch("https://api.ccnswap.org/claim1?user_id="+user.user_id);
    r = await r.json();
    $("#claim_ccs").html('<img style="width: 29px;height: 29px;margin-right: 10px" src="./img/ccs_min.png" alt="" />Claim CCS');
    if(r.code==0){
        $("#claim_ccs").attr("class","disable_btn");
    }else{
        alert(r.msg);
    }
    loading=false
}

function copy(){
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.style.position = 'absolute';
    textarea.style.clip = 'rect(0 0 0 0)';
    textarea.value = 'https://ccnswap.org/airdrop.html#'+user.username;
    textarea.select();
    document.execCommand('copy', true);
    alert("Your invitation link has been copied to the clipboard, send it to your friends");
}