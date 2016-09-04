var sujs=function  () {
    var app=function  (req,res) {
        var method=req.method.toLowerCase();
        var urlObj=require('url').parse(req.url,true);
        var pathname=urlObj.pathname;
        var index=0;
        next();
        function next () {
            if (index>=app.routes.length) {
                return res.end(`Cannot ${method} ${pathname}`)
            }
            var route=app.routes[index++];
            if (route.method=='middleware') {
                if (route.path=='/'||route.path==pathname||pathname.startsWith(route.pathname+'/')) {
                    route.fn(req,res,next);
                } else {
                    next();
                }
            } else {
                if ((method==route.method||route.method=='all')&&(pathname==route.path||route.path=='*')) {
                    console.log('route!!');
                    route.fn(req,res);
                } else {
                    next();
                }
            }
        }
    }
    app.routes=[];

    var methods=['get','post','options','delete','put','all'];
    methods.forEach(function  (method) {
        app[method]=function  (path,fn) {
            var config={method:method,path:path,fn:fn};
            app.routes.push(config);
        }
    })
    app.use=function  (path,fn) {
        if (typeof fn!='function') {
            fn=path;
            path='/';
        }
        app.routes.push({method:'middleware',path:path,fn:fn})
    }
    app.listen=function  (port) {
        require('http').createServer(app).listen(port);
    }
    return app;
}

module.exports=sujs;