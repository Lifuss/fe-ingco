// import axios from 'axios';
// import type { NextApiRequest, NextApiResponse } from 'next';

// const { NP_API_URL, NP_API_KEY } = process.env; // Get the Nova Post API URL from .env

// export const POST = async (req: NextApiRequest, res: NextApiResponse<any>) => {
//   try {
//     // Make the API request to fetch cities using Axios
//     if (NP_API_URL) {
//       const response = await axios.post(NP_API_URL, {
//         apiKey: NP_API_KEY,
//         modelName: 'AddressGeneral',
//         calledMethod: 'getCities',
//         methodProperties: {
//           Page: '1',
//           FindByString: (req.body as { city?: string }).city,
//           Limit: '20',
//         },
//       });
//       const data = response.data;
//       return res.status(200).json(data);
//     } else {
//       throw new Error('NP_API_URL is undefined');
//     }
//     // Return the cities as the API response
//   } catch (error) {
//     console.error('Error fetching cities:', error);
//     res.status(500).json({ error: 'Error fetching cities' });
//   }
// };
