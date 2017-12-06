var gulp = require("gulp");
var concat = require("gulp-concat");
var watch = require("gulp-watch");
var clean = require("gulp-clean");
var babel = require("gulp-babel");// for es6
var revReplace = require("gulp-rev-replace");
var fileincluder = require("gulp-file-include"); //html  include
var revAll = require("gulp-rev-all"); //html  include
var rev = require("gulp-rev"); //add   file hash  suffix
var collector = require("gulp-rev-collector"); //replace  link to hash type
var browserSync = require("browser-sync").create(); //browser sync
var bs = require("browser-sync") //browser sync
var revAppend = require("gulp-rev-append"); //browser sync

var sass = require("gulp-sass");

gulp.task("browser-sync", function () {
        browserSync.init({
            server: {
                baseDir: "./",
                index: "index.html"
            }
        })
        gulp.start("watch");
        gulp.watch("*.html").on('change', browserSync.reload);
    })
    //src
var objSrc = {
    jsSrc: ["public/src/js/strong.js", "public/src/js/service/*.js", "public/src/js/resource/*.js", "public/src/js/director/*.js", "public/src/js/filter/*.js", "public/src/js/controller/*.js"],
    cssSrc: ["public/src/scss/*.scss"],
    cleanSrc: ['public/dist/index.html'],
    htmlSrc: ['public/src/html/**/*.html']
}

//html includer
gulp.task("fileincluder", function () {  

    return gulp.src("public/src/html/index.html")
        .pipe(fileincluder({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest("./"))
        .pipe(revAppend())
        .pipe(gulp.dest("./"))
})

//js
gulp.task('js', function () {
    gulp.src(objSrc.jsSrc)
        .pipe(babel({
            "presets": ["env"],
            "plugins": ['transform-regenerator','transform-es2015-spread']
        }))
        .pipe(concat("app.js"))
        .pipe(gulp.dest("./public/dist/js/"))
        .pipe(browserSync.reload({
            stream: true
        }))
})

//sass
gulp.task('sass',function(){
    gulp.src(objSrc.cssSrc)
        .pipe(sass({outputStyle: 'expanded'}).on('error',sass.logError))
        .pipe(gulp.dest("./public/dist/css/"))
        .pipe(browserSync.reload({
            stream: true
        }))
})
//htmlwatch
gulp.task("html-watch", ['fileincluder'], browserSync.reload)

//watch
gulp.task('watch', function () {
    gulp.watch(objSrc.jsSrc, ['js']);
    gulp.watch(objSrc.htmlSrc, ['html-watch']);
    gulp.watch(objSrc.cssSrc, ['sass']);
})

//clean
gulp.task('clean', function () {
    gulp.src(objSrc.cleanSrc)
        .pipe(clean());
})

gulp.task("default", function () {
    gulp.run("js", "fileincluder");
})
