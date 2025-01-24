const bcrypt = require('bcryptjs');

async function generateHash() {
    const hash = await bcrypt.hash('chereancher', 10);
    console.log('Generated hash:', hash);
}

generateHash(); 