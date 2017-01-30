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
		CURRENT_LOCATION: "currentLocation",
		CURRENT_QUESTION: "currentQuestion",
		PLAYER_NAME: "playerName"
	}
};

app.launch(function(request, response) {
	// Initialise global session variables
	var session = request.getSession();
	session.set(app.constant.SESSION.CURRENT_QUESTION, 1);

	var prompt = "Welcome to times table wizard. Who is playing?";
	var reprompt = "Please tell me your name.";
	response.say(prompt).reprompt(reprompt).shouldEndSession(false);
});

app.intent("PlayerNamePromptIntent", helper.intentSchema.PLAYER_NAME_PROMPT, function(request, response) {
	var firstName = request.slot("FIRSTNAME");

	if (_.isEmpty(firstName)) {
		var prompt = "Sorry I didn\'t catch your name. Please tell me your name.";
		response.say(prompt).shouldEndSession(false);
	} else {
		var namedGreeting = _.template("Hi ${playerName}. Would you like to practice your times table or play a quiz?")({ 
			playerName: firstName 
		});
		var session = request.getSession();
		session.set(app.constant.SESSION.PLAYER_NAME, firstName);
		response.say(namedGreeting).shouldEndSession(false);
	}
});

app.intent("ChooseActivityTypeIntent", helper.intentSchema.CHOOSE_ACTIVITY_TYPE, function(request, response) {
	var activityType = request.slot("ACTIVITY");
	var session = request.getSession();

	session.set(app.constant.SESSION.ACTIVITY_TYPE, activityType);
	session.set(app.constant.SESSION.CURRENT_LOCATION, helper.location.NAME_PROMPT);
	
	if (activityType === helper.activityType.PRACTICE) {
		session.set(app.constant.SESSION.CURRENT_LOCATION, helper.location.AWAITING_PRACTICE_NUMBER);
		response.say("Ok. Which times table would you like to practice?").shouldEndSession(false);

	} else if (activityType == helper.activityType.QUIZ) {
		response.say("Ok. Which times table would you like me to quiz you on??").shouldEndSession(false);
	}
});

app.intent("SpokenNumberIntent", helper.intentSchema.SPOKEN_NUMBER, function(request, response) {
	var answers;
	var number = request.slot("NUMBER");
	var session = request.getSession();
	var currentLocation = session.get(app.constant.SESSION.CURRENT_LOCATION);

	if (currentLocation === helper.location.AWAITING_PRACTICE_NUMBER) {
		// Set number and begin quiz
		session.set(app.constant.SESSION.CURRENT_LOCATION, helper.location.PRACTICE_STARTED);
		//response.say("Ok let's practice our 2 times table. Would you like to hear me read out the 2 times table first?").shouldEndSession(false); (YES/NO)

		// Generate a list of questions and answers for the requested number and store in session
		answers = helper.getAnswerList(number);
		session.set(app.constant.SESSION.ANSWERS, answers);

		// Ask first question
		response.say(answers[0].question).shouldEndSession(false);

	} else if (currentLocation == helper.location.PRACTICE_STARTED) {
		var currentQuestion = session.get(app.constant.SESSION.CURRENT_QUESTION);
		answers = session.get(app.constant.SESSION.ANSWERS);

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
	}
});

module.exports = app;