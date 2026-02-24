// server/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error('Błąd:', err.stack);

    // Błędy związane z bazą danych
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
            error: 'Duplikat danych - rekord już istnieje' 
        });
    }

    if (err.code === 'ER_NO_REFERENCED_ROW') {
        return res.status(400).json({ 
            error: 'Naruszenie klucza obcego - podane ID nie istnieje' 
        });
    }

    // Domyślny błąd serwera
    res.status(500).json({ 
        error: 'Wystąpił błąd serwera' 
    });
};

module.exports = errorHandler;