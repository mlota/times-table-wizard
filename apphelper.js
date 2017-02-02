var _ = require("lodash");

function AppHelper() {}

AppHelper.prototype.intentSchema = {
	PLAYER_NAME_PROMPT: {
		"slots": {
			"FIRSTNAME": "AMAZON.GB_FIRST_NAME"
		},
		"utterances": ["{my name is} {-|FIRSTNAME}", "{-|FIRSTNAME}"]
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
		"utterances": [
			"{|I want to practice|I would like to practice|practice} {|my} {-|NUMBER} {times table}", 
			"{|hmm|err} {|I think|it's|is it} {-|NUMBER}"
		]
	}
};

AppHelper.prototype.constant = {
	TIMES_TABLE_MAX_VALUE: 12
};

AppHelper.prototype.state = {
	INTRODUCTION: "Introduction",
	AWAITING_NAME: "AwaitingName",
	NAME_SPECIFIED: "NameSpecified",
	AWAITING_PRACTICE_NUMBER: "AwaitingPracticeNumber",
	PRACTICE_STARTED: "PracticeStarted",
	READING_NUMBERS: "ReadingNumbers"
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

AppHelper.prototype.checkScore = function(answers) {
	var correctAnswers = 0;
	_.each(answers, function(answer) {
		if (answer.givenAnswer === answer.answer) {
			correctAnswers++;
		}
	});
	return correctAnswers;
};

AppHelper.prototype.isValidNumber = function(number) {
	return _.inRange(number, 1, this.constant.TIMES_TABLE_MAX_VALUE + 1);
};

module.exports = AppHelper;