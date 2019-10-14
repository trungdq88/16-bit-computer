const fs = require('fs');

exports.loadFile = path => {
  const filename = path.split('/').slice(-1)[0];
  return [fs.readFileSync(path, 'utf-8'), filename];
};
