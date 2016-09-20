/**
 * 重定向插件
 * 作用:设置重定向状态码（302），并重定向到响应URL.
 * 使用方法：1. 引用插件var redirect=sujs['redirect'];
 *          2. app.use(redirect)
 *          3. 在需要的路由中调用res.redirect(URL);
 **/

module.exports=function  (req,res,next) {
        res.redirect=function  (url) {
            res.statusCode=302;
            res.setHeader('Location',url);
            res.end('');
        };
        next();
}
