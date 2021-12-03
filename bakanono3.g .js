var userProperties = PropertiesService.getUserProperties();

function doGet(e){
  var temperature = e.parameter.t;
  if (!temperature) {
    return;
  }

  var nowDatetime = new Date().toLocaleString();
  if(temperature==0)
  {
  userProperties.setProperty('temperatureText', nowDatetime  + " 錯誤，無法取得心率，請確認是否正確連接 " );
  }
  if(temperature>40 && temperature<60)
  { 
  userProperties.setProperty('temperatureText', nowDatetime  + " 您的心率是 " + temperature + "心率偏低，請留意身體狀況並盡速就醫");
  }
  if(temperature>59 && temperature<101)
  { 
  userProperties.setProperty('temperatureText', nowDatetime  + " 您的心率是 " + temperature);
  }
  if(temperature>100 && temperature>0)
  {
  userProperties.setProperty('temperatureText', nowDatetime  + " 您的心率是 " + temperature + "心率過高，請留意身體狀況並盡速就醫");
  }
 
  var returnText = temperature + " OK";
  var textOutput = ContentService.createTextOutput(returnText)
  return textOutput;
}

function doPost(e) {
  var msg = JSON.parse(e.postData.contents);

  // 取出 replayToken 和使用者送出的訊息文字
  var replyToken = msg.events[0].replyToken;
  var userMessage = msg.events[0].message.text;

  if (typeof replyToken === 'undefined') {
    return;
  }

  if (typeof keyWords === 'undefined') {
    var keyWords = ["心率"];
  }
  else {
    keyWords = keyWords.concat(["心率"]);
  }
  
  var returnText;
  var hasKeyword = false;
  
  if (userMessage) {
    for (var i = 0; i < keyWords.length; i++) {
      if (userMessage.indexOf(keyWords[i]) !== -1) {
        hasKeyword = true;
        break;
      }
    }
  }
  
  if (hasKeyword) {
    var temperatureText = userProperties.getProperty('temperatureText');
    if (temperatureText) {
      returnText =  temperatureText;
    }
    else {
      returnText = "抱歉我無法取得心率";
    }
  }
  else {
    returnText = getMisunderstandWords();
  }
  
  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + accessToken.trim(),
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': returnText,
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
