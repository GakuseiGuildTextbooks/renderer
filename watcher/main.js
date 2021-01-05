const fs = require('fs-extra')
const chokidar = require('chokidar')
const path = require('path')

let getDistPath, watch_target_dir

if (process.argv[2] == "prd") {
    getDistPath = function(srcPath) {
        return path.join("./public/_/_/", srcPath)
    }
    watch_target_dir = '../../course'
} else {
    getDistPath = function(srcPath) {
        return path.join("./public/", srcPath)
    }
    watch_target_dir = './course'
}


fs.removeSync("./public/course")

chokidar.watch(watch_target_dir)
    .on('add', function(srcPath) {
        var distPath = getDistPath(srcPath)
        console.log("ADD", srcPath, distPath)
        fs.mkdirsSync(path.dirname(distPath))
        fs.copyFileSync(srcPath, distPath)
    })
    .on('change', function(srcPath) {
        var distPath = getDistPath(srcPath)
        console.log("UPDATE", srcPath, distPath)
        fs.mkdirsSync(path.dirname(distPath))
        fs.copyFileSync(srcPath, distPath)
    })
    .on('unlink', function(srcPath) {
        var distPath = getDistPath(srcPath)
        console.log("REMOVE", srcPath, distPath)
        fs.unlinkSync(distPath)
    })
    .on('unlinkDir', function(srcPath) {
        var distPath = getDistPath(srcPath)
        console.log("REMOVEDIR", srcPath, distPath)
        fs.remove(distPath)
    })