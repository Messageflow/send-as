const gulp = require('gulp');
const { builder, runClean } = require('@messageflow/build');

const build = builder({ dist: '.', ignores: ['**/demo*', '**/test*'] });

gulp.task('clean', runClean([ './*.js', './*.d.ts', '!./gulpfile.js', '!./json.d.ts' ]));
gulp.task('lint', build.lint);
gulp.task('default', gulp.series(...['clean', build.lint, build.ts, build.copy]));
