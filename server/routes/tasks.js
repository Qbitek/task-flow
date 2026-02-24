const express = require('express');
const router = express.Router();

// GET /api/tasks - pobierz wszystkie zadania
router.get('/', async (req, res, next) => {
    try {
        const db = req.app.locals.db;
        const query = `
            SELECT tasks.*, users.name as user_name 
            FROM tasks 
            JOIN users ON tasks.user_id = users.id 
            ORDER BY tasks.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// POST /api/tasks - dodaj nowe zadanie
router.post('/', async (req, res, next) => {
    try {
        const { title, description, status, user_id } = req.body;

        if (!title || !user_id) {
            return res.status(400).json({ error: 'Pola title i user_id są wymagane' });
        }

        const db = req.app.locals.db;
        
        const [userCheck] = await db.query('SELECT id FROM users WHERE id = ?', [user_id]);
        if (userCheck.length === 0) {
            return res.status(400).json({ error: 'Użytkownik nie istnieje' });
        }

        const [result] = await db.query(
            'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)',
            [title, description || null, status || 'to_do', user_id]
        );
        
        res.status(201).json({ id: result.insertId, title, description, status, user_id });
    } catch (err) {
        next(err);
    }
});

// PATCH /api/tasks/:id - aktualizuj status zadania
router.patch('/:id', async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const { status } = req.body;

        const validStatuses = ['to_do', 'in_progress', 'done'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Nieprawidłowy status' });
        }

        const db = req.app.locals.db;
        const [result] = await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, taskId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Zadanie nie istnieje' });
        }
        
        res.json({ message: 'Status zaktualizowany' });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/tasks/:id - usuń zadanie
router.delete('/:id', async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const db = req.app.locals.db;
        const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [taskId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Zadanie nie istnieje' });
        }
        
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;