import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET all posts
app.get("/api/posts", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, c.name AS category_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);

    res.json(rows); // ВСЕГДА массив
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET post
app.get("/api/posts/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [req.params.id],
    );

    if (!rows[0]) return res.status(404).json({ error: "Not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE post
app.post("/api/posts", async (req, res) => {
  const { title, body, author, categoryName } = req.body;

  try {
    let categoryId = null;

    if (categoryName) {
      const existing = await pool.query(
        "SELECT id FROM categories WHERE name = $1",
        [categoryName],
      );

      if (existing.rows.length > 0) {
        categoryId = existing.rows[0].id;
      } else {
        const created = await pool.query(
          "INSERT INTO categories (name) VALUES ($1) RETURNING id",
          [categoryName],
        );
        categoryId = created.rows[0].id;
      }
    }

    const { rows } = await pool.query(
      `INSERT INTO posts (title, body, author, category_id)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [title, body, author, categoryId],
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Create failed" });
  }
});

// LIKE
app.patch("/api/posts/:id/like", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE posts SET likes = likes + 1 WHERE id=$1 RETURNING *`,
      [req.params.id],
    );

    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Like failed" });
  }
});

// DELETE
app.delete("/api/posts/:id", async (req, res) => {
  await pool.query("DELETE FROM posts WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

// CATEGORY
app.get("/api/posts/category/:name", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT p.*, c.name AS category_name
     FROM posts p
     JOIN categories c ON p.category_id = c.id
     WHERE c.name = $1`,
    [req.params.name],
  );

  res.json(rows);
});

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
