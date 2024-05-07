import React from 'react';
import '../public/styles.css';
import { Link } from 'react-router-dom'; 

function LoginSignup() {
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand" href="#">Soccor Sphere</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="nav navbar-nav ml-auto">
            <a className="nav-link" href="index.html">Home</a>
            <a className="nav-link" href="competition.html">Leagues & Competitions</a>
            <a className="nav-link" href="#">Matches</a>
            <a className="nav-link" href="login_signup.html">Login & Sign Up</a>
          </div>
        </div>
      </nav>

      <div className="bg">
        <div className="container">
          <input type="checkbox" id="flip" />
          <div className="cover">
            <div className="front">
              <img src="img/front.png" alt="" />
            </div>
            <div className="back">
              <img className="backImg" src="img/back.png" alt="" />
            </div>
          </div>
          <div className="forms">
            <div className="form-content">
              {/* Login Form */}
              <div className="login-form">
                <div className="title">Login</div>
                <form action="#">
                  <div className="input-boxes">
                    <div className="input-box">
                      <i className="fa fa-envelope"></i>
                      <input type="text" placeholder="Enter your email" required />
                    </div>
                    <div className="input-box">
                      <i className="fa fa-lock"></i>
                      <input type="password" placeholder="Enter your password" required />
                    </div>
                    <div className="text"><a href="#">Forgot password?</a></div>
                    <div className="button input-box">
                      <input type="submit" value="Submit" />
                    </div>
                    <div className="text sign-up-text">Don't have an account? <Link to="/signup">Signup now</Link></div>
                  </div>
                </form>
              </div>
              {/* Signup Form */}
              <div className="signup-form">
                <div className="title">Signup</div>
                <form action="#">
                  <div className="input-boxes">
                    <div className="input-box">
                      <i className="fa fa-user"></i>
                      <input type="text" placeholder="Enter your name" required />
                    </div>
                    <div className="input-box">
                      <i className="fa fa-envelope"></i>
                      <input type="text" placeholder="Enter your email" required />
                    </div>
                    <div className="input-box">
                      <i className="fa fa-lock"></i>
                      <input type="password" placeholder="Enter your password" required />
                    </div>
                    <div className="button input-box">
                      <input type="submit" value="Submit" />
                    </div>
                    <div className="text sign-up-text">Already have an account? <Link to="/login">Login now</Link></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid footer">
        <div className="row footer-content">
          <p className="footer-text">&copy; 2024 | Soccor Sphere. All rights reserved</p>
        </div>
        <div className="row footer-content">
          <div className="col">
            <i style={{ fontSize: '24px' }} className="fa">&#xf09a;</i>
          </div>
          <div className="col">
            <i style={{ fontSize: '24px' }} className="fa">&#xf08c;</i>
          </div>
          <div className="col">
            <i style={{ fontSize: '24px' }} className="fa" id="insta">&#xf16d;</i>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginSignup;
