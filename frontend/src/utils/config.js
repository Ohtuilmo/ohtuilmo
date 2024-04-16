// We can just request /api instead of making requests to a hardcoded/injected
// backend URL since nginx will proxy /api to the backend.
//
// When in local dev, react-scripts knows how to proxy these calls according
// to package.json's "proxy".

console.log(import.meta.env.BASE_URL)
const BACKEND_API_BASE = `${import.meta.env.BASE_URL}api`
export { BACKEND_API_BASE }
