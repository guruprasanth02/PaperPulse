import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const FIREBASE_CONFIGURED = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

export function AuthProvider({ children }) {
  // If Firebase is not configured, skip straight to null (unauthenticated)
  const [user, setUser]       = useState(FIREBASE_CONFIGURED ? undefined : null);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!FIREBASE_CONFIGURED) return;
    // Dynamic import so a missing/bad config never crashes the module
    let unsub = () => {};
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      import('../firebase').then(({ auth }) => {
        unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null));
      }).catch(err => {
        console.warn('Firebase init failed:', err.message);
        setUser(null);
        setError('Firebase configuration error. Check your VITE_FIREBASE_* keys in .env');
      });
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    if (!FIREBASE_CONFIGURED) {
      setError('Firebase is not configured. Add your VITE_FIREBASE_* keys to .env to enable Google sign-in.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { signInWithPopup } = await import('firebase/auth');
      const { auth, provider }  = await import('../firebase');
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!FIREBASE_CONFIGURED) return;
    try {
      const { signOut } = await import('firebase/auth');
      const { auth }    = await import('../firebase');
      await signOut(auth);
    } catch (err) {
      console.warn('Logout error:', err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
