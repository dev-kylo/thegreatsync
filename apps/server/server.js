const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const PORT = 2222;

const app = express();
app.use(bodyParser.json());

function verify(event){
    if (!event || !event.repository) return false;
    return event?.repository?.id === 454284151 // this is shallow security check for making sure it is from github. Requires signature verify
}

function isStrapiChange(event){
    if (!event || !Array.isArray(event?.commits)) return false;
    return event.commits.some(commit => 
        Array.isArray(commit.modified) && commit.modified.some(file => file.includes('apps/strapi'))
    );
}

app.post('/push', (req, res) => {
    const payload = req.body;

    if (!verify(payload)) return res.status(400).send('Invalid');
  
    if (payload.ref === 'refs/heads/main' && isStrapiChange(payload)) {

        res.status(200).send('Deployment started');
        exec('cd ~/thegreatsync && git pull && pnpm install && pnpm strapi build', (err, stdout, stderr) => {
            if (err) {
                console.error(`Error updating repo: ${stderr}`);
                return
            }
            
            // Restart Strapi using PM2
            exec('pm2 restart ecosystem.config.js --only strapi', (err, stdout, stderr) => {
                if (err) {
                console.error(`Error restarting Strapi: ${stderr}`);
                return
                }
                console.log(`Strapi restarted successfully: ${stdout}`);   
            });
        });
    } else {
        res.status(200).send('No action taken - not main branch or not a strapi change');
    }
});


app.listen(PORT, () => {
    console.log(`Webhook listener running on port ${PORT}`);
});