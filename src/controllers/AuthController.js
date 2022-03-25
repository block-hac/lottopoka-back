const jwt = require('jsonwebtoken');
const conf = require('../configs');
const User = require('../models/user');

const generateToken = (user) => {
  return jwt.sign(user, conf.secret, {
    expiresIn: 31536000,
  });
};

exports.auth = (req, res) => {
  const { userid, username } = req.query;

  if (!userid || !username)
    return res.send({
      code: 1,
      data: null,
      error: 'Invalid URL parameters',
    });

  User.findOne({ userId: userid })
    .then((user) => {
      if (user) {
        res.send({
          code: 0,
          data: {
            userId: user.userId,
            userName: user.userName,
            token: user.token,
          },
          error: null,
        });
      } else {
        const newUser = new User({
          userId: userid,
          userName: username,
          token: generateToken({ userId: userid, userName: username }),
        });

        newUser
          .save()
          .then((savedUser) => {
            res.send({
              code: 0,
              data: {
                userId: savedUser.userId,
                userName: savedUser.username,
                token: savedUser.token,
              },
              error: null,
            });
          })
          .catch((err) => {
            console.log(
              '[AUTH_CONTROLLER]:[ERROR]:[IFRAME_CHECKING_USER]:',
              err
            );

            res.send({
              code: 3,
              data: null,
              error: 'Failed to create the new token ...',
            });
          });
      }
    })
    .catch((err) => {
      console.log('[AUTH_CONTROLLER]:[ERROR]:[IFRAME_CHECKING_USER]:', err);

      res.send({
        code: 2,
        data: null,
        error: 'Failed to get the user information',
      });
    });
};

exports.getUserInfo = (req, res) => {
  const { userId } = req.params;

  User.findOne({ userId: userId })
    .then((user) => {
      return res.send(user);
    })
    .catch((err) => {
      console.log('[AUTH_CONTROLLER]:[ERROR]:[GET_USER_INFO]:', err);
    });
};

// exports.register = (req, res, next) => {
//   const { email, firstName, lastName, password } = req.body;

//   if (!email) {
//     return res.json({ error: "You must enter an email address." });
//   }

//   if (!password) {
//     return res.json({ error: "You must enter a password." });
//   }

//   User.findOne({ email })
//     .then(async (user) => {
//       if (user) {
//         console.log(`[ERROR]:[USE_ALREADY_EXISTED_MAIL_ADDRESS]`);
//         return res.json({ error: "That email address is already in use" });
//       }
//       const newUser = new User({
//         email,
//         password,
//         firstName,
//         lastName,
//       });
//       const SALT_FACTOR = 5;
//       await bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
//         if (err) next(err);
//         bcrypt.hash(newUser.password, salt, null, (err1, hash) => {
//           if (err1) next(err1);
//           newUser.password = hash;
//         });
//       });
//       newUser
//         .save()
//         .then((savedUser) => {
//           console.log("[SUCCESS]:[USER_REGISTER]");
//           return res.json({
//             success: true,
//             token: `JWT ${generateToken(setUserInfo(savedUser))}`,
//             user: savedUser,
//           });
//         })
//         .catch((err2) => {
//           next(err2);
//         });
//     })
//     .catch((err) => next(err));
// };

// exports.login = (req, res) => {
//   const user = req.user;
//   const token = `JWT ${generateToken(setUserInfo(user))}`;

//   console.log("[SUCCESS]:[USER_LOGIN]");

//   return res.status(200).json({
//     token: token,
//     user: user,
//   });
// };
