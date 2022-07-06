// Lib for storing and editing system

// Dependencies
const fs = require("fs");
const path = require("path");

const lib = {};

// Base directory of the .data folder
lib.baseDir = path.join(__dirname, "../.data/");

// Write data to file
lib.create = (dir, file, data, cb) => {
  // open the file for writing
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              cb(null);
            } else {
              cb("Error closing new file");
            }
          });
        } else {
          cb("Error writing to new file");
        }
      });
    } else {
      cb("Could not create a new file, it may already exist");
    }
  });
};

// Read data from file
lib.read = (dir, file, cb) => {
  fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, "utf-8", (err, data) => {
    cb(err, data);
  });
};

// Update data inside file
lib.update = (dir, file, data, cb) => {
  // open the file for writing
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data);

      // Truncate the file
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          // Write to file and close it
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  cb(null);
                } else {
                  cb("Error closing the file");
                }
              });
            } else {
              cb("Error writing to existing file");
            }
          });
        } else {
          cb("Error truncating file");
        }
      });
    } else {
      cb("Could not open the file for updating, it may not exist yet");
    }
  });
};

// Delete a file
lib.delete = (dir, file, cb) => {
  // Unlink the file
  fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, (err) => {
    if (!err) {
      cb(null);
    } else {
      cb("Error deleting file");
    }
  });
};

module.exports = lib;
