const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const signup = async (formData) => {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      }),
    });
    
    const json = await res.json();
    
    // Check if HTTP request failed
    if (!res.ok) {
      throw new Error(json.err || `HTTP error! status: ${res.status}`);
    }
    
    // Check if response contains an error
    if (json.err) {
      throw new Error(json.err);
    }
    
    // Backend only returns token, so we need to decode it to get user info
    const token = json.token;
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    
    // Decode the JWT to get user information (without verification for display purposes)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    return {
      token,
      user: {
        id: payload.payload._id,
        username: payload.payload.username
      }
    };
  } catch (err) {
    console.error('Signup error:', err);
    throw err;
  }
};

const signin = async (formData) => {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      }),
    });
    
    const json = await res.json();
    
    // Check if HTTP request failed
    if (!res.ok) {
      throw new Error(json.err || `HTTP error! status: ${res.status}`);
    }
    
    // Check if response contains an error
    if (json.err) {
      throw new Error(json.err);
    }
    
    // Backend only returns token, so we need to decode it to get user info
    const token = json.token;
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    
    // Decode the JWT to get user information (without verification for display purposes)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    return {
      token,
      user: {
        id: payload.payload._id,
        username: payload.payload.username
      }
    };
  } catch (err) {
    console.error('Signin error:', err);
    throw err;
  }
};

const signout = () => {
  localStorage.removeItem('token');
};

const getUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    // Decode the JWT to get user information
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.payload._id,
      username: payload.payload.username,
      _id: payload.payload._id
    };
  } catch (err) {
    // If token is invalid, remove it
    localStorage.removeItem('token');
    return null;
  }
};

export { signup, signin, signout, getUser };