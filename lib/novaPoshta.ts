import axios from 'axios';

export class NovaPoshta {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NP_API_KEY || '';
  }
  async fetchCities(cityName: string) {
    const url = 'https://api.novaposhta.ua/v2.0/json/';
    const requestBody = {
      apiKey: this.apiKey,
      modelName: 'AddressGeneral',
      calledMethod: 'searchSettlements',
      methodProperties: {
        CityName: cityName,
        Limit: '20',
        Page: '1',
      },
    };

    const { data } = await axios.post(url, requestBody);

    return data.data[0];
  }

  async fetchWarehouses(city: string, Limit: string) {
    const url = 'https://api.novaposhta.ua/v2.0/json/';
    const requestBody = {
      apiKey: this.apiKey,
      modelName: 'AddressGeneral',
      calledMethod: 'getWarehouses',
      methodProperties: {
        CityName: city,
        Page: '1',
        Limit,
      },
    };
    const { data } = await axios.post(url, requestBody);
    return data.data;
  }
}
