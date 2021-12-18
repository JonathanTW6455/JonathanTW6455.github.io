var userProperties = PropertiesService.getUserProperties();

function doGet(e){
  var  temperature = e.parameter.t ;
  var spov = e.parameter.s;
  var heartbeat = e.parameter.h;
  if (!temperature || !spov || !heartbeat){
   
    return;
  }

  var nowDatetime = new Date().toLocaleString();
  if(temperature==0)
  {
  userProperties.setProperty('temperatureText', nowDatetime  + " 錯誤，無法取得溫度，請確認是否正確連接 " );
  }
  if(temperature<37.5)
  { 
  userProperties.setProperty('temperatureText', nowDatetime  + " 您的體度是 " + temperature + "度");
  }
  if(temperature>37.5 )
  {
  userProperties.setProperty('temperatureText', nowDatetime  + " 您的體溫是 " + temperature + " 度"+"體溫偏高，請留意身體狀況並盡速就醫");
  }
  
 if(spov==0)
  {
  userProperties.setProperty('SPO2Text', nowDatetime  + " 錯誤，無法取得血氧濃度，請確認是否正確連接 " );
  }
  if(spov>95)
  { 
  userProperties.setProperty('SPO2Text', nowDatetime  + " 您的血氧濃度是 " + spov + " %");
  }
  if(spov<95 && spov>0)
  {
  userProperties.setProperty('SPO2Text', nowDatetime  + " 您的血氧濃度是 " + spov + " %"+"血氧濃度偏低，請留意身體狀況並盡速就醫");
  }
  
  if(heartbeat==0)
  {
  userProperties.setProperty('heartbeatText', nowDatetime  + " 錯誤，無法取得心率，請確認是否正確連接 " );
  }
  if(heartbeat>60 && heartbeat<100)
  { 
  userProperties.setProperty('heartbeatText', nowDatetime  + " 您的心率是 " + heartbeat );
  }
 if(heartbeat>0 && heartbeat<60)
  {
  userProperties.setProperty('heartbeatText', nowDatetime  + " 您的心率是 " + heartbeat + +"心率偏低，請留意身體狀況並盡速就醫");
  }
  if(heartbeat>100)
  {
  userProperties.setProperty('heartbeatText', nowDatetime  + " 您的心率是 " + heartbeat + +"心率偏高，請留意身體狀況並盡速就醫");
  }
  var returnTextT = temperature + " OK";
  var textOutputT = ContentService.createTextOutput(returnTextT)
  return textOutputT;
  
   var returnTextS = spov + " OK";
  var textOutputS = ContentService.createTextOutput(returnTextS)
  return textOutputS;
  
   var returnTextH = heartbeat + " OK";
  var textOutputH = ContentService.createTextOutput(returnTextH)
  return textOutputH;
}

function doPost(e) {
  var msg = JSON.parse(e.postData.contents);

  // 取出 replayToken 和使用者送出的訊息文字
  var replyTokenT = msg.events[0].replyToken;
  var userMessageT = msg.events[0].message.text;
var replyTokenS = msg.events[0].replyToken;
  var userMessageS = msg.events[0].message.text;
var replyTokenH = msg.events[0].replyToken;
  var userMessageH = msg.events[0].message.text;

  if (typeof replyTokenT === 'undefined') {
    return;
  }

   if (typeof replyTokenT === 'undefined') {
    return;
  }
  
   if (typeof replyTokenH === 'undefined') {
    return;
  }
  
  if (typeof keyWordsT === 'undefined') {
    var keyWordsT = ["溫度"];
  }
  else {
    keyWordsT = keyWordsT.concat(["溫度"]);
  }
  
  if (typeof keyWordsS === 'undefined') {
    var keyWordsS = ["血氧濃度"];
  }
  else {
    keyWordsS = keyWordsS.concat(["血氧濃度"]);
  }
  
   if (typeof keyWordsH === 'undefined') {
    var keyWordsH = ["心率"];
  }
  else {
    keyWordsH = keyWordsH.concat(["心率"]);
  }
  
  var returnTextT;
  var returnTextS;
  var returnTextH;
  var hasKeywordT = false;
  var hasKeywordS = false;
  var hasKeywordH = false;
  if (userMessageT) {
    for (var i = 0; i < keyWordsT.length; i++) {
      if (userMessageT.indexOf(keyWordsT[i]) !== -1) {
        hasKeywordT = true;
        break;
      }
    }
  }
  
  if (userMessageS) {
    for (var i = 0; i < keyWordsS.length; i++) {
      if (userMessageS.indexOf(keyWordsS[i]) !== -1) {
        hasKeywordS = true;
        break;
      }
    }
  }
  
  if (userMessageH) {
    for (var i = 0; i < keyWordsH.length; i++) {
      if (userMessageH.indexOf(keyWordsH[i]) !== -1) {
        hasKeywordH = true;
        break;
      }
    }
  }
  
  if (hasKeywordT) {
    var temperatureText = userProperties.getProperty('temperatureText');
    if (temperatureText) {
      returnTextT =  temperatureText;
    }
    else {
      returnTextT = "抱歉我無法取得溫度";
    }
  }
  else {
    returnTextT = getMisunderstandWords();
  }
  
   if (hasKeywordS) {
    var SPO2Text = userProperties.getProperty('SPO2Text');
    if (SPO2Text) {
      returnTextS =  SPO2Text;
    }
    else {
      returnTextS = "抱歉我無法取得血氧濃度";
    }
  }
  else {
    returnTextS = getMisunderstandWords();
  }
  
  if (hasKeywordH) {
    var heartbeatText = userProperties.getProperty('heartbeatText');
    if (heartbeatText) {
      returnTextH =  heartbeatText;
    }
    else {
      returnTextH = "抱歉我無法取得心率";
    }
  }
  else {
    returnTextH = getMisunderstandWords();
  }
  
  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchAppT.fetch(url, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + accessToken.trim(),
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyTokenT,
      'messages': [{
        'type': 'text',
        'text': returnTextT,
      }],
    }),
  });
}

 UrlFetchAppS.fetch(url, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + accessToken.trim(),
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyTokenS,
      'messages': [{
        'type': 'text',
        'text': returnTextS,
      }],
    }),
  });
}

 UrlFetchAppH.fetch(url, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + accessToken.trim(),
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyTokenH,
      'messages': [{
        'type': 'text',
        'text': returnTextH,
      }],
    }),
  });
}


function getMisunderstandWords() {
  var _misunderstandWords = [
    "不好意思，我無法理解您的需求",
    "再說明白一點好嗎？我只是一個不太懂事的 baby 機器人",
    "我不懂您的意思，抱歉我會加強訓練的"
  ];
  
  if (typeof misunderstandWords === 'undefined') {
    var misunderstandWords = _misunderstandWords;
  }
  else {
    misunderstandWords = misunderstandWords.concat(_misunderstandWords);
  }
  
  return misunderstandWords[Math.floor(Math.random()*misunderstandWords.length)];
}
