/**
 * 静态文件夹插件
 * 作用:对需要自动加载的静态文件(css、js、图片等)进行自动加载
 * 使用方法：1.引用插件 var static=sujs['static'];
 *          2. app.use(static(__dirname+'静态文件夹'))
 **/

var fs=require('fs');
var path=require('path');
module.exports=function  (p) {

    return function  (req,res,next) {
        var filename=path.join(p,req.path);
        fs.exists(filename,function  (exist) {
            if (exist&&req.path!='/') {
                fs.createReadStream(filename).pipe(res);
            } else next();
        })
    }
}