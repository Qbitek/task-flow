const express = require('express');
const router = express.Router();

// GET /api/users - pobierz wszystkich użytkowników
router.get('/', async (req, res, next) => {
    try {
        const db = req.app.locals.db;
        const [rows] = await db.query('SELECT * FROM users ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// GET /api/users/:id - pobierz konkretnego użytkownika
router.get('/:id', async (req, res, next) => {
    try {
        const db = req.app.locals.db;
        const userId = req.params.id;

        const [userRows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.status(404).json({ error: 'Użytkownik nie istnieje' });
        }
        
        const user = userRows[0];
        const [taskRows] = await db.query('SELECT * FROM tasks WHERE user_id = ?', [userId]);
        user.tasks = taskRows;
        
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// POST /api/users - dodaj nowego użytkownika
router.post('/', async (req, res, next) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Pola name i email są wymagane' });
        }

        const db = req.app.locals.db;
        
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email już istnieje' });
        }

        const [result] = await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
        res.status(201).json({ id: result.insertId, name, email });
    } catch (err) {
        next(err);
    }
});

// PUT /api/users/:id - aktualizuj użytkownika
router.put('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Pola name i email są wymagane' });
        }

        const db = req.app.locals.db;
        const [result] = await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Użytkownik nie istnieje' });
        }
        
        res.json({ message: 'Użytkownik zaktualizowany' });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/users/:id - usuń użytkownika
router.delete('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;
        const db = req.app.locals.db;
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Użytkownik nie istnieje' });
        }
        
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;