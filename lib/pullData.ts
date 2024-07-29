const axios = require('axios');
const fs = require('fs/promises');

async function main() {
  const url = 'https://api.novaposhta.ua/v2.0/json/';

  const response = await axios.post(url, {
    modelName: 'AddressGeneral',
    calledMethod: 'getCities',
  });

  await fs.writeFile(
    'cities.json',
    JSON.stringify(response.data.data.slice(0, 50), null, 2),
  );
}

main();
