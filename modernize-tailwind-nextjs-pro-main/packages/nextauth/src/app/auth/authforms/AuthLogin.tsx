"use client"

import { Icon } from "@iconify/react/dist/iconify.js";
import { Alert, Button, Checkbox, Label, TextInput } from "flowbite-react";
// import { signIn, useSession } from "next-auth/react"; // Keep signIn, remove useSession if not directly used here
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/app/context/AuthContext";


const AuthLogin = () => {

  const [email, setEmail] = useState<string>("demo1234@gmail.com");
  const [password, setPassword] = useState<string>("demo1234");
  const [error, setError] = useState<string>("");
  const [mfaRequired, setMfaRequired] = useState(false); // New state for MFA
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null); // New state for MFA challenge ID
  const [otpCode, setOtpCode] = useState<string>(""); // New state for OTP input

  const router = useRouter();
  // Destructure new functions from AuthContext
  const { signin, passwordStep, verifyTotp, fetchAccessToken }: any = useContext(AuthContext);


  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const passwordStepResponse = await passwordStep(email, password); // Use email as username for Django backend

      if (!passwordStepResponse.ok) {
        throw new Error(passwordStepResponse.message || 'Login failed');
      }

      if (passwordStepResponse.mfa_required) {
        setMfaRequired(true);
        setMfaChallengeId(passwordStepResponse.mfa_challenge_id);
      } else {
        // No MFA required, directly fetch access token
        const authData = await fetchAccessToken({ username: email, password_val: password });
        // Use the access token to sign in with NextAuth.js CredentialsProvider
        // The CredentialsProvider should then validate this token or handle session setup
        const result = await signIn('credentials', {
          email,
          password,
          accessToken: authData.access_token, // Pass token to CredentialsProvider
          redirect: false, // Prevent NextAuth.js from redirecting
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        router.push("/"); // Redirect after successful login
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!mfaChallengeId) {
      setError("MFA challenge ID is missing.");
      return;
    }

    try {
      const mfaToken = await verifyTotp(mfaChallengeId, otpCode);
      
      // Now use the mfaToken to get the access token
      const authData = await fetchAccessToken({ username: email, password_val: password, mfaToken });

      // Use the access token to sign in with NextAuth.js CredentialsProvider
      const result = await signIn('credentials', {
        email,
        password,
        accessToken: authData.access_token, // Pass token to CredentialsProvider
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/"); // Redirect after successful login
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      {error ? (
        <div className="mt-4">
          <Alert
            color={"lighterror"}
            icon={() => (
              <Icon
                icon="solar:info-circle-outline"
                className="me-3"
                height={20}
              />
            )}
          >
            {error}
          </Alert>
        </div>
      ) : (
        ""
      )}

      {mfaRequired ? (
        // OTP Input Form
        <form className="mt-6" onSubmit={handleOtpSubmit}>
          <h4 className="text-xl font-bold mb-4">Two-Factor Authentication</h4>
          <p className="text-sm mb-4">Please enter the 6-digit code from your authenticator app.</p>
          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="otp" value="Verification Code" />
            </div>
            <TextInput
              id="otp"
              type="text"
              sizing="md"
              className="form-control"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter 6-digit code"
            />
          </div>
          <Button color={"primary"} type="submit" className="bg-primary hover:bg-primaryemphasis text-white rounded-md w-full">
            Verify OTP
          </Button>
        </form>
      ) : (
        // Regular Login Form
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="Email" value="email" />
            </div>
            <TextInput
              id="Email"
              type="text"
              sizing="md"
              value={email}
              className={`form-control ${error !== "" ? 'border border-error rounded-md' : ''}`}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="userpwd" value="Password" />
            </div>
            <TextInput
              id="userpwd"
              type="password"
              sizing="md"
              className={`form-control ${error !== "" ? 'border border-error rounded-md' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between my-5">
            <div className="flex items-center gap-2">
              <Checkbox color="primary" id="accept" className="checkbox" />
              <Label
                htmlFor="accept"
                className=" font-normal cursor-pointer"
              >
                Remeber this Device
              </Label>
            </div>
            <Link href={"/auth/auth1/forgot-password"} className="text-primary text-sm font-medium">
              Forgot Password ?
            </Link>
          </div>
          <Button color={"primary"} type="submit" className="bg-primary hover:bg-primaryemphasis text-white rounded-md w-full">
            Sign in
          </Button>
        </form>
      )}
    </>
  );
};
export default AuthLogin;
