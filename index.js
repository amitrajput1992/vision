var glob = require('glob');
var fetch = require('node-fetch');
var promise = require('es6-promise');
promise.polyfill();
/**
 * Use this function to get the filename
 * split them into names and colors.
 * @params dir
 * @returns array
 */
function getFiles(dir, s, pw, ph, mh, mw, cb) {
  glob(dir + '/*.png', function(err, files) {
    if(err) {
      console.log(err);
    } else {
      files = files.map(function(file) {
        var fileArr = file.split('/');
        var fileName = fileArr[fileArr.length - 1];
        var color = fileName.split('_')[1].replace('.png', '');
        return {
          series_id: s,
          name: fileName.split('.')[0],
          asset: fileName,
          preview: fileName,
          color: color,
          type: ' ',
          description: ' ',
          physical_width: pw,
          physical_height: ph,
          module_height: mh,
          module_width: mw
        };
      });
      cb(files);
    }
  });
}

const series_id = 2;
const physical_width = 23 * 3;
const physical_height = 46;
const module_height = 1;
const module_width = 3;

var files = [];
getFiles(__dirname + "/myrius/mech3", series_id, physical_width, physical_height, module_height, module_width, function(res) {
  files = res;
  console.log(files);
  var fetchArr= [];
  for(var i=0;i<files.length;i++) {
    var f = fetch('http://vrapi-dev.gmetri.com/vr/v1/legrand/saveModule', {headers: {'Content-Type': 'application/json'}, mode: 'cors', method: 'post', body: JSON.stringify(files[i])})
      .then(function(res) {
        console.log(res);
      })
      .catch(function(err) {
        console.log(err);
      });
    fetchArr.push(f);

    Promise.all(fetchArr)
      .then(function() {
        console.log('All api calls success');
      })
      .catch(function() {
        console.log('some api calls failed');
      });
  }
});
/**
 * loop through all files and create the payload for api call
 */
/*for(var i=0;i<files.length;i++) {

}*/
