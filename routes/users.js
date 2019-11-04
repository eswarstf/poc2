var express = require("express");
var router = express.Router();
const fs = require("fs");
const http = require("http");
const db = require("../config/db");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.get("/all", function(req, res, next) {
  db.query("Select * from video", function(err, result) {
    if (err) res.send(err);
    res.send(result);
  });
});
router.get("/video", function (req, res) {
  let query, param;
  if (req.body.id) {
     query = "Select * from video WHERE id = ?";
     param = req.body.id;
  } else if (req.body.title) {
    query = "Select * from video WHERE title = ?";
     param = req.body.title;
  }
  db.query(query,param, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      console.log(result);
      let datafilter = result.filter((data, index) => {
        const video_path = data.videoUrl;
        const path = video_path;
      const stat = fs.statSync(path);
      const fileSize = stat.size;
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4"
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4"
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
      }
    });
    }
  });
});

// router.get("/id", function(req, res, next) {
//   db.query("Select * from video WHERE id = ?", [req.body.id], function(
//     err,
//     result
//   ) {
//     if (err) {
//       res.send(err);
//     } else {
//       let datafilter = result.filter((data1, index) => {
//         console.log(data1.videoUrl);

//         let data = "";
//         let readerStream = fs.createReadStream(data1.videoUrl);
//         readerStream.setEncoding("UTF8");
//         readerStream.on("data", function(chunk) {
//           data += chunk;
//         });
//         readerStream.on("end", function() {
//           console.log(data);
//         });
//         readerStream.on("error", function(err) {
//           console.log(err.stack);
//         });
//         res.send(data);
//       });
//     }
//   });
// });
// router.get("/title", function(req, res, next) {
//   db.query("Select * from video WHERE title = ?", [req.body.title], function(
//     err,
//     result
//   ) {
//     if (err) {
//       res.send(err);
//     } else {
//       let datafilter = result.filter((data1, index) => {
//         console.log(data1.title);

//         let data = "";
//         let readerStream = fs.createReadStream(data1.videoUrl);
//         readerStream.setEncoding("UTF8");
//         readerStream.on("data", function(chunk) {
//           data += chunk;
//         });
//         readerStream.on("end", function() {
//           console.log(data);
//         });
//         readerStream.on("error", function(err) {
//           console.log(err.stack);
//         });
//         res.send(result);
//       });
//     }
//   });
// });

// http.createServer(function (req,res) {
//   res.writeHead(200,{'content-type':'video/mp4'});
//   let rs = fs.createReadStream("file.mp4")
//   rs.pipe(res);
// }).listen(4000);

module.exports = router;
