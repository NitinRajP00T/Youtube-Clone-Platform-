const { nanoid } = require("nanoid");

function generateUsername(email) {
  const emailPrefix = email.split("@")[0].slice(0, 6);
  const uniqueSuffix = nanoid(5);

  return `${emailPrefix}_${uniqueSuffix}`;
}

module.exports = generateUsername;
