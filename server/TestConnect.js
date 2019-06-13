var con = require('./config');

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("SELECT * FROM sanpham", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    result.forEach(item => {
        console.log(item.TenSP);
    });
  });
});