var sujs=function  () {
    function app (req,res) {
        var urlObj=require('url').parse(req.url,true);
        var method=req.method.toLowerCase();
        var pathname=urlObj.pathname;
        var index=0;
        req.method=method;
        req.pathname=pathname;
        req.path=pathname;

        res.send=function  (msg) {
            if (typeof msg =='string'||Buffer.isBuffer(msg)) {
                res.setHeader('content-type','text/palin;charset=utf8')
                res.end(msg);
            }
            if (typeof msg =='object') {
                res.setHeader('content-type','application/json;charset=utf8');
                res.end(JSON.stringify(msg));
            }
            if (typeof  msg =='number') {
                var STATUS_CODE=require('http').STATUS_CODES;
                res.statusCode=msg;
                res.end(STATUS_CODE[msg]);
            }
        }

        next();

        function next (err) {
            if (index>=app.routes.length) {
                return res.end(`Cannot ${pathname} ${method}`)
            }
            var route=app.routes[index++];
            if (err) {
                if (route.method=='middleware'&&route.fn.length==4){
                    route.fn(err,req,res,next);
                } else {
                    next(err);
                }
            } else {
                if (route.method=='middleware') {
                    if (route.path=='/'||route.path==pathname||pathname.startsWith(route.path+'/')) {
                        route.fn(req,res,next);
                    } else {
                        next();
                    }
                } else {
                    if (route.params) {
                        var matcher=pathname.match(new RegExp(route.path));
                        if (matcher) {
                            var obj={};
                            route.params.forEach(function  (item,index) {
                                obj[item]=matcher[index+1]
                            })
                            req.params=obj;
                            route.fn(req,res);
                        }   else {
                            next();
                        }
                    }   else if ((route.method==method||route.method=='all')&&(route.path==pathname||route.path=="*")) {
                        route.fn(req,res);
                    } else {
                        next();
                    }
                }

            }
        }
    }
    app.routes=[];
    var methods=['get','post','delete','options','all','put'];
    methods.forEach(function  (method) {
        app[method]=function  (path,fn) {
            var config={method:method,path:path,fn:fn};
            if (path.match(/:/)) {
                var params=[];
                config.path=path.replace(/:([^\/]+)/g,function  () {
                    params.push(arguments[1]);
                    return '([^\/]+)'
                })
                config.params=params;
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