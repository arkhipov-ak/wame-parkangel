import axios from 'axios'

const instance = axios.create({
  params: {
    t: new Date().getTime()
  }
})

instance.defaults.headers = {
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export default instance