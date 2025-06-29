const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// --- SQLite Setup ---
const db = new sqlite3.Database('./cosy.db');

// Initialize tables if not exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT,
        role TEXT,
        pin TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS tokens (
        token TEXT PRIMARY KEY,
        userId TEXT,
        role TEXT,
        expiresAt INTEGER
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS days (
        id TEXT PRIMARY KEY,
        userId TEXT,
        data TEXT,
        createdAt TEXT,
        updatedAt TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS lessonSections (
        id TEXT PRIMARY KEY,
        dayId TEXT,
        userId TEXT,
        data TEXT,
        createdAt TEXT,
        updatedAt TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS studySets (
        id TEXT PRIMARY KEY,
        userId TEXT,
        data TEXT,
        createdAt TEXT,
        updatedAt TEXT
    )`);
    // Insert default teacher if not exists
    db.get("SELECT * FROM users WHERE id = 'teacher1'", (err, row) => {
        if (!row) {
            db.run("INSERT INTO users (id, username, role, pin) VALUES (?, ?, ?, ?)",
                ['teacher1', 'teacher_user', 'teacher', '5678']);
        }
    });
});

// --- Helper Functions ---
function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}
function getCurrentTimestamp() {
    return new Date().toISOString();
}
function generateToken(userId) {
    return `token_${userId}_${crypto.randomBytes(8).toString('hex')}`;
}
function authMiddleware(req, res, next) {
    if (req.path === '/api/auth/login') return next();
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });
    db.get("SELECT * FROM tokens WHERE token = ? AND expiresAt > ?", [token, Date.now()], (err, row) => {
        if (row) {
            req.user = { userId: row.userId, role: row.role };
            next();
        } else {
            res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
        }
    });
}
app.use(authMiddleware);

// --- Auth Endpoints ---
app.post('/api/auth/login', (req, res) => {
    const { pin } = req.body;
    db.get("SELECT * FROM users WHERE pin = ? AND role = 'teacher'", [pin], (err, user) => {
        if (user) {
            const token = generateToken(user.id);
            const expiresAt = Date.now() + 60 * 60 * 1000;
            db.run("INSERT INTO tokens (token, userId, role, expiresAt) VALUES (?, ?, ?, ?)",
                [token, user.id, user.role, expiresAt]);
            res.json({ token, userId: user.id, role: user.role });
        } else {
            res.status(401).json({ message: 'Invalid PIN' });
        }
    });
});
app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    db.run("DELETE FROM tokens WHERE token = ?", [token], () => {
        res.json({ message: 'Logged out' });
    });
});

// --- Days Endpoints ---
app.get('/api/days', (req, res) => {
    db.all("SELECT * FROM days WHERE userId = ?", [req.user.userId], (err, rows) => {
        res.json(rows.map(r => ({ ...JSON.parse(r.data), id: r.id, userId: r.userId, createdAt: r.createdAt, updatedAt: r.updatedAt })));
    });
});
app.post('/api/days', (req, res) => {
    const id = generateId('day');
    const now = getCurrentTimestamp();
    const data = JSON.stringify(req.body);
    db.run("INSERT INTO days (id, userId, data, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
        [id, req.user.userId, data, now, now], function () {
            res.status(201).json({ ...req.body, id, userId: req.user.userId, createdAt: now, updatedAt: now });
        });
});
app.put('/api/days/:id', (req, res) => {
    const now = getCurrentTimestamp();
    const data = JSON.stringify(req.body);
    db.run("UPDATE days SET data = ?, updatedAt = ? WHERE id = ? AND userId = ?",
        [data, now, req.params.id, req.user.userId], function () {
            if (this.changes) {
                res.json({ ...req.body, id: req.params.id, userId: req.user.userId, updatedAt: now });
            } else {
                res.status(404).json({ message: 'Day not found' });
            }
        });
});
app.delete('/api/days/:id', (req, res) => {
    db.run("DELETE FROM days WHERE id = ? AND userId = ?", [req.params.id, req.user.userId], function () {
        res.status(this.changes ? 204 : 404).end();
    });
});

// --- Lesson Sections Endpoints ---
app.get('/api/days/:dayId/sections', (req, res) => {
    db.all("SELECT * FROM lessonSections WHERE dayId = ? AND userId = ?", [req.params.dayId, req.user.userId], (err, rows) => {
        res.json(rows.map(r => ({ ...JSON.parse(r.data), id: r.id, dayId: r.dayId, userId: r.userId, createdAt: r.createdAt, updatedAt: r.updatedAt })));
    });
});
app.post('/api/days/:dayId/sections', (req, res) => {
    const id = generateId('sec');
    const now = getCurrentTimestamp();
    const data = JSON.stringify(req.body);
    db.run("INSERT INTO lessonSections (id, dayId, userId, data, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
        [id, req.params.dayId, req.user.userId, data, now, now], function () {
            res.status(201).json({ ...req.body, id, dayId: req.params.dayId, userId: req.user.userId, createdAt: now, updatedAt: now });
        });
});
app.put('/api/sections/:id', (req, res) => {
    const now = getCurrentTimestamp();
    const data = JSON.stringify(req.body);
    db.run("UPDATE lessonSections SET data = ?, updatedAt = ? WHERE id = ? AND userId = ?",
        [data, now, req.params.id, req.user.userId], function () {
            if (this.changes) {
                res.json({ ...req.body, id: req.params.id, userId: req.user.userId, updatedAt: now });
            } else {
                res.status(404).json({ message: 'Lesson Section not found' });
            }
        });
});
app.delete('/api/sections/:id', (req, res) => {
    db.run("DELETE FROM lessonSections WHERE id = ? AND userId = ?", [req.params.id, req.user.userId], function () {
        res.status(this.changes ? 204 : 404).end();
    });
});

// --- Study Sets Endpoints ---
app.get('/api/studysets', (req, res) => {
    db.all("SELECT * FROM studySets WHERE userId = ?", [req.user.userId], (err, rows) => {
        const sets = rows.map(r => {
            const d = JSON.parse(r.data);
            return { ...d, id: r.id, userId: r.userId, createdAt: r.createdAt, updatedAt: r.updatedAt, itemCount: (d.items || []).length, items: undefined };
        });
        res.json(sets);
    });
});
app.get('/api/studysets/:id', (req, res) => {
    db.get("SELECT * FROM studySets WHERE id = ? AND userId = ?", [req.params.id, req.user.userId], (err, r) => {
        if (r) {
            const d = JSON.parse(r.data);
            res.json({ ...d, id: r.id, userId: r.userId, createdAt: r.createdAt, updatedAt: r.updatedAt });
        } else {
            res.status(404).json({ message: 'Study Set not found' });
        }
    });
});
app.post('/api/studysets', (req, res) => {
    const id = generateId('set');
    const now = getCurrentTimestamp();
    const data = JSON.stringify(req.body);
    db.run("INSERT INTO studySets (id, userId, data, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
        [id, req.user.userId, data, now, now], function () {
            res.status(201).json({ ...req.body, id, userId: req.user.userId, createdAt: now, updatedAt: now });
        });
});
app.put('/api/studysets/:id', (req, res) => {
    const now = getCurrentTimestamp();
    const data = JSON.stringify(req.body);
    db.run("UPDATE studySets SET data = ?, updatedAt = ? WHERE id = ? AND userId = ?",
        [data, now, req.params.id, req.user.userId], function () {
            if (this.changes) {
                res.json({ ...req.body, id: req.params.id, userId: req.user.userId, updatedAt: now });
            } else {
                res.status(404).json({ message: 'Study Set not found' });
            }
        });
});
app.delete('/api/studysets/:id', (req, res) => {
    db.run("DELETE FROM studySets WHERE id = ? AND userId = ?", [req.params.id, req.user.userId], function () {
        res.status(this.changes ? 204 : 404).end();
    });
});

// --- Plan Endpoint: Get all days, sections, and study sets for the user ---
app.get('/api/plan', async (req, res) => {
    try {
        // Get all days for the user
        db.all("SELECT * FROM days WHERE userId = ?", [req.user.userId], (err, dayRows) => {
            if (err) return res.status(500).json({ message: 'DB error (days)' });
            const days = dayRows.map(r => ({
                ...JSON.parse(r.data),
                id: r.id,
                userId: r.userId,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt
            }));

            // For each day, get its sections
            const dayIds = days.map(d => d.id);
            if (dayIds.length === 0) {
                // No days, just return empty structure
                fetchStudySetsAndRespond(days, []);
                return;
            }
            db.all(
                `SELECT * FROM lessonSections WHERE dayId IN (${dayIds.map(() => '?').join(',')}) AND userId = ?`,
                [...dayIds, req.user.userId],
                (err, sectionRows) => {
                    if (err) return res.status(500).json({ message: 'DB error (sections)' });
                    // Group sections by dayId
                    const sectionsByDay = {};
                    sectionRows.forEach(r => {
                        const section = {
                            ...JSON.parse(r.data),
                            id: r.id,
                            dayId: r.dayId,
                            userId: r.userId,
                            createdAt: r.createdAt,
                            updatedAt: r.updatedAt
                        };
                        if (!sectionsByDay[section.dayId]) sectionsByDay[section.dayId] = [];
                        sectionsByDay[section.dayId].push(section);
                    });
                    // Attach sections to days
                    const daysWithSections = days.map(day => ({
                        ...day,
                        sections: sectionsByDay[day.id] || []
                    }));
                    // Now get study sets
                    fetchStudySetsAndRespond(daysWithSections, sectionRows);
                }
            );
        });

        function fetchStudySetsAndRespond(daysWithSections, sectionRows) {
            db.all("SELECT * FROM studySets WHERE userId = ?", [req.user.userId], (err, setRows) => {
                if (err) return res.status(500).json({ message: 'DB error (studySets)' });
                const studySets = setRows.map(r => {
                    const d = JSON.parse(r.data);
                    return {
                        ...d,
                        id: r.id,
                        userId: r.userId,
                        createdAt: r.createdAt,
                        updatedAt: r.updatedAt,
                        itemCount: (d.items || []).length,
                        items: d.items || []
                    };
                });
                res.json({
                    days: daysWithSections,
                    studySets
                });
            });
        }
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`COSY Backend running at http://localhost:${PORT}`);
});
