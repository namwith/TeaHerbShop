import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AuthModal = () => {
    const [isLogin, setIsLogin] = useState(true); // true: Đăng nhập, false: Đăng ký
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // Gọi "não bộ" để lưu thông tin sau khi đăng nhập thành công
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        
        try {
            const res = await axios.post(`http://localhost:3000/api${endpoint}`, { username, password });
            
            if (res.data.success) {
                alert(res.data.message);
                if (isLogin) {
                    // Đăng nhập thành công -> Lưu vào Context
                    login(res.data.token, res.data.user.username, res.data.user.role);
                    // Đóng modal tự động
                    document.getElementById('btnCloseAuthModal').click();
                } else {
                    // Đăng ký thành công -> Chuyển sang form Đăng nhập
                    setIsLogin(true);
                }
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi kết nối tới máy chủ!');
        }
    };

    return (
        <div className="modal fade" id="authModal" tabIndex="-1">
            <div className="modal-dialog modal-sm">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold text-success">
                            {isLogin ? '👋 Đăng nhập' : '✨ Đăng ký'}
                        </h5>
                        <button type="button" className="btn-close" id="btnCloseAuthModal" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Tài khoản</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mật khẩu</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn btn-success w-100">
                                {isLogin ? 'Đăng nhập' : 'Đăng ký ngay'}
                            </button>
                        </form>
                        <div className="text-center mt-3">
                            <span 
                                className="text-primary" 
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;