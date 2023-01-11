let project_folder = require("path").basename(__dirname);
let source_folder = "#src";

let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/images/",
		fonts: project_folder + "/fonts/",
		video: project_folder + "/video/",
		vendor: project_folder + "/vendor/",
	},

	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/main.js",
		img: source_folder + "/images/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
		fonts: source_folder + "/fonts/*.ttf",
		video: source_folder + "/video/**/*.{mp3,mp4,avi,m4v,mov,wmv,mpg,mpeg}",
		vendor: source_folder + "/vendor/**/*.{js,css}",
	},

	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/images/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
		vendor: source_folder + "/vendor/**/*.{js,css}",
	},

	clean: "./" + project_folder + "/",
};

let { src, dest } = require("gulp"),
	gulp = require("gulp"),
	browsersync = require("browser-sync").create(),
	rigger = require("gulp-rigger"), // Инклюды Html, js
	del = require("del"), // Чистка папки dist при запуске gulp
	scss = require("gulp-sass"), // scss препроцессор
	autoprefixer = require("gulp-autoprefixer"), // автоматическая расстановка префиксов
	group_media = require("gulp-group-css-media-queries"), // группировка медиазапросов
	clean_css = require("gulp-clean-css"), // чистит сжимает css файл
	rename = require("gulp-rename"), // создает доп.файл .min.css .min.js
	uglify = require("gulp-uglify-es").default,   // сжимает js файл
	imagemin = require("gulp-imagemin"), // сжимает изображения
	// webp = require("gulp-webp"),  // конвертирует изображения в webp
	// webpcss = require("gulp-webpcss");  // создает конструкцию в css для webp бэкграунда
	svgSprite = require("gulp-svg-sprite");


// Работа Browser-Sync

function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/",
		},
		port: 3000,
		notify: false,
	});
}


// Работа с HTML

function html() {
	return src(path.src.html)
		.pipe(rigger())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}


// Работа с CSS

function css() {
	return src(path.src.css)
		.pipe(
			scss({
				outputStyle: "expanded",
			})
		)

		.pipe(group_media())

		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ["last 10 version"],
				cascade: true,
			})
		)

		// .pipe(webpcss()) Зелёная ошибка

		.pipe(dest(path.build.css))

		.pipe(clean_css())

		.pipe(
			rename({
				extname: ".min.css",
			})
		)

		.pipe(dest(path.build.css))

		.pipe(browsersync.stream());
}


// Работа с JS

function js() {
	return src(path.src.js)

		.pipe(rigger())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				extname: ".min.js",
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}


// Работа с изображениями

function images() {
	return src(path.src.img)
		// .pipe(
		// 	webp({
		// 		quality: 70
		// 	})
		// )
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3, // 0 to 7
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream());
}


// Работа с SVG-спрайтами

gulp.task('svgSprite', function () {
	return gulp.src([source_folder + '/iconsprite/*.svg'])
		.pipe(
			svgSprite({
				mode: {
					stack: {
						sprite: "../icons/icons.svg", //sprite file name
						example: true,
					}
				},
			})
		)
		.pipe(dest(path.build.img))
})


// Работа с шрифтами

function fonts() {
	return src(path.src.fonts)
		.pipe(dest(path.build.fonts))
		.pipe(browsersync.stream());
}


// Работа с видео

function video() {
	return src(path.src.video)
		.pipe(dest(path.build.video))
		.pipe(browsersync.stream());
}

// Работа с сторонними библиотеками

function vendor() {
	return src(path.src.vendor)
		.pipe(dest(path.build.vendor))
		.pipe(browsersync.stream());
}


// Слежка за файлами

function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

function clean(params) {
	return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, html, js, images, fonts, video, vendor));

let watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.video = video;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = watch;