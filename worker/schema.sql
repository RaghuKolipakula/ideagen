DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS preferences;

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT NOT NULL,
  price TEXT NOT NULL,
  competitors TEXT,
  image_prompt TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  user_rating INTEGER NOT NULL, -- 1 for upvote, -1 for downvote
  comments TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL UNIQUE,
  weight INTEGER DEFAULT 0
);

-- Insert some default preferences for the AI to start with
INSERT INTO preferences (category, weight) VALUES
('Info Product', 0),
('E-commerce', 0),
('Agency', 0),
('Content Creator', 0);
