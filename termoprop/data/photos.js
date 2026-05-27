const BASE = 'https://images.unsplash.com';

const propPhotos = {
  1:  `${BASE}/photo-1600585154340-be6161a56a0c?w=320&h=220&fit=crop`,  // modern house exterior
  2:  `${BASE}/photo-1564013799919-ab600027ffc6?w=320&h=220&fit=crop`,  // house with pool
  3:  `${BASE}/photo-1502672260266-1c1ef2d93688?w=320&h=220&fit=crop`,  // apartment living room
  4:  `${BASE}/photo-1493809842364-78817add7ffb?w=320&h=220&fit=crop`,  // bright bedroom
  5:  `${BASE}/photo-1497366216548-37526070297c?w=320&h=220&fit=crop`,  // open office
  6:  `${BASE}/photo-1522708323474-d813b4dc2e48?w=320&h=220&fit=crop`,  // studio apartment
  7:  `${BASE}/photo-1600596542815-0c7f4bb4b3d6?w=320&h=220&fit=crop`,  // house with garden
  8:  `${BASE}/photo-1484154218-e3bac7a40e27?w=320&h=220&fit=crop`,  // modern kitchen
  9:  `${BASE}/photo-1570129477492-45c003edd2be?w=320&h=220&fit=crop`,  // house exterior
  10: `${BASE}/photo-1560448204-e02f11c3d0e2?w=320&h=220&fit=crop`,  // apartment interior
  11: `${BASE}/photo-1545324418-cc1a3fa10c00?w=320&h=220&fit=crop`,  // luxury high-rise
  12: `${BASE}/photo-1497366811353-6870744d04b2?w=320&h=220&fit=crop`,  // office space
  13: `${BASE}/photo-1512915922686-57c11dde9b6b?w=320&h=220&fit=crop`,  // suburban house
  14: `${BASE}/photo-1560185007-cde436f6a4d0?w=320&h=220&fit=crop`,  // bright apartment balcony
  15: `${BASE}/photo-1486325212027-8081e485255e?w=320&h=220&fit=crop`,  // warehouse/industrial
  16: `${BASE}/photo-1555041469-a586c61ea9bc?w=320&h=220&fit=crop`,  // loft living room
};

export const thumbPhotos = Object.fromEntries(
  Object.entries(propPhotos).map(([k, v]) => [k, v.replace('w=320&h=220', 'w=200&h=140')])
);

export default propPhotos;
