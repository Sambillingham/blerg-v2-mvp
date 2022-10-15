/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig

// [...Array(100).keys()].map( x => { return  { [`/api/${x}`] :{ page: '/api', query: { id: x } }}}).reduce((accumulator, value, index) => {
//   return {...accumulator, [`/api/${index}`]: value};
// }