import api from './api';


class Auth{
    static async signIn(user){
        let result = await api.post('/login', user);
        return result.data;
    }
}


export default Auth;