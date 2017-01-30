"use strict";

var gulp = require("gulp");
var zip = require("gulp-zip");

gulp.task("deploy", function() {
	return gulp.src([
		"*.js", 
		"!gulpfile.js",
		"node_modules/**/*",
		"node_modules/**/.*",
		"node_modules/.**/*",
		"node_modules/.**/.*"], {base: "."})
		.pipe(zip("times-table-wizard-" + new Date().toISOString().substring(0, 10) + ".zip"))
		.pipe(gulp.dest("dist"));
});

gulp.task("default", ["deploy"]);