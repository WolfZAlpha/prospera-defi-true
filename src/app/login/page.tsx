'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from '../../styles/LoginPage.module.css';

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    arbitrumWallet: ''
  });
  const router = useRouter();

  useEffect(() => {
    const img = new Image();
    img.src = '/assets/desktop-backgrounds/evil-face/EvilFace1.png';
    img.onload = () => {
      document.querySelector(`.${styles.loginPageContainer}`)?.classList.add(styles.loaded);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
    console.log('Submitting to:', endpoint);
    
    let dataToSubmit;
    if (isSignUp) {
      dataToSubmit = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        arbitrumWallet: formData.arbitrumWallet
      };
    } else {
      dataToSubmit = {
        emailOrUsername: formData.emailOrUsername,
        password: formData.password
      };
    }
    
    console.log('Form data:', dataToSubmit);
    
    try {
      const response = await axios.post(endpoint, dataToSubmit);
      console.log('Response:', response);
      if (response.status === 200 || response.status === 201) {
        if (!isSignUp && response.data.token) {
          localStorage.setItem('token', response.data.token);
          // Consider using a secure cookie instead:
          // document.cookie = `token=${response.data.token}; path=/; secure; httpOnly`;
        }
        if (isSignUp) {
          // Trigger email verification here if needed
          console.log('User registered, verification email sent');
        }
        router.push('/selection');
      }
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred during submission');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setFormData({
      emailOrUsername: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      arbitrumWallet: ''
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderForm = () => (
    <div className={`col-md-6 ${styles.loginCard} ${styles.box}`}>
      <div className="p-2 d-flex flex-column align-items-center mx-auto w-100">
        <h2 className="text-uppercase text-center font-bold mb-2">{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <p className={`text-center ${styles.textWhite50} mb-2`}>
          {isSignUp ? 'Please enter your details to create an account!' : 'Please enter your login and password!'}
        </p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="w-100">
          {isSignUp ? (
            <>
              <div className="mb-2">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          ) : (
            <div className="mb-2">
              <label htmlFor="emailOrUsername" className="form-label">Email address or Username</label>
              <input
                type="text"
                className="form-control"
                id="emailOrUsername"
                placeholder="Enter email or username"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="mb-2">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {isSignUp && (
            <>
              <div className="mb-2">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="arbitrumWallet" className="form-label">Arbitrum Wallet</label>
                <input
                  type="text"
                  className="form-control"
                  id="arbitrumWallet"
                  placeholder="Arbitrum Wallet"
                  name="arbitrumWallet"
                  value={formData.arbitrumWallet}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          <button type="submit" className={`btn btn-primary w-100 ${isSignUp ? styles.signUpBtn : styles.loginBtn}`}>
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <div>
          <p className={`text-center mb-0 ${styles.textWhite50}`}>
            {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
            <a href="#!" className={`font-bold ${styles.textWhite50}`} onClick={toggleSignUp}>
              {isSignUp ? 'Log In' : 'Sign Up'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.loginPageContainer}>
      <div className={`container-fluid ${styles.loginSection}`}>
        <div className="row w-100">
          {renderForm()}
        </div>
      </div>
      <button className={styles.hamburgerBtn} onClick={toggleMobileMenu}>
        ☰
      </button>
      <div className={`${styles.mobileFormContainer} ${isMobileMenuOpen ? styles.active : ''}`}>
        {renderForm()}
      </div>
    </div>
  );
};

export default LoginPage;