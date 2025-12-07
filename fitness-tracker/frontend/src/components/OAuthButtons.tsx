import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

interface OAuthData {
  googleId?: string;
  appleId?: string;
  wechatId?: string;
  email: string;
  name: string;
  accessToken: string;
}

const OAuthButtons: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      // In a real implementation, this would involve redirecting to Google's OAuth endpoint
      // and handling the callback. For now, we'll simulate a successful login.
      
      // Simulate OAuth data
      const oauthData: OAuthData = {
        googleId: 'google_' + Math.random().toString(36).substr(2, 9),
        email: 'user@gmail.com',
        name: 'Google User',
        accessToken: 'fake_google_access_token'
      };
      
      const response = await authAPI.googleLogin(oauthData);
      const { token } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google login error:', err);
      alert('Google登录失败');
    }
  };

  const handleAppleLogin = async () => {
    try {
      // In a real implementation, this would involve redirecting to Apple's OAuth endpoint
      // and handling the callback. For now, we'll simulate a successful login.
      
      // Simulate OAuth data
      const oauthData: OAuthData = {
        appleId: 'apple_' + Math.random().toString(36).substr(2, 9),
        email: 'user@icloud.com',
        name: 'Apple User',
        accessToken: 'fake_apple_access_token'
      };
      
      const response = await authAPI.appleLogin(oauthData);
      const { token } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Apple login error:', err);
      alert('Apple登录失败');
    }
  };

  const handleWeChatLogin = async () => {
    try {
      // In a real implementation, this would involve redirecting to WeChat's OAuth endpoint
      // and handling the callback. For now, we'll simulate a successful login.
      
      // Simulate OAuth data
      const oauthData: OAuthData = {
        wechatId: 'wechat_' + Math.random().toString(36).substr(2, 9),
        email: 'user@wechat.com',
        name: 'WeChat User',
        accessToken: 'fake_wechat_access_token'
      };
      
      const response = await authAPI.wechatLogin(oauthData);
      const { token } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('WeChat login error:', err);
      alert('微信登录失败');
    }
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">或者使用第三方账号登录</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <img 
              className="h-5 w-5" 
              src="https://developers.google.com/identity/images/g-logo.png" 
              alt="Google logo" 
            />
            <span className="ml-2">Google</span>
          </button>
        </div>

        <div>
          <button
            onClick={handleAppleLogin}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="h-5 w-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 12.04C17.05 12.04 17.05 12.04 17.05 12.04C17.08 12.39 17.1 12.74 17.1 13.1C17.1 15.1 16.4 16.8 15.1 18C14.2 18.8 13 19.3 11.7 19.3C10.4 19.3 9.2 18.9 8.2 18.2C7.2 17.5 6.5 16.5 6.1 15.4C5.7 14.3 5.6 13.1 5.8 12C6 10.9 6.5 9.9 7.2 9.1C8 8.3 9 7.8 10.1 7.6C11.2 7.4 12.3 7.6 13.3 8C13.7 8.2 14.1 8.4 14.4 8.7C14.7 9 15 9.3 15.2 9.7C15.1 9.7 15.1 9.7 15.1 9.7C15.1 9.7 15.1 9.7 15.1 9.7C14.9 9.5 14.7 9.3 14.4 9.1C13.5 8.4 12.4 8 11.3 7.9C10.2 7.8 9.1 8 8 8.3C6.9 8.6 5.9 9.2 5.1 10C4.3 10.8 3.7 11.8 3.4 12.9C3.1 14 3 15.2 3.2 16.3C3.4 17.4 3.9 18.4 4.6 19.2C5.3 20 6.2 20.6 7.2 21C8.2 21.4 9.3 21.6 10.4 21.6C12.1 21.6 13.7 21.2 15.1 20.4C16.5 19.6 17.6 18.5 18.3 17.2C19 15.9 19.3 14.5 19.2 13.1C19.1 11.7 18.7 10.3 17.9 9.1C17.6 8.7 17.3 8.3 16.9 8C16.8 7.9 16.7 7.8 16.6 7.7C16.6 7.7 16.6 7.7 16.6 7.7C16.6 7.7 16.6 7.7 16.6 7.7C17.3 8.5 17.8 9.5 18.1 10.5C18.4 11.5 18.5 12.5 18.4 13.5C18.3 14.5 18 15.5 17.5 16.4C17 17.3 16.3 18.1 15.5 18.7C14.7 19.3 13.8 19.7 12.8 19.9C11.8 20.1 10.8 20.1 9.8 19.9C8.8 19.7 7.9 19.3 7.1 18.7C6.3 18.1 5.6 17.3 5.1 16.4C4.6 15.5 4.3 14.5 4.2 13.5C4.1 12.5 4.2 11.5 4.5 10.5C4.8 9.5 5.3 8.5 6 7.7C6.7 6.9 7.6 6.3 8.6 5.9C9.6 5.5 10.7 5.3 11.8 5.3C12.9 5.3 14 5.5 15 5.9C16 6.3 16.9 6.9 17.6 7.7C17.7 7.8 17.8 7.9 17.9 8C17.9 8 17.9 8 17.9 8C17.9 8 17.9 8 17.9 8C17.8 7.9 17.7 7.8 17.6 7.7C17.6 7.7 17.6 7.7 17.6 7.7C17.6 7.7 17.6 7.7 17.6 7.7C17.3 7.4 17 7.1 16.6 6.8C15.7 5.9 14.5 5.3 13.2 5.1C11.9 4.9 10.6 5.1 9.4 5.6C8.2 6.1 7.2 6.9 6.4 7.9C5.6 8.9 5.1 10.1 4.9 11.3C4.7 12.5 4.8 13.8 5.2 15C5.6 16.2 6.3 17.3 7.2 18.1C8.1 18.9 9.2 19.5 10.4 19.8C11.6 20.1 12.9 20.2 14.1 20C15.3 19.8 16.4 19.4 17.3 18.8C18.2 18.2 18.9 17.4 19.4 16.5C19.9 15.6 20.1 14.6 20.1 13.6C20.1 12.9 20 12.3 19.8 11.7C19.6 11.1 19.4 10.5 19.1 10C18.8 9.5 18.5 9 18.1 8.6C17.7 8.2 17.3 7.8 16.9 7.5C16.5 7.2 16.1 6.9 15.6 6.7C15.1 6.5 14.6 6.3 14.1 6.2C13.6 6.1 13.1 6 12.6 6C12.1 6 11.6 6.1 11.1 6.2C10.6 6.3 10.1 6.5 9.6 6.7C9.1 6.9 8.6 7.2 8.2 7.5C7.8 7.8 7.4 8.2 7.1 8.6C6.8 9 6.5 9.5 6.3 10C6.1 10.5 5.9 11.1 5.8 11.7C5.7 12.3 5.6 12.9 5.6 13.6C5.6 14.6 5.8 15.6 6.3 16.5C6.8 17.4 7.5 18.2 8.4 18.8C9.3 19.4 10.4 19.8 11.6 20C12.8 20.2 14.1 20.1 15.3 19.8C16.5 19.5 17.6 18.9 18.4 18.1C19.2 17.3 19.8 16.2 20 15C20.2 13.8 20.1 12.5 19.7 11.3C19.3 10.1 18.6 9 17.8 8C17.5 7.6 17.2 7.3 16.8 7C16.8 7 16.8 7 16.8 7C16.8 7 16.8 7 16.8 7C17.4 7.5 17.9 8.1 18.3 8.7C18.7 9.3 19 10 19.2 10.7C19.4 11.4 19.5 12.1 19.5 12.8C19.5 13.5 19.4 14.2 19.2 14.9C19 15.6 18.7 16.3 18.3 16.9C17.9 17.5 17.4 18.1 16.8 18.6C16.2 19.1 15.5 19.5 14.8 19.8C14.1 20.1 13.3 20.3 12.5 20.4C11.7 20.5 10.9 20.5 10.1 20.4C9.3 20.3 8.5 20.1 7.8 19.8C7.1 19.5 6.4 19.1 5.8 18.6C5.2 18.1 4.7 17.5 4.3 16.9C3.9 16.3 3.6 15.6 3.4 14.9C3.2 14.2 3.1 13.5 3.1 12.8C3.1 12.1 3.2 11.4 3.4 10.7C3.6 10 3.9 9.3 4.3 8.7C4.7 8.1 5.2 7.5 5.8 7C6.4 6.5 7.1 6.1 7.8 5.8C8.5 5.5 9.3 5.3 10.1 5.2C10.9 5.1 11.7 5.1 12.5 5.2C13.3 5.3 14.1 5.5 14.8 5.8C15.5 6.1 16.2 6.5 16.8 7C16.8 7 16.8 7 16.8 7C16.8 7 16.8 7 16.8 7C16.4 6.6 16 6.3 15.5 6C14.6 5.4 13.5 5.1 12.4 5C11.3 4.9 10.2 5.1 9.2 5.5C8.2 5.9 7.3 6.6 6.6 7.4C5.9 8.2 5.4 9.2 5.2 10.2C5 11.2 5.1 12.3 5.4 13.3C5.7 14.3 6.3 15.2 7.1 15.9C7.9 16.6 8.9 17.1 10 17.3C11.1 17.5 12.2 17.4 13.2 17.1C14.2 16.8 15.1 16.2 15.8 15.4C16.5 14.6 16.9 13.6 17 12.6C17 12.4 17 12.2 17 12C17 12 17 12 17 12C17 12 17 12 17 12C17 12 17 12 17 12Z"/>
            </svg>
            <span className="ml-2">Apple</span>
          </button>
        </div>

        <div>
          <button
            onClick={handleWeChatLogin}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.9 16.3c-.1.4-.5.7-.9.7h-1.8c-.3 0-.6-.1-.8-.4l-1.5-2.2c-.2-.3-.6-.5-1-.5-.4 0-.8.2-1 .5l-1.5 2.2c-.2.3-.5.4-.8.4h-1.8c-.4 0-.7-.3-.9-.7-.4-1.1-.6-2.3-.6-3.5 0-3.3 2.7-6 6-6s6 2.7 6 6c0 1.2-.2 2.4-.6 3.5z"/>
            </svg>
            <span className="ml-2">微信</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuthButtons;