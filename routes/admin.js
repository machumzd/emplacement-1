var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
var app = express();
const path = require('path');
//database connection
var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Shakoor@2786',
  database: 'project1'
})
connection.connect(function (err) {
  if (err) throw err
  console.log('database connected...')

})
//image uploading hedder
const multer=require('multer');
const storage=multer.diskStorage({
  destination:'./public/images',
  filename:(req,file,cb)=>{
    return cb(null,`pic_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload=multer({
  storage:storage
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/loginA');
});
//home page all details of students
router.get('/home',(req,res)=>{
  var sql= `select * from images;`
  connection.query(sql,(err,result)=>{
    if(err) throw err;
    else{
      res.render('admin/home',{result})
    }
  })
  
})
//notification  page
router.get('/notification',(req,res)=>{
  connection.query(`SELECT * FROM notification `, function (err, result, fields) {
    if (err) throw err;
    res.render('admin/notification',{result})

  });
})

//Addnotification  page
router.get('/addnotification',(req,res)=>{
  res.render('admin/addNotification')
})
//add notification operation
router.post('/addnotification',async(req,res)=>{
  console.log(req.body);
  var sql = `INSERT INTO notification VALUES ("${req.body.title}","${req.body.About}","${req.body.cgpa}")`;
  await connection.query(sql,async function (err, result) {
    if (err) throw err;
    else{
      var title=req.body.title;
      var sql=`create table ${title}(name varchar(200),phone bigint,branch varchar(100),rno bigint,cgpa float);`
      await connection.query(sql,(err,result)=>{
        if (err) throw err;
        else{
          res.redirect('/admin/notification')
        }
      })
    }
  })
})

//admin login operation
router.post('/loginA',(req,res)=>{
  res.redirect('/admin/home')
})
//delete notification
router.get('/deleteNotification/:name',async(req,res)=>{
  let name=req.params.name;
  var sql = `delete from notification where title="${name}"`;
  await connection.query(sql,async function (err, result) {
    if (err) throw err;
    else{
      var sql=`drop table ${name};`
      await connection.query(sql,(err,result)=>{
        if(err) throw err;
        else{
          res.redirect('/admin/notification')
        }
      })
    }
  })
})
//student details page
router.get('/students',(req,res)=>{
  res.render('admin/students')
})
//all students details
router.get('/allstudents',async(req,res)=>{
  var sql=`select * from student`;deleteimg/pic_1649
  await connection.query(sql,(err,result)=>{
    if(err) throw err;
    else{
      res.render('admin/allstudents',{result})
    }
  })
})
//select students branch wise
router.post('/branch',async(req,res)=>{
  console.log(req.body);
  let branch=req.body.selected;
  var sql=`select * from student where branch="${branch}";`
  await connection.query(sql,(err,result)=>{
    if (err) throw err;
    else{
      res.render('/admin/branchstudents',{result})
    }
  })
})
//delete student
router.get('/deletestudent/:ph',async(req,res)=>{
  phone=req.params.ph;
  console.log(phone);
var sql=`DELETE FROM student WHERE phone="${phone}";`
await connection.query(sql,(err,result)=>{
  if(err) throw err;
  else{
    res.redirect('/admin/allstudents')
  }
})

})
//notification applayed students
router.get('/notificationApplyed/:title',async(req,res)=>{
  res.send(req.params.title)
  var title=req.params.title;
  var sql=`select * from ${title};`
  await connection.query(sql,(err,result)=>{
    if(err) throw err;
    else{
      res.render('admin/applayed',{result,title})
    }
  })
})
//selecting single student for edit details
router.post('/search',(req,res)=>{
  var sql=`select * from student where phone=${req.body.search};`
  connection.query(sql,(err,result)=>{
    if(err) throw err;
    else{
      console.log(result);
      result=result[0];
      res.render('admin/singlestudent',{result})
    }
  })
})
//change student details
router.post('/changeDetails',(req,res)=>{
  console.log(req.body);
  var sql=`UPDATE student SET rno="${req.body.regno}",name="${req.body.name}",email="${req.body.email}",cgpa="${req.body.cgpa} WHERE phone="${req.body.phone}";`
  connection.query(sql,(err,result)=>{
    if(err) throw err;
    else{
      res.redirect('/search');
    }
  })
})






app.use('/profile',express.static('public/images'));
// inserting the image
router.post('/insertimage',upload.single('pic'),async(req,res)=>{

  var sql=`insert into images values("${req.file.filename}");`
  await connection.query(sql,(err,result)=>{
    if(err) throw err;
    else{
    res.redirect("/admin/home");
     
    }
  })
})
//delete image of front page
router.get('/deleteimg/:img',(req,res)=>{
  var image=req.params.img;
  var sql=`DELETE FROM image WHERE img="${image}";`
  connection.query(sql,(err,result)=>{
    res.redirect('/admin/home');
  })
})
module.exports = router;
