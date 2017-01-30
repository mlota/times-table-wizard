"use strict";
var TIMES_TABLE_MAX_VALUE = 12;
function MathsUtils() {}

MathsUtils.prototype.simpleSum = function(a, b) {
	return a + b;
};

MathsUtils.prototype.createAnswerTable = function(multiple) {
	var answerTable = [];
	for (var i = 1; i <= TIMES_TABLE_MAX_VALUE; i++) {
		answerTable.push(i * multiple);
	}
	return answerTable;
};

module.exports = MathsUtils;