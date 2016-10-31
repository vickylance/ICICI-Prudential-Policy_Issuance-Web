var app = angular.module('submitExample', []);
app.controller('ExampleController', ['$scope', '$http', function ($scope, $http) {
	var messages = j('.messages-content'), d, i = 0, msg = "", botmsg = "";

	function GetConversationId() {
		console.log("get conversationId");
		$http({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'BotConnector hd54uUzzX8A.cwA.vC4.3WYZBNcDR-9yYQ1fTbiR_B-fH3A1PD6AFiKF-l3BDvA'
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
	}

	function PostMessage() {
		$http({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'BotConnector hd54uUzzX8A.cwA.vC4.3WYZBNcDR-9yYQ1fTbiR_B-fH3A1PD6AFiKF-l3BDvA'
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
	}

	function GetMessage() {
		$http({
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'BotConnector hd54uUzzX8A.cwA.vC4.3WYZBNcDR-9yYQ1fTbiR_B-fH3A1PD6AFiKF-l3BDvA'
			},
			url: 'https://directline.botframework.com/api/conversations/' + $scope.conversationId + '/messages',
		}).success(function (response) {
			botMessage(response["messages"][1]["text"]);
		});
	}

	$scope.submit = function () {
		insertMessage(j('.message-input').val());
		if ($scope.name) {
			GetConversationId();
		}
	}

	j(window).load(function () {
		messages.mCustomScrollbar();
		setTimeout(function () {
			botMessage("Hi! I'm your tax advisor. How may I help you.");
		}, 100);
	});

	function updateScrollbar() {
		messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
			scrollInertia: 10,
			timeout: 0
		});
	}

	function formatAMPM(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	}

	function setDate(t) {
		d = new Date();
		j('<div class="timestamp">' + formatAMPM(d) + '</div>').appendTo(t);
	}

	function setTyping() {
		j('<div class="timestamp">Typing...</div>').appendTo(j('.message:last'));
	}

	function insertMessage(msg) {
		if (j.trim(msg) == '') {
			return false;
		}
		var temp = j('<div class="message message-personal">' + msg + '</div>');
		temp.appendTo(j('.mCSB_container')).addClass('new');
		setDate(temp);
		j('.message-input').val(null);
		updateScrollbar();
	}

	function botMessage(botmsg) {
		if (j('.message-input').val() != '') {
			return false;
		}
		j('.message.loading').remove();
		j('.message.timestamp').remove();
		var temp = j('<div class="message">' + botmsg + '</div>');
		temp.appendTo(j('.mCSB_container')).addClass('new');
		setDate(temp);
		updateScrollbar();
		playSound('bing');
	}

	function playSound(filename) {
		document.getElementById("sound").innerHTML = '<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename + '.mp3" /></audio>';
	}
}]);

app.controller('ChatTitleCtrl', ['$scope', function ($scope) {
	$scope.maximChatbox = function () {
		var e = document.getElementById("minim-chat");
		e.style.display = "block";
		var e = document.getElementById("maxi-chat");
		e.style.display = "none";
		var e = document.getElementById("chatbox");
		e.style.margin = "0";
		var e = document.getElementsByClassName("animHelpText")[0];
		e.style.display = "none";
	};
	$scope.minimChatbox = function () {
		var e = document.getElementById("minim-chat");
		e.style.display = "none";
		var e = document.getElementById("maxi-chat");
		e.style.display = "block";
		var e = document.getElementById("chatbox");
		e.style.margin = "0 0 -53vh 0";
		var e = document.getElementsByClassName("animHelpText")[0];
		e.style.display = "block";
	};
}]);