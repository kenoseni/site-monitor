/**
 * Request handlers
 */

// Dependencies
const _data = require("../lib/data");
const helpers = require("./helpers");

const handlers = {};

handlers.ping = (data, cb) => {
  cb(200);
};

handlers.users = (data, cb) => {
  const acceptableMethods = ["post", "get", "put", "delete"];

  if (acceptableMethods.includes(data.method)) {
    handlers._users[data.method](data, cb);
  } else {
    cb(405);
  }
};

handlers.notFound = (data, cb) => {
  cb(404);
};

// Containers for the users submethods
handlers._users = {};

// Users - post
handlers._users.post = (data, cb) => {
  // Check that all required field are filled out
  const firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;

  const lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;

  const phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length >= 10 <= 14
      ? data.payload.phone.trim()
      : false;

  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  const tosAgreement =
    typeof data.payload.tosAgreement == "boolean" &&
    data.payload.tosAgreement == true
      ? true
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    _data.read("users", phone, (err, data) => {
      if (err) {
        const hashedPassword = helpers.hash(password);

        if (hashedPassword) {
          const userObject = {
            firstName,
            lastName,
            phone,
            hashedPassword,
            tosAgreement: true,
          };

          _data.create("users", phone, userObject, (err) => {
            if (!err) {
              cb(201);
            } else {
              console.error(err);
              cb(500, { Error: "Could not create the new user" });
            }
          });
        } else {
          cb(500, { Error: "Could not hash the user's password" });
        }
      } else {
        cb(400, { Error: "A user with the phone number already exists" });
      }
    });
  } else {
    cb(400, { Error: "Missing required fields" });
  }
};

// Users - get
handlers._users.get = (data, cb) => {};

// Users - put
handlers._users.put = (data, cb) => {};

// Users - delete
handlers._users.delete = (data, cb) => {};

module.exports = handlers;
