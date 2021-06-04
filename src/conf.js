
let staticURL = ''
let wsUrl = '';

if (process.env.NODE_ENV === 'production') {
  staticURL = 'http://120.48.9.247:3005/';
  wsUrl = '120.48.9.247:3005/';
} else {
  staticURL = 'http://localhost:3005/'
  wsUrl = '192.168.50.12:3005/';
}

export {
  staticURL,
  wsUrl
}