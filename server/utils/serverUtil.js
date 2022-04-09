const fs = require("fs");

module.exports = {
  boot: (app) => {
    return new Promise(async (resolve, reject) => {
      let bootDirPath = `${__dirname}/../boot`;
      const bootFiles = fs.readdirSync(bootDirPath);
      try {
        for (const file of bootFiles) {
          await require(`${bootDirPath}/${file}`)(app);
        }
      } catch (e) {
        reject(e);
      }
      resolve();
    });
  },
};
