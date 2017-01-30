"use strict";
var chai = require("chai");
var expect = chai.expect;
var MathsUtils = require("../mathsutils");
var AppHelper = require("../apphelper");

describe("MathsUtilsHelper", function() {
	var utils = new MathsUtils();
	describe("#simpleSum", function() {
		context("when passing two numeric values", function() {
			it("returns correct sum of figures", function() {
				var value = utils.simpleSum(1,1);
				return expect(value).to.equal(2);
			});
		});
	});
	describe("#createAnswerTable", function() {
		context("when passing a multiple", function() {
			var value = utils.createAnswerTable(2);
			it("returns an array with answers", function() {
				return expect(value.length).to.equal(12);
			});
			it("has correct values for multiples", function() {
				return expect(value[1]).to.equal(4);
			});
		});
	});
});

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
});