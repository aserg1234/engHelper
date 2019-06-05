const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');

sass.compiler = require('node-sass');
///////////////////////////////////////////////////
//модули js
// убирает лишние пробелы и делает код в одну строку
//const uglify = require('gulp-uglify');

// объединить все файлы js в один
const concat = require('gulp-concat');

// связать минифицированный/объединённый файл с файлами, из которых он получился
const sourcemaps = require('gulp-sourcemaps');
//////////////////////////////////////



///////////////////////////////////////////////////////

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

  //добавляю json database  задачи
  gulp.task('json', function(){
    return gulp.src([
            'source/dbase/**/*',
        ])
        .pipe(gulp.dest('build/dbase'));

});

  //добавляю js задачи
gulp.task('js', function(){
    return gulp.src([
            'source/js/validation.js',
            'source/js/form.js',
            'source/js/navigation.js',  
            'source/js/controlPanel.js',
            'source/js/accessMenu.js',
            'source/js/style.js',          
            'source/js/main.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));

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
    gulp.watch('source/js/**/*.js', gulp.series('js'));  
    gulp.watch('source/js/**/*.json', gulp.series('json'));    
    
});


//default делаю команду в командн строке gulp compile
//выполнится все что находится в этом блоке
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy', 'js', 'json'),
    gulp.parallel('watch', 'server')
    )
);






