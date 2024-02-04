const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'az_logics',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

app.post('/register', async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    mobile,
    country,
    state,
    city,
    password,
  } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const profileImage = req.files && req.files.profile_image;
    let profileImageData = null;

    if (profileImage) {
      profileImageData = profileImage.data;
    }

    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    const emailResults = await queryDatabase(checkEmailQuery, [email]);

    if (emailResults.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Email already exists' });
    }

    const checkMobileQuery = 'SELECT * FROM users WHERE mobile = ?';
    const mobileResults = await queryDatabase(checkMobileQuery, [mobile]);

    if (mobileResults.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Mobile number already exists' });
    }

    const insertUserQuery =
      'INSERT INTO users (first_name, last_name, email, mobile, country, state, city, password, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const insertUserValues = [
      first_name,
      last_name,
      email,
      mobile,
      country,
      state,
      city,
      hashedPassword,
      profileImageData,
    ];

    await queryDatabase(insertUserQuery, insertUserValues);

    return res.status(201).json({ status: 'success', message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const results = await queryDatabase('SELECT * FROM users WHERE email = ?', [email]);

  if (results.length === 0 || !bcrypt.compareSync(password, results[0].password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.json({ message: 'Login successful', isLogin: true, user_id: results[0].user_id, email: results[0].email });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

async function queryDatabase(query, values) {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}
