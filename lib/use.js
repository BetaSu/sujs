var sujs=function  () {
    var app=function  (req,res) {
        var method=req.method.toLowerCase();
        var urlObj=require('url').parse(req.url,true);
        var pathname=urlObj.pathname;
        var index=0;
        next();
        function next (err) {
            if (index>=app.routes.length) {
                return res.end(`Cannot ${method} ${pathname}`)
            }
            var route=app.routes[index++];
            if (err) {
                if (route.method=='middleware'&&route.fn.length==4){
                    return route.fn(err,req,res,next);
                } else {
                    next(err);
                }
            }
            if (route.method=='middleware') {
                if (route.path=='/'||route.path==pathname||pathname.startsWith(route.pathname+'/')) {
                    route.fn(req,res,next);
                } else {
                    next();
                }
            } else {
                if (route.params) {
                    var matcher=pathname.match(new RegExp(route.path));
                    console.log('matcher',matcher);
                    if (matcher) {
                        var obj={};
                        route.params.forEach(function  (item,index) {
                            obj[item]=matcher[index+1];
                        })
                        req.params=obj;
                        route.fn(req,res);
                    } else {
                        next();
                    }
                } else {
                    if ((method==route.method||route.method=='all')&&(pathname==route.path||route.path=='*')) {
                        route.fn(req,res);
                    } else {
                        next();
                    }
                }

            }
        }
    }
    app.routes=[];

    var methods=['get','post','options','delete','put','all'];
    methods.forEach(function  (method) {
        app[method]=function  (path,fn) {
            var config={method:method,path:path,fn:fn};
            if (path.includes(':')) {
                var params=[];
                config.path=config.path.replace(/:([^\/]+)/g,function  () {
                    params.push(arguments[1]);
                    return '([^\/]+)';
                })
                config.params=params;
                console.log('path',config.path);
            }
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