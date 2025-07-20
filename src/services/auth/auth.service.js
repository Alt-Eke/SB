import axiosClient from "../../utils/apiClient"

class AuthService {
    async login(email, password){
       const res = await axiosClient.post('/auth/login', {
            email,
            password
        });
        return res.data;
    }
    async register(userData){
        console.log('AuthService: Sending registration data:', userData);
        const res = await axiosClient.post('/auth/register', userData);
        return res.data;
    }
}

const authService = new AuthService();
export default authService;