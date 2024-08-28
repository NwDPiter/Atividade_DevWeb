const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // Adicionando middleware para processar dados de formulário

// Configuração da conexão com o banco de dados
const pool = mysql.createPool({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'gamesdb'
});

// Rota para buscar todos os jogos
app.get('/', (req, res) => {
    pool.query('SELECT * FROM `games`', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao buscar jogos');
        } else {
            res.render('index', { games: results });
        }
    });
});

// Rota para adicionar um jogo
app.post('/add', (req, res) => {
    const { nome } = req.body; // Desestruturação para obter o nome do jogo

    // Verificando se o nome foi fornecido
    if (!nome) {
        return res.status(400).json({ error: 'O nome do jogo é obrigatório' });
    }

    // Inserindo o novo jogo no banco de dados
    pool.query('INSERT INTO games (nome) VALUES (?)', [nome], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao adicionar o jogo' });
        }

        // Obtendo o ID do jogo recém-inserido
        const insertedId = results.insertId;

        // Redirecionar de volta para a página principal
        res.redirect('/');
    });
});

// Rota para excluir um jogo
app.post('/delete', (req, res) => {
    const { id } = req.body; // Obtendo o ID do jogo a ser excluído

    if (!id) {
        return res.status(400).json({ error: 'ID do jogo é obrigatório' });
    }

    pool.query('DELETE FROM games WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao excluir o jogo' });
        }

        // Redirecionar de volta para a página principal
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
