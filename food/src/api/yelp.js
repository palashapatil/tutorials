import axios from 'axios';

export default axios.create({
    baseURL: 'https://api.yelp.com/v3/businesses',
    headers: {
        Authorization: 
            'Bearer bMnQZ0yjB844c8XreJykN3hvMl9e5_9B10lDzr7HOWodlxiaIbkvlPlJMpqomeUeF3c9IoYF_wVExzpRbFNh1PYHC5Yk_NbBcYtOuuiQGcBVUS1Z99P1SE5h8i6UXXYx'
    }
});