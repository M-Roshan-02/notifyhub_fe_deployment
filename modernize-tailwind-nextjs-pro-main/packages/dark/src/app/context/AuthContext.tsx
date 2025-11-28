"use client"
import { createContext, useEffect, useReducer, ReactNode } from 'react';
import { firebase } from '@/app/guards/firebase/Firebase';
// import { supabase } from '@/app/guards/supabase/supabaseClient'; // Comment out real import
const supabase: any = { // Dummy supabase object
    auth: {
        getSession: () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: () => Promise.resolve(),
        signUp: () => Promise.resolve(),
        signInWithPassword: () => Promise.resolve(),
        signOut: () => Promise.resolve(),
    }
};
import { useSession, signIn, signOut } from 'next-auth/react';

// Define the initial state structure
interface InitialStateType {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: any | null;
    platform: 'Firebase' | 'Supabase' | 'NextAuth' | null;
}

const initialState: InitialStateType = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
    platform: 'NextAuth',
};

const reducer = (state: InitialStateType, action: any) => {
    switch (action.type) {
        case 'AUTH_STATE_CHANGED':
            return { ...state, ...action.payload, isInitialized: true };
        case 'SET_PLATFORM':
            return { ...state, platform: action.payload };
        default:
            return state;
    }
};

const AuthContext = createContext<any | null>({
    ...initialState,
    signup: () => Promise.resolve(),
    passwordStep: () => Promise.resolve(), // Added
    mfaVerify: () => Promise.resolve(),    // Added
    getOAuthToken: () => Promise.resolve(), // Renamed from fetchAccessToken
    mfaSetup: () => Promise.resolve(),     // Added
    mfaConfirm: () => Promise.resolve(),   // Added
    signin: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    setPlatform: () => { },
    loginWithProvider: () => Promise.resolve(),
    loginWithSupabase: () => Promise.resolve(),
});

// Helper function to store tokens
const storeTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

// Helper function to clear tokens
const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { data: session, status } = useSession();


    const setPlatform = (platform: 'Firebase' | 'Supabase' | 'NextAuth') => {
        dispatch({ type: 'SET_PLATFORM', payload: platform });
    };


    useEffect(() => {
        if (state.platform === 'Firebase') {

            const unsubscribeFirebase = firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    const fullName = user.displayName

                    dispatch({
                        type: 'AUTH_STATE_CHANGED',
                        payload: {
                            isAuthenticated: true,
                            user: {
                                id: user.uid,
                                email: user.email,
                                displayName: fullName,
                            },
                            platform: 'Firebase',
                        },
                    });
                } else {
                    dispatch({
                        type: 'AUTH_STATE_CHANGED',
                        payload: { isAuthenticated: false, user: null, platform: 'Firebase' },
                    });
                }
            });

            return () => unsubscribeFirebase();
        } else if (state.platform === 'NextAuth') {
            if (session?.user) {
                dispatch({
                    type: 'AUTH_STATE_CHANGED',
                    payload: {
                        isAuthenticated: true,
                        user: {
                            id: session.user,
                            email: session.user.email,
                            displayName: session.user.name || session.user.email,
                        },
                        platform: 'NextAuth',
                    },
                });
            } else {
                dispatch({
                    type: 'AUTH_STATE_CHANGED',
                    payload: { isAuthenticated: false, user: null, platform: 'NextAuth' },
                });
            }
        }
    }, [state.platform, session]);



    const loginWithProvider = async (provider: 'google' | 'github') => {
        if (state.platform === 'Firebase') {
            let providerInstance: any;
            switch (provider) {
                case 'google':
                    providerInstance = new firebase.auth.GoogleAuthProvider();
                    break;
                case 'github':
                    providerInstance = new firebase.auth.GithubAuthProvider();
                    break;
                default:
                    throw new Error('Provider not supported');
            }
            return firebase.auth().signInWithPopup(providerInstance);
        } else if (state.platform === 'NextAuth') { // This `else if` will now be correctly associated
            return signIn(provider);
        }
    };

    const getOAuthToken = async ({ username, password_val, mfaToken = null }: { username: string, password_val: string, mfaToken?: string | null }) => {
        const params = new URLSearchParams({
            grant_type: 'password',
            username,
            password: password_val,
            client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || "test_client_id",
            client_secret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET || "test_client_secret",
        });
        if (mfaToken) {
            params.append('mfa_token', mfaToken);
        }

        const resp = await fetch('/o/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error_description || 'OAuth error');

        storeTokens(data.access_token, data.refresh_token);
        return data; // Return full data, including refresh_token
    };


    const passwordStep = async (username: string, password_val: string) => {
        const resp = await fetch('/login/password/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: password_val }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.message || 'Login failed'); // Backend returns {ok: false, message: ...}
        return data; // { ok, mfa_required, mfa_challenge_id }
    };

    const mfaVerify = async (challengeId: string, totpCode: string) => {
        const resp = await fetch('/mfa/verify/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mfa_challenge_id: challengeId,
                totp_code: totpCode,
            }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.message || 'Invalid OTP');
        return data.mfa_token;
    };

    const mfaSetup = async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error("No access token found for MFA setup.");

        const resp = await fetch('/mfa/setup/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.message || 'Failed to get MFA setup info');
        return data; // { ok, otpauth_uri, secret, qrcode_data_url }
    };

    const mfaConfirm = async (code: string) => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error("No access token found for MFA confirmation.");

        const resp = await fetch('/mfa/confirm/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.message || 'Invalid code');
        return data;
    };


    const signup = async (email: string, password: string, userName: string) => {
        if (state.platform === 'Firebase') {
            try {

                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;


                if (user) {
                    await user.updateProfile({
                        displayName: userName,
                    });
                    await user.reload();

                }
            } catch (error: any) {
                console.error('Error signing up with Firebase:', error);
                throw new Error(error.message);
            }
        } else if (state.platform === 'NextAuth') {
            const resp = await fetch('/signup/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: userName, email, password }),
            });
            const data = await resp.json();
            if (!resp.ok) { // Check resp.ok first for HTTP errors
                throw new Error(data.message || 'Signup failed');
            }
            if (!data.ok) { // Check data.ok from backend's JSON response
                throw new Error(data.message || 'Signup failed');
            }
            return data; // returns user + mfa metadata
        }
        return null;
    };






    const signin = async (email: string, password: string) => {
        if (state.platform === 'Firebase') {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        } else if (state.platform === 'NextAuth') {
            // Step 1: Password verification
            const passwordStepResponse = await passwordStep(email, password);

            if (!passwordStepResponse.ok) {
                throw new Error(passwordStepResponse.message || 'Login failed');
            }

            let accessTokenData;
            if (passwordStepResponse.mfa_required) {
                // Return control to UI to prompt for OTP
                return { mfa_required: true, mfa_challenge_id: passwordStepResponse.mfa_challenge_id };
            } else {
                // No MFA required, directly get OAuth token
                accessTokenData = await getOAuthToken({ username: email, password_val: password });
            }

            // Establish NextAuth.js session with the obtained token
            // The credentials provider in route.js needs to handle this token
            const result = await signIn('credentials', {
                email,
                password, // NextAuth CredentialsProvider might still expect these for validation
                accessToken: accessTokenData.access_token,
                redirect: false, // Prevent NextAuth.js from redirecting immediately
            });

            if (result?.error) {
                throw new Error(result.error);
            }
            return result;
        }
        return null;
    };

    const logout = async () => {
        if (state.platform === 'Firebase') {
            await firebase.auth().signOut();
        } else if (state.platform === 'NextAuth') {
            clearTokens(); // Clear tokens from localStorage
            await signOut();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                setPlatform,
                loginWithProvider,
                signup,
                passwordStep,
                mfaVerify,
                getOAuthToken, // Renamed from fetchAccessToken
                mfaSetup,
                mfaConfirm,
                signin,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
