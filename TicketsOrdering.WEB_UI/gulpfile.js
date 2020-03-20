const gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    browser = require('browser-sync'),
    uglify = require('gulp-uglify-es').default,
    streamify = require('gulp-streamify'),
    babel = require('gulp-babel'),
    iif = require('gulp-if'),
    es = require('event-stream');
//clean        = require('del');

let isBuild;

// ---- PATH CONFIG ---- //

let config = {
    login: {
        js: "./FrontEnd/js/login/**/*.js",
        sass: "./FrontEnd/css/login/**/*.+(scss|sass|css)"
    },
    student: {
        js: "./FrontEnd/js/student/**/*.js",
        sass: "./FrontEnd/css/student/**/*.+(scss|sass|css)"
    },
    layout: {
        js: "./FrontEnd/js/layout/**/*.js",
        sass: "./FrontEnd/css/layout/**/*.+(scss|sass|css)"
    },
    signup: {
        js: "./FrontEnd/js/signup/**/*.js",
        sass: "./FrontEnd/css/signup/**/*.+(scss|sass|css)"
    },
    page: {
        js: "./FrontEnd/js/page/**/*.js",
        sass: "./FrontEnd/css/page/**/*.+(scss|sass|css)"
    }
};

let fontsConfig = {
    src: "./FrontEnd/fonts/*{ttf,woff,woff2,svg,eot}",
    dest: "./wwwroot/fonts/"
}

// --------------------- //

const cssLibs = ['./node_modules/select2/dist/css/select2.min.css',                 
'./node_modules/air-datepicker/dist/css/datepicker.min.css',
'./node_modules/datatables.net-dt/css/jquery.dataTables.min.css'
];

const jsLibs = ['./node_modules/jquery/dist/jquery.min.js',
                './node_modules/select2/dist/js/select2.full.min.js',
                './node_modules/air-datepicker/dist/js/datepicker.min.js',
                './node_modules/datatables.net/js/jquery.dataTables.min.js'
            ];

//--------------//
//  GULP TASKS  //
//--------------//

//#region Commented tasks
// gulp.task('clean', async function() {
//     clean.sync(paths.dist.folder);
// });

// gulp.task('fontawesome', async function() {
//     return gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*.+(eot|svg|woff|woff2|ttf)')
//                 .pipe(gulp.dest(paths.distWebfonts));
// });

// gulp.task('locaization', async function() {
//     return gulp.src('./src/localization/russian.json')
//                 .pipe(gulp.dest(paths.distJs + 'localization/'));
// });

// gulp.task('js-libs', async function() {
//     return gulp.src(jsLibs)
//             .pipe(concat('libs.js'))
//             .pipe(gulp.dest(paths.distJs));       
// });

//#endregion

gulp.task('dt-images', function() {
    return gulp.src('./node_modules/datatables.net-dt/images/*')
        .pipe(gulp.dest('./wwwroot/images/'));
});

gulp.task('icons', function() {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('./wwwroot/fonts/'));
});

gulp.task('css-libs', async function() {
    return gulp.src(cssLibs)
            .pipe(concat('libs.css'))     
            .pipe(gulp.dest('./wwwroot/css/'));
});

gulp.task('js-libs', async function() {
    return gulp.src(jsLibs)
            .pipe(concat('libs.js'))
            .pipe(gulp.dest('./wwwroot/js/'));       
});

gulp.task('fonts', async function() {
    return gulp.src(fontsConfig.src)
    .pipe(gulp.dest(fontsConfig.dest))
});

gulp.task('js', async function () {
    var streams = [];

    for (let key in config) {

        console.log(key);
        var s = gulp.src(config[key]["js"])
            .pipe(concat(`${key}Main.js`))
            .pipe(babel({ presets: ['@babel/env'] }))
            .pipe(iif(isBuild, streamify(uglify())))
            .pipe(gulp.dest(`./wwwroot/js/${key}/`))
            .pipe(iif(!isBuild, browser.stream()));

        streams.push(s);
    }

    return es.merge(streams);
});

gulp.task('sass', async function () {
    var streams = [];

    for (let key in config) {

        var s = gulp.src(config[key]["sass"])
        .pipe(sass({ outputStyle: isBuild ? "compressed" : "expanded" }).on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: [
                'last 25 versions',
                '> 1%',
            ],
            cascade: true
        }))
        .pipe(concat(`${key}Main.css`))
        .pipe(gulp.dest(`./wwwroot/css/${key}/`))
        .pipe(iif(!isBuild, browser.stream()));

        streams.push(s);
    }

    return es.merge(streams);
});

gulp.task('watch', async function () {
    gulp.watch('./FrontEnd/**/*.+(scss|sass)', gulp.series(['sass']), browser.reload);
    gulp.watch('./FrontEnd/**/*.js', gulp.series(['js']), browser.reload);

    gulp.watch('*.html').on('change', browser.reload);
    gulp.watch('./Views/**/*.cshtml').on('change', browser.reload);

    gulp.watch('gulpfile.js', process.exit);
});

gulp.task('browser-sync', async function () {
    browser.init({
        // server: {
        //     baseDir: './'
        // },     
        proxy: 'http://localhost:50531/',
        open: true,
        notify: false
    });
});

gulp.task('is-build', async function () {
    isBuild = true;
});

gulp.task('build', gulp.series(['is-build',
    //'locaization',
    'css-libs', 
    'js-libs', 
    'icons',
    'fonts',      
    'js',
    'sass',
    'dt-images'
    
]));

gulp.task('default', gulp.series([
    //'locaization', 
    'css-libs', 
    'js-libs', 
    'icons',  
    'fonts',
    'js',
    'sass',  
    'dt-images',  
    'browser-sync',
    'watch']));

    gulp.task('suka', function() {
        gulp.src('./FrontEnd/js/signup/**/*.js')
            .pipe(concat(`signupMain.js`))
            .pipe(babel({ presets: ['@babel/env'] }))
            .pipe(iif(isBuild, streamify(uglify())))
            .pipe(gulp.dest(`./wwwroot/js/signup/`))
            .pipe(iif(!isBuild, browser.stream()));
    })