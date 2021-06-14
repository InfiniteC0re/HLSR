const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.opts = opts;
    
    this.data = parseDataFile(this.path, this.opts.defaults);
  }

  update() {
    this.data = parseDataFile(this.path, this.opts.defaults);
  }
  
  get(key) {
    this.update();
    return this.data[key];
  }
  
  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, '\t'));
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    return defaults;
  }
}

export default Store;