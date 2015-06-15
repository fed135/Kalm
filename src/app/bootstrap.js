var walk = require('walk')
    , fs = require('fs')
    , walker
    ;
 
  walker = walk.walk("./", options);
 
  walker.on("file", function (root, fileStats, next) {
    console.log(fileStats.name);
  });
 
  walker.on("errors", function (root, nodeStatsArray, next) {
    next();
  });
 
  walker.on("end", function () {
    console.log("all done");
  });