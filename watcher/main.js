const fs = require('fs-extra')
const chokidar = require('chokidar')
const path = require('path')

getDistPath = function(srcPath) {
    return path.join("./public/_/_/", srcPath)
}

fs.removeSync("./public/course")

chokidar.watch('../../course')
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