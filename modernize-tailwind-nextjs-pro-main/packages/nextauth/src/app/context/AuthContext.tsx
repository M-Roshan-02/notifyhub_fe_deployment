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
    confirmMfa: () => Promise.resolve(),
    passwordStep: () => Promise.resolve(), // Add passwordStep here
    verifyTotp: () => Promise.resolve(),   // Add verifyTotp here
    fetchAccessToken: () => Promise.resolve(), // Add fetchAccessToken here
    signin: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    setPlatform: () => { },
    loginWithProvider: () => Promise.resolve(),
    loginWithSupabase: () => Promise.resolve(),
});

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

        else if (state.platform === 'NextAuth') {
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
        // } else if (state.platform === 'Supabase') {
        //     return supabase.auth.signInWithOAuth({
        //         provider,
        //         options: {
        //             redirectTo: `${window.location.origin}/auth/callback`,
        //         },
        //     });
        // }
        else if (state.platform === 'NextAuth') {
            return signIn(provider);
        }
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

        // else if (state.platform === 'Supabase') {
        //
        //
        //     try {
        //         const { user, error }: any = await supabase.auth.signUp({
        //             email,
        //             password,
        //             options: {
        //                 data: { full_name: userName },
        //             },
        //         });
        //
        //         if (error) {
        //             throw error;
        //         }
        //
        //         console.log('User registered successfully, confirmation email sent');
        //     } catch (error: any) {
        //         console.error('Error signing up with Supabase:', error);
        //         throw new Error(error.message);
        //     }
        // }
        } else if (state.platform === 'NextAuth') {
            const resp = await fetch('/app/signup/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, username: userName }),
            });
            if (!resp.ok) {
                const errorData = await resp.json();
                throw new Error(errorData.message || 'Signup failed');
            }
            return resp.json(); // contains user + mfa metadata
        }
        return null;
    };

    const confirmMfa = async (code: string, accessToken: string) => {
        const resp = await fetch('/app/mfa/confirm/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
        const data = await resp.json();
        if (!data.ok) throw new Error(data.message || 'Invalid code');
        return data;
    };


    const passwordStep = async (username: string, password_val: string) => { // Renamed 'password' to 'password_val' to avoid conflict
        const resp = await fetch('/app/login/password/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: password_val }),
        });
        return resp.json(); // { ok, mfa_required, mfa_challenge_id }
    };

    const verifyTotp = async (challengeId: string, totpCode: string) => {
        const resp = await fetch('/app/mfa/verify/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mfa_challenge_id: challengeId,
                totp_code: totpCode,
            }),
        });
        const data = await resp.json(); // { ok, mfa_token }
        if (!data.ok) throw new Error(data.message || 'Invalid OTP');
        return data.mfa_token;
    };

    const fetchAccessToken = async ({ username, password_val, mfaToken }: { username: string, password_val: string, mfaToken?: string }) => {
        const params = new URLSearchParams({
            grant_type: 'password',
            username,
            password: password_val,
            client_id: "CLIENT_ID_PLACEHOLDER", // Replace with actual client_id if available
            client_secret: "CLIENT_SECRET_PLACEHOLDER", // Replace with actual client_secret if available
        });
        if (mfaToken) params.append('mfa_token', mfaToken);

        const resp = await fetch('/o/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });
        const data = await resp.json(); // { access_token, refresh_token, ... }
        if (!resp.ok) throw new Error(data.error_description || 'OAuth error');
        return data;
    };

    const signin = async (email: string, password: string) => {
        if (state.platform === 'Firebase') {
            return firebase.auth().signInWithEmailAndPassword(email, password);
            // } else if (state.platform === 'Supabase') {
            //     try {
            //         const { error } = await supabase.auth.signInWithPassword({
            //             email,
            //             password,
            //         });
            //         console.log(error);
            //         if (error) throw error;
            //
            //     } catch (error: any) {
            //         throw new Error(error.message);
            //     }
            // }        else if (state.platform === 'NextAuth') {
            return signIn('credentials', { email, password });
        }
        return null;
    };

    const logout = async () => {
        if (state.platform === 'Firebase') {
            await firebase.auth().signOut();
        // else if (state.platform === 'Supabase') {
        //     await supabase.auth.signOut();
        // }
        else if (state.platform === 'NextAuth') {
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
                confirmMfa,
                passwordStep, // Add passwordStep here
                verifyTotp,   // Add verifyTotp here
                fetchAccessToken, // Add fetchAccessToken here
                signin,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
