/**
 * cookie-parser插件
 * 作用:方便的设置与查看cookie
 * 调用方法：1. 引用插件var cookieParser=sujs['cookieParser'];
 *          2. app.use(cookieParser)
 * 使用方法：req.cookies 解析浏览器传来请求中的cookie
 *          res.cookie(name,val,options) 设置cookie
 *              接收3个参数，其中name,value必选，options可选
 *              name:设置的cookie名
 *              val:设置的cookie值
 *              options:对象,可选,设置cookie的参数
 *                  包括 domain 设置域名 ex:{domain:'a.b.com'}
 *                  path cookie可用的路径 ex:{path:'/test'}
 *                  expires 绝对过期时间 ex:{expires:new Date(Date.now()+20*1000)}
 *                  maxAge 相对过期时间 ex:{maxAge:2000} 单位 毫秒
 *                  httpOnly 前端是否不可通过js查看cookie ex:{httpOnly:true}
 *                  secure  只可通过https协议访问
 **/

var querystring=require('querystring');

module.exports=function  (req,res,next) {
    if (!req.headers.cookie) return next();
    req.cookies=querystring.parse(req.headers.cookie,'; ','=');
    res.cookie=cookie;
    next();
}

function cookie (name,val,options) {
    var opt=options || {};
    var value=encodeURIComponent(val);
    var pairs=[name+'='+value];
    if (opt.maxAge!=null) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge)) throw new Error('maxAge must be a number');
        pairs.push('Max-Age=' + Math.floor(maxAge));
    }
    if (opt.domain !=null) pairs.push('Domain='+opt.domain);
    if (opt.path !=null) pairs.push('Path='+opt.path);
    if (opt.expires) pairs.push('Expires=' + opt.expires.toUTCString());
    if (opt.httpOnly!=null) pairs.push('HttpOnly');
    if (opt.secure!=null) pairs.push('Secure');
    return pairs.join('; ');
}