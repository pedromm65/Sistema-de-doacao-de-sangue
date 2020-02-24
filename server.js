/*SERVER CONFIGURATION */
const express = require('express')

const server = express()

const nunjucks = require('nunjucks')

server.use(express.static('public'))

server.use(express.urlencoded({ extended: true }))

/*DATABASE CONFIGURATION */
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '1243',
    host: 'localhost',
    port: '5432',
    database: 'doe'
})
/*DATABASE CONFIGURATION */


nunjucks.configure('./', {
    express: server,
    noCache: true
})
/*SERVER CONFIGURATION */






server.get('/', (req, res) => {
    db.query("SELECT * FROM donors", (err, result) => {
       if (err) return res.send("Erro no baco de dados.")


       const donors = result.rows
       return res.render('index.html', { donors })

    })
})

server.post('/', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(!name || !email || !blood) {
        return res.send("Todos os campos sao obrigatorios.")
    }

    const query = 
    `INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, (err) => {
        if(err) return res.send("Erro no banco de dados.")

        return res.redirect('/')

    })

})


server.listen(5000, () => {
    console.log('Server On')
})