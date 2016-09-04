var sujs=require('./use');

var app=sujs();
app.listen(1234);

app.use(function  (req,res,next) {
    console.log('开始中间件');
    next();
})

app.get('/',function  (req,res) {
    res.end('hahaha');
})