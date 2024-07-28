const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_P_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_S_KEY,
  region: "eu-north-1",
});

module.exports = AWS;
