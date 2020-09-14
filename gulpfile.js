var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');
//定义目录路径
var profilename="SYSZZY"
var app = {
    //源文件
    srcPath: 'src/'+profilename,
    //调试文件
    devPath: 'test/'+profilename,
    //打包后文件
    prdPath: 'dist/'+profilename
};

//开发文件监听和本地服务配置
gulp.task("writejs", async function() {
    await gulp.src([app.srcPath + "/js/**/*.js", app.srcPath + "/js/*.js"])
        .pipe(gulp.dest(app.devPath + "/js"))
        .pipe($.connect.reload())
});
gulp.task("writecss", async function() {
    await gulp.src([app.srcPath + "/css/**/*.css", app.srcPath + "/css/*.css"])
        .pipe(gulp.dest(app.devPath + "/css"))
        .pipe($.connect.reload())
});
gulp.task("writehtml", async function() {
    await gulp.src([app.srcPath + "/page/**/*.html", app.srcPath + "/page/*.html"])
        .pipe(gulp.dest(app.devPath + "/page"))
        .pipe($.connect.reload())
    await gulp.src([app.srcPath + "/*.html"])
        .pipe(gulp.dest(app.devPath))
        .pipe($.connect.reload())
});
gulp.task("writefile", async function() {
    await gulp.src(app.srcPath + "/Widget/**/*")
        .pipe(gulp.dest(app.devPath + "/Widget"))
    await gulp.src(app.srcPath + "/images/**/*")
        .pipe(gulp.dest(app.devPath + "/images"))
});
gulp.task('revcss', async function() {
    await gulp.src([app.srcPath + "/css/**/*.css", app.srcPath + "/css/*.css"])
        .pipe($.rev())
        .pipe($.rev.manifest())
        .pipe(gulp.dest(app.devPath + "/rev/css"))
})
gulp.task('revjs', async function() {
    await gulp.src([app.srcPath + "/js/**/*.js", app.srcPath + "/js/*.js"])
        .pipe($.rev())
        .pipe($.rev.manifest())
        .pipe(gulp.dest(app.devPath + "/rev/js"))
})

gulp.task("watchjs", async function() {
    await gulp.watch([app.srcPath + "/js/**/*.js", app.srcPath + "/js/*.js"], gulp.series("writejs"))
})
gulp.task("watchcss", async function() {
    await gulp.watch([app.srcPath + "/css/**/*.css", app.srcPath + "/css/*.css"], gulp.series("writecss"))
})
gulp.task("watchhtml", async function() {
        await gulp.watch([app.srcPath + "/*.html", app.srcPath + "/page/*.html", app.srcPath + "/page/**/*.html"], gulp.series("writehtml"))
    })
    //启动本地服务
gulp.task("server", async function() {
        await $.connect.server({
            root: "test",
            port: 8888,
            livereload: true
        })
    })
    //打开浏览器
gulp.task("open", async function() {
    await open('http://localhost:8888/' + profilename + '/login.html')
    await $.connect.reload()
})
gulp.task("write", gulp.parallel("writejs", "writecss", "writehtml", "writefile", "revcss", "revjs"))
    //所有监听合为一起
gulp.task("watch", gulp.parallel("watchjs", "watchcss", "watchhtml"))

gulp.task("default", gulp.series("write", "server", "watch", "open"))

//为css中引入的图片/字体等添加hash编码
gulp.task('rev', async function() {
    await gulp.src([app.devPath + '/rev/**/*.json', app.devPath + '/*.html'])
        .pipe($.revCollector())
        .pipe(gulp.dest(app.devPath));
    await gulp.src([app.devPath + '/rev/**/*.json', app.devPath + '/page/**/*.html'])
        .pipe($.revCollector())
        .pipe(gulp.dest(app.devPath + '/page'));
})

gulp.task('clean', async function() {
    await gulp.src([app.prdPath + "/*", app.devPath + "/*"])
        .pipe($.clean());
})

//打包配置
gulp.task("minhtml", async function() {
    await gulp.src(app.devPath + "/*.html")
        .pipe($.minifyHtml())
        .pipe(gulp.dest(app.prdPath))
    await gulp.src(app.devPath + "/page/**/*.html")
        .pipe($.minifyHtml())
        .pipe(gulp.dest(app.prdPath + "/page"))
})

gulp.task("mincss", async function() {
    await gulp.src([app.devPath + "/css/*.css", app.devPath + "/css/**/*.css"])
        .pipe($.minifyCss())
        .pipe(gulp.dest(app.prdPath + "/css"))
})
gulp.task("minjs", async function() {
    await gulp.src([app.devPath + "/js/**/*.js", app.devPath + "/js/*.js"])
        .pipe($.plumber())
        .pipe($.babel())
        .pipe($.uglify())
        .pipe(gulp.dest(app.prdPath + "/js"))
})

// gulp.task("minimg", async function() {
//     await gulp.src(app.devPath + "/images/**/*.{jpg,png}")
//         .pipe($.plumber())
//         .pipe($.imagemin())
//         .pipe(gulp.dest(app.prdPath + "/images"))
// })
gulp.task("copyfile", async function() {
    await gulp.src(app.devPath + "/Widget/**/*")
        .pipe(gulp.dest(app.prdPath + "/Widget"))
    await gulp.src(app.devPath + "/images/**/*")
        .pipe(gulp.dest(app.prdPath + "/images"))
});

gulp.task("build", gulp.parallel("mincss", "minjs", "minhtml", "copyfile"))