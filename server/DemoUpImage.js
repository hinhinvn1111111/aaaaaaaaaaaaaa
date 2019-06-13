let express = require('express');
let app = express();
let fs = require('fs');
let formidable = require('express-formidable');
app.use(formidable({uploadDir:'./image'}));
app.listen(3333,()=>console.log('Server started'));
app.post('/',(req,res)=>{
	fs.rename(req.files.image.path,req.files.image.path + '.jpg',err=>{
        //res.send('Error');
        // console.log(err);
    });
    console.log(req.files.image.path);
    console.log(req.files.image.name);
	//console.log('http://192.168.40.2:8888/Server/'+req.files.image.path + '.jpg');
	//res.send('http://192.168.40.2:8888/Server/'+req.files.image.path + '.jpg');
	// let a=req.files.image.path;
	// let b = a.slice(6,a.lenght);
	// console.log('http://192.168.40.2:8888/Tieu_Luan_Chuyen_Nganh/ServerNodejs/image/' + b + '.jpg');
	// res.send('http://192.168.40.2:8888/Tieu_Luan_Chuyen_Nganh/ServerNodejs/image/' + b + '.jpg');
});