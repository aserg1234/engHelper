const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');

sass.compiler = require('node-sass');

//код из сайта browser-sync
//изменяю настройки добавляю port:3501
// меняю baseDir: "./"
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 3501,
            baseDir: "build"
        }
    });
    //добавляю смотрителя за изменениями
    //+ добавляю обработку-реакцию на изменения в папках
    gulp.watch('build/**/*').on('change', browserSync.reload);
    
});

//создаю gulp-pug компиляцию наших шаблонов
//точка входа
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/templates/index.pug')
    .pipe(pug({
      // Your options in here.
      // делаю код красивым(не в одну строку)
      pretty: true
    }))
    //указ куда положить
    .pipe(gulp.dest('build'))
  });

//создаю gulp-sass 
//точка входа
gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')
      .pipe(sass(/*{outputStyle: 'compressed'}*/).on('error', sass.logError))
      .pipe(rename('main.min.css'))
      .pipe(gulp.dest('build/css'));
  });


// создаю gulp sprites 
gulp.task('sprite', function (cb) {
    var spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprite.png',
      cssName: 'sprite.scss'
    }));
    //в базовом варианте картинки и стили вместе
    //здесь они раздельно
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));    
    cb();
 
});

//создаю функцию(задачу очищения папки build)
gulp.task('clean', function del(cb){
    return rimraf('build', cb);
});

//копирую шрифты в папку build
gulp.task('copy:fonts', function(){
    return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

//копирую картинки в папку build
gulp.task('copy:images', function(){
    return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

//объединенная задача копирования картинок и шрифтов
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

//добавляем вотчеры для sass и pug
gulp.task('watch', function(){
    gulp.watch('source/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));    
});

//default делаю команду в командн строке gulp compile
//выполнится все что находится в этом блоке
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
    )
);






