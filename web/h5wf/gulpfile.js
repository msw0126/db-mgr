var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),

	notify = require('gulp-notify');	

gulp.task('minifycss', function() {
	return gulp.src('css/*.css')    //��Ҫ�������ļ�
		.pipe(rename({suffix: '.min'}))   //renameѹ������ļ���
		.pipe(minifycss())   //ִ��ѹ��
		.pipe(gulp.dest('dist/css'))//����ļ���
		.pipe(notify({message:'css task ok'}));		
}); 
//ѹ�����ϲ� js
gulp.task('minifyjs', function() {
	return gulp.src('js/*.js')      //��Ҫ�������ļ�
		.pipe(gulp.dest('js'))       //������ļ���
		.pipe(rename({suffix: '.min'}))   //renameѹ������ļ���
		.pipe(uglify())    //ѹ��
		.pipe(gulp.dest('dist/js'))  //���
		.pipe(notify({message:"js task ok"}));
}); 
gulp.task('minifyjss', function() {
	return gulp.src('js/*.js')      //��Ҫ�������ļ�
		.pipe(gulp.dest('js'))       //������ļ���
		.pipe(rename({suffix: '.min'}))   //renameѹ������ļ���
		.pipe(uglify())    //ѹ��
		.pipe(gulp.dest('dist/js'))  //���
		.pipe(notify({message:"js task ok"}));
});
//Ĭ�������cmd������gulp��ִ�еľ����������(ѹ��js��Ҫ�ڼ��js֮�����)

gulp.task('scripts' , ()=>{
    return gulp.src('js/*.js')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.babel())    //靠这个插件编译
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'));     
});
gulp.task('default',function() {
	gulp.start('minifyjss','minifyjs','minifycss','scripts'); 
});