var account;
var user;
var last_time;
var timer;
var loading=false;

const erc_addr = "0x0107caD77c4Fa5C8dd9c8FD1C316f0F7182b7758";
const air_addr = "0xe792C4F39e117BFa2CDBdF831d37b6221DbC8F1D";
const erc_abi = [ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" } ];
const air_abi = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "Claim", "type": "event" }, { "inputs": [], "name": "_ccs", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "_claimed", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "_tokens", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "addToken", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "addr", "type": "address" } ], "name": "isclaimed", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "addr", "type": "address" } ], "name": "setOwner", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "addr", "type": "address" } ], "name": "tokens", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];
const web3 = new Web3(new Web3.providers.HttpProvider('https://huygens.computecoin.network'));
const air_con = new web3.eth.Contract(air_abi,air_addr);
const erc_con = new web3.eth.Contract(erc_abi,erc_addr);

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
    refreshReward();
}

async function refreshReward(){
    let pow18 = BigNumber(10).exponentiatedBy(18);
    let last = await erc_con.methods.balanceOf(air_addr).call();
    last = BigNumber(last).dividedBy(pow18);
    let claimed = BigNumber(100000).minus(last);
    $('#rema_ccs1').html(last.toFixed(0));
    $('#rema_ccs2').html(last.toFixed(0));
    $('#rema_ccs3').html(last.toFixed(0));
    $('#claimed_ccs1').html(claimed.toFixed(0));
    $('#claimed_ccs2').html(claimed.toFixed(0));
    $('#claimed_ccs3').html(claimed.toFixed(0));
}

function updateAccount(addr){
    if(!account && addr){
        $("#step1").css("display","none");
        $("#step2").css("display","flex");
    }
    account = addr;
}

async function refreshBalance() {
    let pow18 = BigNumber(10).exponentiatedBy(18);
    let balance = await erc_con.methods.balanceOf(account).call();
    balance = BigNumber(balance).dividedBy(pow18);
    $("#lastdate").html(balance.toFixed(0)+" CCS");
    $('#yourbalance').html('Your Balance');
    //console.log(account+':'+balance);
}

function updateUserInfo(data){
    if(data){
        user = data;
        $("#user_photo").attr("src",data.photo);
        $("#user_name").html(data.username);
        $("#user_addr").html(account);
        $("#total_css").html(data.totalReward+" CCS");
        last_time = data.lastdate/1000;
        if(last_time>0){
            if(timer)clearInterval(timer);
            timer = setInterval(TimeRow, 1000);
        }else{
            refreshBalance();
            setInterval(() => {
                refreshBalance();
            }, 3000);
        }
        if(last_time<=0 && !data.isGetccs){
            $("#claim_ccs").attr("class","deposit_btn");
        }
        if(data.isFollowCCN==1){
            $("#follow_ccn").html("???")
            $("#follow_ccn").css("color","#00ffa3")
            $("#follow_ccn").css("background-color","rgba(0,0,0,0)")
        }else{
            $("#follow_ccn").css("background-color","#ffffff")
            $("#follow_ccn").html("Follow")
        }
        if(data.isFollow==1){
            $("#follow_ccs").html("???")
            $("#follow_ccs").css("color","#00ffa3")
            $("#follow_ccs").css("background-color","rgba(0,0,0,0)")
        }else{
            $("#follow_ccs").css("background-color","#ffffff")
            $("#follow_ccs").html("Follow")
        }
        if(data.isRetween==1){
            $("#retween_btn").html("???")
            $("#retween_btn").css("color","#00ffa3")
            $("#retween_btn").css("background-color","rgba(0,0,0,0)")
        }else{
            $("#retween_btn").css("background-color","#ffffff")
            $("#retween_btn").html("Retween")
        }
        if(data.isTelegram==1){
            $("#telegram_btn").html("???")
            $("#telegram_btn").css("color","#00ffa3")
            $("#telegram_btn").css("background-color","rgba(0,0,0,0)")
        }else{
            $("#telegram_btn").css("background-color","#ffffff")
            $("#telegram_btn").html("Telegram")
        }
        if(data.isDiscord==1){
            $("#discord_btn").html("???")
            $("#discord_btn").css("color","#00ffa3")
            $("#discord_btn").css("background-color","rgba(0,0,0,0)")
        }else{
            $("#discord_btn").css("background-color","#ffffff")
            $("#discord_btn").html("Discord")
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
        refreshBalance();
        setInterval(() => {
            refreshBalance();
        }, 3000);
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
        window.open("https://twitter.com/intent/tweet?in_reply_to=1519614419906535424&text=Get%20%23computecoin%20%23ccnswap%20%24ccs%20and%20%24ccn%20%23airdrop%20url%20https%3A%2F%2Fccnswap.org%2Fairdrop.html%23"+user.username)
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
    window.open('https://twitter.com/intent/user?screen_name=ccnswap');
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
    window.open('https://twitter.com/intent/user?screen_name=computecoinnet');
    loading=false;
}

async function chatClick(type){
    if(loading)return;
    loading=true;
    if(type==0){
        $("#telegram_btn").css("background-color","rgba(0,0,0,0)")
        $("#telegram_btn").html('<div class="spinner"></div>')
    }else{
        $("#discord_btn").css("background-color","rgba(0,0,0,0)")
        $("#discord_btn").html('<div class="spinner"></div>')
    }
    let r = await fetch("https://api.ccnswap.org/chat?user_id="+user.user_id+"&type="+type);
    r = await r.json();
    r = await fetch("https://api.ccnswap.org/info?user_id="+user.user_id);
    r = await r.json();
    updateUserInfo(r);
    if(type==0){
        window.open('https://t.me/ccnswap');
    }else{
        window.open('https://discord.gg/zd4ZYwcPth');
    }
    loading=false;
}

async function claimCCN(){
    if(user.isGetccn || user.ccnReward!=1){
        return;
    }
    if(loading)return;
    loading=true;
    let v = this;
    $("#claim_ccn").html('<div class="spinner"></div>');
    grecaptcha.ready(function() {
        grecaptcha.execute('6LdMHcwfAAAAAJ1fXt3idgWtrv4Y2TGP6ofMfcef',{action:'submit'}).then(function(token) {
            v.ccnclaim(token);
        });
    });
}

async function claimCCS(){
    if(last_time>0){
        return;
    }
    if(loading)return;
    loading=true;
    let v = this;
    $("#claim_ccs").html('<div class="spinner"></div>');
    grecaptcha.ready(function() {
        grecaptcha.execute('6LdMHcwfAAAAAJ1fXt3idgWtrv4Y2TGP6ofMfcef',{action:'submit'}).then(function(token) {
            v.ccsclaim(token);
        });
    });
}

async function ccnclaim(token){
    let r = await fetch("https://api.ccnswap.org/claim?user_id="+user.user_id+"&token="+token);
    r = await r.json();
    $("#claim_ccn").html('Claim CCN');
    if(r.code==0){
        $("#claim_ccn").attr("class","disable_btn");
    }else{
        alert(r.msg);
    }
    loading=false
}

async function ccsclaim(token){
    let claimed = await air_con.methods.isclaimed(account).call();
    if(claimed){
        alert("You have claimed");
    }else{
        let claimed = await air_con.methods.tokens(account).call();
        if(claimed>0){
            window.open('https://ccnswap.org/wallet.html','ccnswap');
        }else{
            let r = await fetch("https://api.ccnswap.org/claimccs?user_id="+user.user_id+"&token="+token);
            r = await r.json();
            if(r.code==0){
                window.open('https://ccnswap.org/wallet.html','ccnswap');
            }else{
                alert(r.msg);
            }
        }
    }
    $("#claim_ccs").html('Claim CCN');
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