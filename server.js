const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;
const logFile = path.join(__dirname, 'clics.json');

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(__dirname));

// Vérifier si le fichier de log existe
if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, JSON.stringify([], null, 2));
}

// Route pour enregistrer un clic
app.post('/enregistrer', (req, res) => {
    const { categorie, timestamp } = req.body;
    
    try {
        // Lire les données existantes
        let clics = JSON.parse(fs.readFileSync(logFile, 'utf8'));
        
        // Ajouter le nouveau clic
        clics.push({
            categorie,
            timestamp,
            id: clics.length + 1
        });
        
        // Écrire les données dans le fichier
        fs.writeFileSync(logFile, JSON.stringify(clics, null, 2));
        
        console.log(`✓ Clic enregistré: ${categorie} à ${timestamp}`);
        res.json({ success: true, message: 'Clic enregistré' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route pour récupérer tous les clics
app.get('/clics', (req, res) => {
    try {
        const clics = JSON.parse(fs.readFileSync(logFile, 'utf8'));
        res.json(clics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour réinitialiser les données
app.delete('/reset', (req, res) => {
    try {
        fs.writeFileSync(logFile, JSON.stringify([], null, 2));
        console.log('✓ Données réinitialisées');
        res.json({ success: true, message: 'Données réinitialisées' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`\n✓ Serveur démarré sur http://localhost:${port}`);
    console.log(`✓ Fichier de log: ${logFile}\n`);
});
