/**
 * Created by Administrator on 2017/2/27 0027.
 */
module.exports = function(grunt) {
    grunt.initConfig({
        //pkg: grunt.file.readJSON('package.json'),
        watch: {
            jade: {
                files: ['views/**'],
                options: {
                    livereload:true // 文件改动时重新启动
                }
            },
            js: {
                files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
                //tasks: ['jshint'], //语法检查
                options: {
                    livereload: true // 文件改动时重新启动
                }
            }
        },
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    args: [],
                    nodeArgs: ['--debug'],
                    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
                    ext: ['js'],
                    watch: ['./'],
                    delay: 1000,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname //目录：当前目录
                }
            }
        },
        concurrent: {
            target: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    })
    grunt.loadNpmTasks('grunt-contrib-watch')
    grent.loadNpmTasks('grunt-nodemon')
    grunt.loadNpmTasks('grunt-concurrent')

    //grunt.option('force', true) //不会因为语法错语或警告而中断进程
    grunt.registerTask('default', ['concurrent:target']) //注册一个默认任务
}