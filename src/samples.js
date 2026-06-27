export const SAMPLES = {
  javascript: `// Buggy async function - can you spot the issues?
function fetchUserData(userId) {
  let data;
  fetch('/api/users/' + userId)
    .then(res => res.json())
    .then(json => {
      data = json;
    });
  return data; // Bug: always returns undefined
}

function calculateDiscount(price, discount) {
  var result = price - (price * discount / 100);
  console.log("discount applied"); // Should not be in production
  return result;
}

// Performance issue: O(n) lookup inside loop
const users = [];
for (var i = 0; i < 1000; i++) {
  users.push({ id: i, name: 'User' + i });
}
const found = users.filter(u => u.id == userId)[0]; // loose equality`,

  typescript: `interface User {
  id: number;
  name: string;
  email: string;
}

// Missing error handling and type safety
async function getUser(id: any): Promise<any> {
  const response = await fetch(\`/api/users/\${id}\`);
  const data = response.json(); // Missing await
  return data;
}

// Non-null assertion without check
function displayUser(user: User | null) {
  console.log(user!.name); // Dangerous!
}

// Unused variables
const unusedConfig = { timeout: 5000, retries: 3 };

class UserService {
  private users: User[] = [];

  // Missing return type
  addUser(user) {
    this.users.push(user);
  }
}`,

  react: `import React from 'react';

// Class component with multiple issues
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { users: [], loading: false };
  }

  componentDidMount() {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => this.setState({ users: data }));
    // No error handling, no cleanup
  }

  render() {
    return (
      <div>
        {this.state.users.map(user => (
          <div> {/* Missing key prop */}
            <span>{user.name}</span>
            {/* XSS vulnerability! */}
            <span dangerouslySetInnerHTML={{__html: user.bio}} />
          </div>
        ))}
      </div>
    );
  }
}

export default UserList;`,

  python: `import os
import sqlite3

# SQL Injection vulnerability
def get_user(username, password):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE username='" + username + "'"
    cursor.execute(query)
    result = cursor.fetchone()
    # File handle never closed
    return result

# No exception handling
def read_config():
    config = {}
    f = open('config.txt')
    for line in f:
        key, value = line.split('=')
        config[key] = value
    return config

# Hardcoded credentials
SECRET_KEY = "mysecretpassword123"
DB_PASSWORD = "admin1234"`,

  node: `const express = require('express');
const app = express();

app.use(express.json());

// SQL Injection via string concatenation
app.get('/user/:id', async (req, res) => {
  const id = req.params.id;
  const user = await db.query('SELECT * FROM users WHERE id = ' + id);
  res.json(user);
  // No error handling
});

// Hardcoded credentials
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username == 'admin' && password == '1234') {
    res.json({ token: 'hardcoded-secret-token-abc123' });
  }
  // No else - request hangs if credentials don't match
});

// No rate limiting, no CORS, no helmet
app.listen(3000);`,

  css: `/* Multiple CSS issues */
.container {
  width: 1000px; /* Fixed width - not responsive */
  margin: 0 auto;
}

.button {
  background-color: #0F6E56 !important; /* Overusing !important */
  color: white !important;
  font-size: 14px;
  border: none;
  cursor: pointer;
  /* Missing padding, no focus state for accessibility */
}

/* Duplicated styles */
.card {
  border-radius: 8px;
  background: white;
  padding: 16px;
}

.product-card {
  border-radius: 8px; /* Duplicate */
  background: white; /* Duplicate */
  padding: 16px; /* Duplicate */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Very high z-index without reason */
.modal {
  z-index: 99999;
  position: absolute; /* Should be fixed */
}`,

  sql: `-- Query with multiple issues
SELECT *
FROM users u, orders o, products p
WHERE u.id = o.user_id
AND o.product_id = p.id
AND u.email = 'admin@example.com'

-- No LIMIT clause - could return millions of rows
SELECT * FROM logs WHERE created_at > '2024-01-01'

-- Selecting all columns in subquery
SELECT user_id, (
  SELECT * FROM profiles WHERE user_id = u.id
) as profile
FROM users u

-- Missing index hints, N+1 query pattern
SELECT id, name FROM users WHERE status = 'active'
-- Then in application code, for each user:
-- SELECT * FROM orders WHERE user_id = ?`,
}
