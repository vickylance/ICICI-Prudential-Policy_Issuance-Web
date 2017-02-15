var app = angular.module('submitExample', []);
app.controller('ExampleController', ['$scope', '$http', function ($scope, $http) {
	var messages = j('.messages-content'),
		d, i = 0,
		msg = "",
		botmsg = "";

	function GetConversationId() {
		console.log("get conversationId");
		$http({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'BotConnector QiqpVfEokVI.cwA.5vE.22sCnPEo93AXDH0oESiQ9xJZR69MKklf_BleqscPR7M'
			},
			url: 'https://directline.botframework.com/api/conversations'
		}).then(function (response) {
			console.log(response);
			console.log("success");
			$scope.conversationId = response.data['conversationId'];
			j('<div class="message loading new"><span></span></div>').appendTo(j('.mCSB_container'));
			setTyping();
			updateScrollbar();
			setTimeout(function () {
				PostMessage();
			}, 1000);
		});
	};

	function PostMessage() {
		$http({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'BotConnector QiqpVfEokVI.cwA.5vE.22sCnPEo93AXDH0oESiQ9xJZR69MKklf_BleqscPR7M'
			},
			url: 'https://directline.botframework.com/api/conversations/' + $scope.conversationId + '/messages',
			data: {
				"conversationId": $scope.conversationId,
				"text": $scope.name
			}
		}).success(function (data, status) {
			setTimeout(function () {
				GetMessage();
			}, 5000);
		});
	};

	function GetMessage() {
		$http({
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'BotConnector QiqpVfEokVI.cwA.5vE.22sCnPEo93AXDH0oESiQ9xJZR69MKklf_BleqscPR7M'
			},
			url: 'https://directline.botframework.com/api/conversations/' + $scope.conversationId + '/messages',
		}).success(function (response) {
			botMessage(response["messages"][1]["text"]);
		});
	};

	$scope.submit = function () {
		insertMessage(j('.message-input').val());
		if ($scope.name) {
			GetConversationId();
		}
	};

	j(window).load(function () {
		messages.mCustomScrollbar();
		setTimeout(function () {
			botMessage("Hi! I'm your insurance advisor. How may I help you.");
			botMessage('how would you rate this convo',true);
		}, 100);
	});

	function updateScrollbar() {
		messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
			scrollInertia: 10,
			timeout: 0
		});
	};

	function formatAMPM(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	};

	function setDate(t) {
		d = new Date();
		j('<div class="timestamp">' + formatAMPM(d) + '</div>').appendTo(t);
	};

	function setTyping() {
		j('<div class="timestamp">Typing...</div>').appendTo(j('.message:last'));
	};

	function insertMessage(msg) {
		if (j.trim(msg) == '') {
			return false;
		}
		var temp = j('<div class="message message-personal">' + msg + '</div>');
		temp.appendTo(j('.mCSB_container')).addClass('new');
		setDate(temp);
		j('.message-input').val(null);
		updateScrollbar();
	};

	function botMessage(botmsg, feedback) {
		if (j('.message-input').val() != '') {
			return false;
		}
		j('.message.loading').remove();
		j('.message.timestamp').remove();
		var temp = j('<div class="message"><figure class="avatar"><img src="icon.png" /></figure>' + botmsg + '</div>');
		temp.appendTo(j('.mCSB_container')).addClass('new');
		setDate(temp);
		updateScrollbar();
		playSound('bing');

		if(feedback !== undefined){
			console.log("true");
			j('.message.loading').remove();
			j('.message.timestamp').remove();
			var temp = j('<div class="message"><figure class="avatar"><img src="icon.png" /></figure>Please provide a feedback<br /><img class="chatBtn emoji" rating="5" src="images/happy.png"/><img class="chatBtn emoji" rating="4" src="images/good.png"/><img class="chatBtn emoji" rating="3" src="images/okay.png"/><img class="chatBtn emoji" rating="2" src="images/bad.png"/><img class="chatBtn emoji" rating="1" src="images/poor.png"/><br /><table><tr><td> Enter your comments: </td><td><textarea id="comment" name="comments" placeholder="Please enter your comments here here"></textarea></td></tr></table><input class="chatBtn" id="send_feedback" type="submit" value="Send" /></div>');
			temp.appendTo(j('.mCSB_container')).addClass('new');
			setDate(temp);
			updateScrollbar();
			playSound('bing');
		}


	};

	function playSound(filename) {
		document.getElementById("sound").innerHTML = '<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename + '.mp3" /></audio>';
	};

	j("body").on("click",".emoji",function(){
		insertMessage(j(this).attr("rating"));
	});

}]);

var setTimeoutID;
j("#minim-chat").click(function () {
	j("#minim-chat").css("display", "none");
	j("#maxi-chat").css("display", "block");
	// var height = (j(".chat").outerHeight(true) - 46) * -1;
	// j(".chat").css("margin", "0 0 " + height + "px 0");
	j(".chat").css("margin", "0 0 -344px 0");
	setTimeoutID = setTimeout(function () {
		j("#animHelpText").css("display", "block");
	}, 1500);
});
j("#maxi-chat").click(function () {
	j("#minim-chat").css("display", "block");
	j("#maxi-chat").css("display", "none");
	j(".chat").css("margin", "0");
	j("#animHelpText").css("display", "none");
	clearTimeout(setTimeoutID);
});