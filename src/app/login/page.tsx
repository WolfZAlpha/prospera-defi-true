'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from '../../styles/LoginPage.module.css';

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    arbitrumWallet: ''
  });
  const router = useRouter();

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
    try {
      const response = await axios.post(endpoint, formData);
      if (response.status === 200 || response.status === 201) {
        router.push('/selection');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response ? error.response.data.message : 'Server error');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={`container-fluid ${styles.loginSection}`}>
        <div className="row w-100">
          <div className={`col-md-6 ${styles.loginCard} ${styles.box}`}>
            <div className="p-2 d-flex flex-column align-items-center mx-auto w-100">
              {!isSignUp ? (
                <>
                  <h2 className="text-uppercase text-center font-bold mb-2">Login</h2>
                  <p className={`text-center ${styles.textWhite50} mb-2`}>Please enter your login and password!</p>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit} className="w-100">
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
                    <p className={`text-center ${styles.textWhite50} mb-2`}>
                      <a href="#!" className={styles.textWhite50}>Forgot password?</a>
                    </p>
                    <button type="submit" className={`btn btn-primary w-100 ${styles.loginBtn}`}>Login</button>
                  </form>
                  <div className="d-flex flex-row mt-2 mb-2 justify-content-center w-100">
                    <a href="/auth/twitter" className={`btn btn-primary w-100 mt-2 ${styles.loginBtn}`}>Login with Twitter</a>
                  </div>
                  <div>
                    <p className={`text-center mb-0 ${styles.textWhite50}`}>
                      Don&apos;t have an account? <a href="#!" className={`font-bold ${styles.textWhite50}`} onClick={toggleSignUp}>Sign Up</a>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-uppercase text-center font-bold mb-2">Sign Up</h2>
                  <p className={`text-center ${styles.textWhite50} mb-2`}>Please enter your details to create an account!</p>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit} className="w-100">
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
                    <button type="submit" className={`btn btn-primary w-100 ${styles.signUpBtn}`}>Sign Up</button>
                  </form>
                  <div className="d-flex flex-row mt-2 mb-2 justify-content-center w-100">
                    <a href="/auth/twitter" className={`btn btn-primary w-100 mt-2 ${styles.signUpBtn}`}>Sign Up with Twitter</a>
                  </div>
                  <div>
                    <p className={`text-center mb-0 ${styles.textWhite50}`}>
                      Already have an account? <a href="#!" className={`font-bold ${styles.textWhite50}`} onClick={toggleSignUp}>Log In</a>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;