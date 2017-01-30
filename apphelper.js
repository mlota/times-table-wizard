var _ = require("lodash");

function AppHelper() {}

AppHelper.prototype.intentSchema = {
	PLAYER_NAME_PROMPT: {
		"slots": {
			"FIRSTNAME": "AMAZON.GB_FIRST_NAME"
		},
		"utterances": ["{-|FIRSTNAME}"]
	},
	CHOOSE_ACTIVITY_TYPE: {
		"slots": {
			"ACTIVITY": "ACTIVITYTYPES"
		},
		"utterances": ["{-|ACTIVITY}"]
	},
	SPOKEN_NUMBER: {
		"slots": {
			"NUMBER": "AMAZON.NUMBER"
		},
		"utterances": ["{-|NUMBER}"]
	}
};

AppHelper.prototype.constant = {
	TIMES_TABLE_MAX_VALUE: 12
};

AppHelper.prototype.location = {
	INTRODUCTION: "Introduction",
	NAME_PROMPT: "NamePrompt",
	AWAITING_PRACTICE_NUMBER: "AwaitingPracticeNumber",
	PRACTICE_STARTED: "PracticeStarted"
};

AppHelper.prototype.activityType = {
	PRACTICE: "practice",
	QUIZ: "quiz"
};

AppHelper.prototype.getSpeechForTimesTable = function(number) {
	var speechTemplate = _.template("${iteration} times ${number} is ${answer}");
	var speech = [];

	for (var i = 1; i <= this.constant.TIMES_TABLE_MAX_VALUE; i++) {
		speech.push(speechTemplate({
			iteration: i,
			number: number,
			answer: i * number
		}));
	}
	var joined = speech.join(", ");
	return joined;
};

AppHelper.prototype.getAnswerTable = function(number) {
	var answers = [];
	for (var i = 1 ; i <= this.constant.TIMES_TABLE_MAX_VALUE; i++) {
		answers.push(i * number);
	}
	return answers;
};

AppHelper.prototype.getAnswerList = function(number) {
	var answers = [];
	for (var i = 1 ; i <= this.constant.TIMES_TABLE_MAX_VALUE; i++) {
		var obj = {
			number: i,
			question: i + " times " + number + " is?",
			answer: i * number,
			givenAnswer: 0
		};
		answers.push(obj);
	}
	return answers;
};

module.exports = AppHelper;