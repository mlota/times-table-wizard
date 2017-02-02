"use strict";
var chai = require("chai");
var expect = chai.expect;
var AppHelper = require("../apphelper");

describe("AppHelper", function() {
	var appHelper = new AppHelper();
	describe("#getSpeechForTimesTable", function() {
		context("when passing a value of 2", function() {
			var result = appHelper.getSpeechForTimesTable(2);
			it("returns a speech string with multiples of 2", function() {
				return expect(result).to.equal("1 times 2 is 2, 2 times 2 is 4, 3 times 2 is 6, 4 times 2 is 8, 5 times 2 is 10, 6 times 2 is 12, 7 times 2 is 14, 8 times 2 is 16, 9 times 2 is 18, 10 times 2 is 20, 11 times 2 is 22, 12 times 2 is 24");
			});
		});
	});
	describe("#getAnswerTable", function() {
		context("when passing a value of 3", function() {
			var result = appHelper.getAnswerTable(3);
			it("returns a valid answer table", function() {
				return expect(result[1]).to.equal(6);
			});
		});
	});
	describe("#getAnswerList", function() {
		context("when passing a value of 3", function() {
			var result = appHelper.getAnswerList(3);
			it("returns a valid answer table", function() {
				return expect(result[1].answer).to.equal(6);
			});
		});
	});
	describe("#isValidNumber", function() {
		context("when passing a numeric value", function() {
			it("should be false for 0", function() {
				return expect(appHelper.isValidNumber(0)).to.equal(false);
			});
			it("should be true for 5", function() {
				return expect(appHelper.isValidNumber(5)).to.equal(true);
			});
			it("should be true for 12", function() {
				return expect(appHelper.isValidNumber(12)).to.equal(true);
			});
			it("should be false for 13", function() {
				return expect(appHelper.isValidNumber(13)).to.equal(false);
			});
		});
	});
	describe("#checkScore", function() {
		context("when passing a set of answers for the 3 times table", function() {
			var answerList = appHelper.getAnswerList(3);
			answerList[0].givenAnswer = 3;
			answerList[1].givenAnswer = 6;
			answerList[2].givenAnswer = 9;
			answerList[3].givenAnswer = 12;
			answerList[4].givenAnswer = 15;
			answerList[7].givenAnswer = 24;
			var result = appHelper.checkScore(answerList);
			it("returns the correct score", function() {
				return expect(result).to.equal(6);
			});
		});
	});
});