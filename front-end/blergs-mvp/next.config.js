/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/api/0': { page: '/api', query: { id: '0' } },
      '/api/1': { page: '/api', query: { id: '1' } },
      '/api/2': { page: '/api', query: { id: '2' } },
    }
  },
};

module.exports = nextConfig

// [...Array(100).keys()].map( x => { return  { [`/api/${x}`] :{ page: '/api', query: { id: x } }}}).reduce((accumulator, value, index) => {
//   return {...accumulator, [`/api/${index}`]: value};
// }, {})