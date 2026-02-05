
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const dbPath = path.join(process.cwd(), 'api', 'db.json');

    if (req.method === 'GET') {
        try {
            const fileData = fs.readFileSync(dbPath, 'utf8');
            const data = JSON.parse(fileData);
            return res.status(200).json(data.signups);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to read database' });
        }
    } else if (req.method === 'POST') {
        try {
            const fileData = fs.readFileSync(dbPath, 'utf8');
            const data = JSON.parse(fileData);

            const newSignup = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                ...req.body
            };

            data.signups.unshift(newSignup); // Add to top

            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

            return res.status(201).json(newSignup);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to save signup' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
