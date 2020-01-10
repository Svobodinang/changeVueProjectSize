// param=less - уменьшение
// param=more - увеличение
// percent - процент на который надо увеличить
const fs = require("fs");
const pathP = require('path')

const dirPath = process.argv[2]
const param = process.argv[3];
const percent = +process.argv[4];

function changeFile(filePath) {
  fs.access(filePath, (err) => {
    if (err) throw err;
  })

  const ext = pathP.extname(filePath);
  if (ext != '.vue')
    return 0

  fs.readFile(filePath, "utf8", function (error, data) {
    if (error) throw error;

    let newValue = data.replace(/(\d{1,5})(px)/g, (match, p1, p2) => {
      let diff = (+p1 / 100) * percent;
      let result = p1;

      if (param === 'less')
        result = Math.ceil(+p1 - diff)
      else if (param === 'more')
        result = Math.ceil(+p1 + diff)

      return result + p2
    })

    fs.writeFile(filePath, newValue, 'utf-8', function (err) {
      if (err) throw err;
      console.log('Done!');
    })
  });
}

const findFilesInDir = () => {
  fs.access(dirPath, (err) => {
    if (err) throw err;
  })

  let pathsArr = fs.readdirSync(dirPath, err => { if (err) throw err }).map(fileName => {
    return `${dirPath}/${fileName}`
  })
  for (pathInDir of pathsArr) {
    try {
      const stats = fs.statSync(pathInDir)
      if (stats.isFile())
        toChangeFile(pathInDir)
      else if (stats.isDirectory())
        toFindFilesInDir(pathInDir)
    } catch (err) {
      console.error(err)
    }
  }
}

toFindFilesInDir(dirPath)