const bcrypt = require("bcrypt");

async function MakeBcrypt(password) {
  // return bcrypt.hashSync(password,10);  //this is the Syncronious Version
  return await bcrypt.hash(password, 10);
}

async function CompareBcrypt(
  CandidatePassword_or_currentPassword,
  UserPassword_InDB_Hasshpassword,
) {
  // return bcrypt.compareSync(CandidatePassword_or_currentPassword); // this the Syncronious Version  that block the other tast during this
  return bcrypt.compare(
    CandidatePassword_or_currentPassword,
    UserPassword_InDB_Hasshpassword,
  );
}

module.exports = { MakeBcrypt, CompareBcrypt };
/*

# Node.js Exports & Imports – All-in-One Quick Note

## 1️⃣ module.exports (Main Export Object)

Used to export functions/objects from a file.

```js
// utils/bcrypt.js
const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const comparePassword = async (candidatePassword, hashedPassword) => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
```

Import:

```js
const { hashPassword, comparePassword } = require("../utils/bcrypt");
```

✔ Multiple functions export
✔ Most common pattern in Node.js

---

# 2️⃣ exports (Shortcut of module.exports)

`exports` actually **module.exports ka reference** hota hai.

```js
exports.hashPassword = async function(password){
  return bcrypt.hash(password,10);
}

exports.comparePassword = async function(password, hash){
  return bcrypt.compare(password,hash);
}
```

Import:

```js
const bcryptUtils = require("../utils/bcrypt");

bcryptUtils.hashPassword("123");
```

---

# 3️⃣ Destructuring Import

Instead of importing the whole object.

```js
const { hashPassword, comparePassword } = require("../utils/bcrypt");

hashPassword("123");
```

✔ Cleaner
✔ Industry practice

---

# 4️⃣ Default Export (Single Function)

When a file has **only one main function**.

```js
module.exports = async function(password){
  return bcrypt.hash(password,10);
}
```

Import:

```js
const hashPassword = require("../utils/bcrypt");
```

---

# 5️⃣ ES Modules (Modern JavaScript)

If `package.json` has:

```json
"type": "module"
```

Export:

```js
export const hashPassword = async (password)=>{
  return bcrypt.hash(password,10);
};

export const comparePassword = async (password, hash)=>{
  return bcrypt.compare(password,hash);
};
```

Import:

```js
import { hashPassword, comparePassword } from "./bcrypt.js";
```

---

# 6️⃣ Important Rule ⚠️

❌ Wrong

```js
exports = {
  a,
  b
}
```

✔ Correct

```js
module.exports = {
  a,
  b
}
```

Because `exports` is only a reference.

---

# 7️⃣ Easy Memory Trick

```
Multiple functions → module.exports = { }
Single function → module.exports = fn
```

Import:

```
{ } → named import
no { } → default import
```

---

# 8️⃣ Best Practice (MERN Backend)

Utility files like:

* bcrypt helpers
* jwt helpers
* validators

Use this pattern:

```js
module.exports = {
  hashPassword,
  comparePassword
};
```

Import:

```js
const { hashPassword, comparePassword } = require("../utils/bcrypt");
```

✔ Clean
✔ Scalable
✔ Production standard

*/
