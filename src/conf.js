
let staticURL = ''
let wsUrl = '';

if (process.env.NODE_ENV === 'production') {
  staticURL = 'http://120.48.9.247:3005/';
  wsUrl = '120.48.9.247:3005/';
} else {
  staticURL = 'http://192.168.31.253:3005/'
  wsUrl = '192.168.31.253:3005/';
}

export {
  staticURL,
  wsUrl
}