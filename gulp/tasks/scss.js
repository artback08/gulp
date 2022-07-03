import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css'; // Сжатие CSS файла
import webpcss from 'gulp-webpcss'; // Вывод WEBP изображений
import autoprefixer from 'gulp-autoprefixer'; // Добавление вендорных префиксов
import groupCssMediaQueries from 'gulp-group-css-media-queries'; // Группирование медиа запросов


const sass = gulpSass(dartSass);

export const scss = () => {
    return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
    .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
            message: "Error: <%= error.mesage %>"
        })))
    .pipe(app.plugins.replace(/@img\//g, '../img/'))
    .pipe(sass({
        outputStyle: 'expanded'
    }))

    //build
    .pipe(app.plugins.if(app.isBuild,
        groupCssMediaQueries())
    )
    
    // build
    .pipe(app.plugins.if(app.isBuild,
        webpcss(
        {
            webpClass: ".webp",
            noWebpClass: ".no-webp"
        }
    )))
    
    //build
    .pipe(app.plugins.if(app.isBuild,
        autoprefixer({
        grid: true,
        overrideBrowserslist: ["last 3 versions"],
        cascade: true
    })))
    
    // Не сжатый css 
    .pipe(app.gulp.dest(app.path.build.css))
    
    //build
    .pipe(app.plugins.if(app.isBuild,
    cleanCss()))
    
    .pipe(rename({
        extname: ".min.css"
    }))
    
    // Сжатый css
    //build
    .pipe(app.plugins.if(app.isBuild,
        app.gulp.dest(app.path.build.css)))

    .pipe(app.plugins.browsersync.stream());
}