/**
 * 这是静态服务器组件
 * 作用:对需要自动加载的静态文件(css、js、图片等)进行自动加载
 * 使用方法：1.引用该模块
 *          2. app.use(static(__dirname+'静态服务器文件夹'))
 **/

var fs=require('fs');
var path=require('path');
module.exports=function  (p) {

    return function  (req,res,next) {
        console.log(123);
        var filename=path.join(p,req.path);
        console.log(filename,'ff');
        fs.exists(filename,function  (exist) {
            if (exist&&req.path!='/') {
                fs.createReadStream(filename).pipe(res);
                next();
            } else next();
        })
    }
}