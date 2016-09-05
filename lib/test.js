var sujs=require('./use');

var app=sujs();
app.listen(1234);

//app.use(function  (req,res,next) {
//    console.log('开始中间件,报个错');
//    next('错误中间件');
//})

app.get('/:name/:id',function  (req,res) {
    res.end(JSON.stringify(req.params));
})

//app.use(function  (err,req,res,next) {
//    //console.log(err);
//    console.log('进入错误中间件');
//    res.end('enter err use')
//})