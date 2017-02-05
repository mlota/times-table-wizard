"use strict";
module.change_code = 1;
var Alexa = require("alexa-app");
var app = new Alexa.app("timestablewizard");
var _ = require("lodash");
var AppHelper = require("./apphelper");
var helper = new AppHelper();

app.constant = {
	SESSION: {
		ACTIVITY_TYPE: "activityType",
		ANSWERS: "answers",
		STATE: "currentState",
		CURRENT_QUESTION: "currentQuestion",
		PLAYER_NAME: "playerName",
		CHOSEN_PRACTICE_NUMBER: "chosenPracticeNumber"
	}
};

app.launch(function(request, response) {
	var session = request.getSession();
	session.set(app.constant.SESSION.CURRENT_QUESTION, 1);
	session.set(app.constant.SESSION.STATE, helper.state.INTRODUCTION);

	var prompt = "Welcome to times table wizard. Who is playing?";
	var reprompt = "Please tell me your name.";
	response.say(prompt).reprompt(reprompt).shouldEndSession(false);
});

app.intent("PlayerNamePromptIntent", helper.intentSchema.PLAYER_NAME_PROMPT, function(request, response) {
	var session = request.getSession();
	var state = session.get(app.constant.SESSION.STATE);
	
	// Check if user has accidentally entered this intent whilst answering practice questions
	if (state === helper.state.AWAITING_PRACTICE_NUMBER || state == helper.state.PRACTICE_STARTED) {
		response.say("Sorry I didn't recognise your answer, could you please repeat it?").shouldEndSession(false);
		//return true;
	} else {
		session.set(app.constant.SESSION.STATE, helper.state.AWAITING_NAME);
		var firstName = request.slot("FIRSTNAME");

		if (_.isEmpty(firstName)) {
			var prompt = "Sorry I didn't catch your name. Please tell me your name.";
			response.say(prompt).shouldEndSession(false);
		} else {
			session.set(app.constant.SESSION.PLAYER_NAME, firstName);
			session.set(app.constant.SESSION.STATE, helper.state.AWAITING_PRACTICE_NUMBER);

			var namedGreeting = _.template("Hi ${playerName}. Which times table would you like to practice?")({ 
				playerName: firstName 
			});
			var reprompt = "Please say a number between 1 and 12";
			response.say(namedGreeting).reprompt(reprompt).shouldEndSession(false);
		}
	}
});

app.intent("SpokenNumberIntent", helper.intentSchema.SPOKEN_NUMBER, function(request, response) {
	var answers;
	var number = parseInt(request.slot("NUMBER"));
	var session = request.getSession();
	var state = session.get(app.constant.SESSION.STATE);
	var playerName = session.get(app.constant.SESSION.PLAYER_NAME);

	if (state === helper.state.AWAITING_PRACTICE_NUMBER) {
		if (!helper.isValidNumber(number)) {
			response.say("Sorry, you must specify a number between 1 and 12.").shouldEndSession(false);
			return true;
		}

		session.set(app.constant.SESSION.CHOSEN_PRACTICE_NUMBER, number);
		session.set(app.constant.SESSION.STATE, helper.state.PRACTICE_STARTED);

		// Generate a list of questions and answers for the requested number and store in session
		answers = helper.getAnswerList(number);
		session.set(app.constant.SESSION.ANSWERS, answers);
		response.say("Ok great. Let's practice our " + number + " times table. Would you like to hear me read out the " + number + " times table first?").shouldEndSession(false);

	} else if (state == helper.state.PRACTICE_STARTED) {
		var currentQuestion = session.get(app.constant.SESSION.CURRENT_QUESTION);
		answers = session.get(app.constant.SESSION.ANSWERS);

		if (currentQuestion < helper.constant.TIMES_TABLE_MAX_VALUE) {
			// Set answer in the session
			var updatedAnswers = _.map(answers, function(obj){
				if (obj.number === currentQuestion) {
					var newObj = obj;
					newObj.givenAnswer = number;
					return newObj;
				}
				return obj;
			});

			session.set(app.constant.SESSION.ANSWERS, updatedAnswers);
			session.set(app.constant.SESSION.CURRENT_QUESTION, currentQuestion + 1);
			response.say(answers[currentQuestion].question).shouldEndSession(false);

		} else {
			session.set(app.constant.SESSION.STATE, helper.state.PRACTICE_FINISHED);
			// Read answers
			var score = helper.checkScore(answers);
			var resultSpeech = helper.getResultSpeech(score, playerName);
			response.say(resultSpeech).shouldEndSession(true);
		}
	}
});

app.intent("AMAZON.YesIntent", function(request, response) {
	var session = request.getSession();
	session.set(app.constant.SESSION.STATE, app.constant.SESSION.READING_NUMBERS);
	var number = session.get(app.constant.SESSION.CHOSEN_PRACTICE_NUMBER);

	var prompt = helper.getSpeechForTimesTable(number);
	response.say(prompt).shouldEndSession(false);
});

app.intent("AMAZON.NoIntent", function(request, response) {
	// If user has specified no, then start the practice session
	var session = request.getSession();
	var answers = session.get(app.constant.SESSION.ANSWERS);

	response.say("Ok, then let's begin our practice.").shouldEndSession(false);
	session.set(app.constant.SESSION.STATE, helper.state.PRACTICE_STARTED);

	// Ask first question
	response.say(answers[0].question).shouldEndSession(false);
});

module.exports = app;