var messages = jQ('.messages-content')
var feedBack = {
  logs: []
}
var convoId, d
var $userInputField
var userInputVal

function getBrowser() {
  var ua = navigator.userAgent
  var tem
  var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || []
    return {
      name: 'IE',
      version: (tem[1] || '')
    }
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR|Edge\/(\d+)/)
    if (tem !== null) {
      return {
        name: 'Opera',
        version: tem[1]
      }
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1])
  }
  return {
    name: M[0],
    version: M[1]
  }
}

function GetConversationId() {
  console.log('GetConversationId')
  $http({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'BotConnector QiqpVfEokVI.cwA.5vE.22sCnPEo93AXDH0oESiQ9xJZR69MKklf_BleqscPR7M'
    },
    url: 'https://directline.botframework.com/api/conversations'
  }).then(function(response) {
    console.log(response)
    console.log('success')
    convoId = response.data['conversationId']
    jQ('<div class="message loading new"><figure class="avatar"><img src="icon.png" /></figure><span></span></div>').appendTo(jQ('.mCSB_container'))
    setTyping()
    updateScrollbar()
    setTimeout(function() {
      PostMessage()
    }, 1000)
  })
}

function PostMessage() {
  $http({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'BotConnector QiqpVfEokVI.cwA.5vE.22sCnPEo93AXDH0oESiQ9xJZR69MKklf_BleqscPR7M'
    },
    url: 'https://directline.botframework.com/api/conversations/' + convoId + '/messages',
    data: {
      'conversationId': convoId,
      'text': userInputVal
    }
  }).success(function(data, status) {
    setTimeout(function() {
      GetMessage()
    }, 5000)
  })
}

function GetMessage() {
  $http({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'BotConnector QiqpVfEokVI.cwA.5vE.22sCnPEo93AXDH0oESiQ9xJZR69MKklf_BleqscPR7M'
    },
    url: 'https://directline.botframework.com/api/conversations/' + convoId + '/messages'
  }).success(function(response) {
    botMessage(response['messages'][1]['text'])
  })
}

function submitForm() {
  userInputVal = $userInputField.val()
  insertMessage(userInputVal)
  if (userInputVal) {
    GetConversationId()
  }
}

jQ(window).load(function() {
  messages.mCustomScrollbar()
  setTimeout(function() {
    botMessage("Hi! I'm your insurance advisor. How may I help you.")
    // declare any one of the type => feedback / image / video / audio
    botMessage('How would you rate this convo', 'feedback')
    botMessage('Video display', 'video', 'video.mp4')
    botMessage('Audio play', 'audio', 'audio.mp3')
  }, 100)
})

function updateScrollbar() {
  messages.mCustomScrollbar('update').mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  })
}

function formatAMPM(date) {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'pm' : 'am'
  var hour = hours % 12
  hours = hours ? hour : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}

function setDate(t) {
  d = new Date()
  jQ('<div class="timestamp">' + formatAMPM(d) + '</div>').appendTo(t)
}

function setTyping() {
  jQ('<div class="timestamp">Typing...</div>').appendTo(jQ('.message:last'))
}

function insertMessage(msg) {
  if (jQ.trim(msg) === '') {
    return false
  }
  var temp = jQ('<div class="message message-personal">' + msg + '</div>')
  temp.appendTo(jQ('.mCSB_container')).addClass('new')
  setDate(temp)
  jQ('.message-input').val(null)
  updateScrollbar()
}

function botMessage(botmsg, type, url) {
  if (jQ('.message-input').val() !== '') {
    return false
  }
  jQ('.message.loading').remove()
  jQ('.message.timestamp').remove()
  var temp = ''
  if (type === 'feedback') {
    temp = jQ('#templates').html()
    jQ('.mCSB_container').append(temp)
  } else if (type === 'video') {
    temp = jQ('<div class="message"><figure class="avatar"><img src="icon.png" /></figure><video controls width="100%" height="auto" autoplay><source src="' + url + '" type="video/mp4">Your browser does not support the video tag.</video><br/><i class="fa fa-thumbs-down" isselected="false" aria-hidden="true"></i><i class="fa fa-thumbs-up" isselected="false" aria-hidden="true"></i></div>')
    temp.appendTo(jQ('.mCSB_container')).addClass('new')
  } else if (type === 'audio') {
    temp = jQ('<div class="message"><figure class="avatar"><img src="icon.png" /></figure><audio controls autoplay style="width:225px;"><source src="' + url + '" type="audio/mpeg">Your browser does not support the audio tag.</audio><br/><i class="fa fa-thumbs-down" isselected="false" aria-hidden="true"></i><i class="fa fa-thumbs-up" isselected="false" aria-hidden="true"></i></div>')
    temp.appendTo(jQ('.mCSB_container')).addClass('new')
  } else {
    temp = jQ('<div class="message"><figure class="avatar"><img src="icon.png" /></figure><div class="botmessage">' + botmsg + '</div><br /><i class="fa fa-thumbs-down" isselected="false" aria-hidden="true"></i><i class="fa fa-thumbs-up" isselected="false" aria-hidden="true"></i></div>')
    temp.appendTo(jQ('.mCSB_container')).addClass('new')
  }
  setDate(temp)
  updateScrollbar()
  playSound('bing')
}

function playSound(filename) {
  document.getElementById('sound').innerHTML = '<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename + '.mp3" /></audio>'
}

jQ('body').on('click', '.emoji', function() {
  jQ('.emoji').each(function() {
    jQ(this).attr('isactive', 'false')
    jQ(this).removeClass('jqactive')
  })
  jQ(this).addClass('jqactive')
  jQ(this).attr('isactive', 'true')
})

jQ('body').on('click', '#send_feedback', function(e) {
  if (jQ('textarea').val().length === 0) {
    e.preventDefault()
  } else {
    insertMessage('Thank you for your  rating of ' + jQ('.emoji.jqactive').attr('rating') + " and your comment '" + jQ('textarea').val() + "' ")
    feedBack.logs.push({
      finalRating: jQ('.emoji.jqactive').attr('rating'),
      finalFeedback: jQ(this).closest('.message').find('textarea').val()
    })
    jQ(this).prop('disabled', true)
  }
})

jQ('body').on('click', '.fa-thumbs-down', function() {
  jQ(this).addClass('f-active')
  jQ(this).closest('.message').find('.fa-thumbs-up').removeClass('f-active')

  if (jQ(this).closest('.message').find('.shoutout').length === 0) {
    var temp = jQ('<div class="shoutout"><br /><hr ><table><tr><td>Let us know why:</td><td><textarea class="shoutout_msg" name="dislike" placeholder="Enter here"></textarea></td><td><i class="fa fa-bullhorn fa-2x" aria-hidden="true"></i></td></tr></table></div>')
    temp.appendTo(jQ(this).closest('.message'))
  }
  var text = jQ(this).closest('.message').find('.botmessage').text()
  var status = 'not OK'
  registerFeedback(feedBack, status, text)
  console.log(feedBack)
  jQ(this).closest('.message').find('.shoutout').show()
  jQ(this).closest('.message').find('.fa-bullhorn').show()
})

jQ('body').on('click', '.fa-thumbs-up', function() {
  jQ(this).addClass('f-active')
  jQ(this).closest('.message').find('.fa-thumbs-down').removeClass('f-active')

  var text = jQ(this).closest('.message').find('.botmessage').text()
  var status = 'OK'
  registerFeedback(feedBack, status, text)
  console.log(feedBack)
  jQ(this).closest('.message').find('.shoutout').hide()
})

jQ('body').on('click', '.fa-bullhorn', function() {
  var text = jQ(this).closest('.message').find('.botmessage').text()
  var status = 'not OK'
  var bullhornText = jQ(this).closest('tr').find('.shoutout_msg').val()
  registerFeedback(feedBack, status, text, bullhornText)
  console.log(feedBack)
  jQ(this).closest('.shoutout').hide()
})

function registerFeedback(feedback, status, text, shoutout) {
  var check = checkFeedback(feedback, text)
  if (check < 0) {
    addToFeedback(feedBack, status, text)
  } else {
    modifyFeedback(feedBack, check, status, shoutout)
  }
}

function checkFeedback(feedback, text) {
  var index = -1
  if (feedback.logs.length < 1) {
    return -1
  }
  for (var i = 0; i < feedback.logs.length; i++) {
    if (feedback.logs[i].text === text) {
      index = i
    }
  }
  return index
}

function modifyFeedback(feedback, index, status, message) {
  feedback.logs[index].status = status
  if (message) {
    feedback.logs[index].feedback = message
  } else {
    feedback.logs[index].feedback = 'NA'
  }
}

function addToFeedback(feedback, stat, mtext) {
  feedback.logs.push({
    status: stat,
    text: mtext
  })
}

var setTimeoutID
jQ('#minim-chat').click(function() {
  jQ('#minim-chat').css('display', 'none')
  jQ('#maxi-chat').css('display', 'block')
  // var height = (jQ(".chat").outerHeight(true) - 46) * -1;
  // jQ(".chat").css("margin", "0 0 " + height + "px 0");
  jQ('.chat').css('margin', '0 0 -344px 0')
  setTimeoutID = setTimeout(function() {
    jQ('#animHelpText').css('display', 'block')
  }, 1500)
})
jQ('#maxi-chat').click(function() {
  jQ('#minim-chat').css('display', 'block')
  jQ('#maxi-chat').css('display', 'none')
  jQ('.chat').css('margin', '0')
  jQ('#animHelpText').css('display', 'none')
  clearTimeout(setTimeoutID)
})

jQ('#generalForm').bind('submit', submitForm)

jQ(document).ready(function() {
  $userInputField = jQ('#userInputText')
})