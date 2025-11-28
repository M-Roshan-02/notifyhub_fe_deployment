
"use client"
import { Alert, Button, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import React, { useContext, useState } from "react";
import AuthContext from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image"; // Import Image component for QR code
// import QRCode from 'qrcode'; // If we need to render QR code from otpauth_uri

const AuthRegister = () => {

  const [email, setEmail] = useState("");
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [signupResponse, setSignupResponse] = useState(null); // New state for signup response
  const [otpCode, setOtpCode] = useState(""); // New state for OTP input

  const router = useRouter();
  const { signup, confirmMfa }: any = useContext(AuthContext); // Destructure confirmMfa

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const resp = await signup(email, password, userName);
      if (resp?.mfa?.qrcode_data_url || resp?.mfa?.otpauth_uri) { // Check for either QR code data or otpauth_uri
        setSignupResponse(resp); // Store response if MFA is required
      } else {
        router.push("/auth/auth1/login"); // Redirect if no MFA or already confirmed
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMfaConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signupResponse || !signupResponse.user?.accessToken) {
      setError("Signup response or access token missing.");
      return;
    }

    try {
      await confirmMfa(otpCode, signupResponse.user.accessToken);
      router.push("/auth/auth1/login"); // Redirect to login after successful MFA confirmation
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

      {signupResponse && (signupResponse.mfa?.qrcode_data_url || signupResponse.mfa?.otpauth_uri) ? (
        // MFA Setup Form
        <form className="mt-6" onSubmit={handleMfaConfirm}>
          <h4 className="text-xl font-bold mb-4">Setup Two-Factor Authentication</h4>
          <p className="text-sm mb-4">Scan the QR code with your authenticator app.</p>
          {signupResponse.mfa?.qrcode_data_url ? (
            <div className="flex justify-center mb-4">
              <Image src={signupResponse.mfa.qrcode_data_url} alt="MFA QR Code" width={200} height={200} />
            </div>
          ) : signupResponse.mfa?.otpauth_uri ? (
            <p className="text-sm text-center mb-4">
                Alternatively, enter this key manually: <strong>{signupResponse.mfa.otpauth_uri}</strong>
                {/* Fallback for rendering QR code if `qrcode_data_url` is not available */}
                {/* <canvas id="mfa-qr-canvas"></canvas> */}
            </p>
          ) : null}

          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="otp" value="Verification Code" className="font-semibold" />
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
          <Button color={'primary'} type="submit" className="w-full rounded-md">Confirm MFA</Button>
        </form>
      ) : (
        // Regular Registration Form
        <form className="mt-6" onSubmit={handleRegister}>
          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="email" value="Name" className="font-semibold" />
            </div>
            <TextInput
              id="name"
              type="text"
              sizing="md"
              className="form-control"
              value={userName}
              onChange={(e) => setuserName(e.target.value)}

            />
          </div>
          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="emadd" value="Email Address" className="font-semibold" />
            </div>
            <TextInput
              id="emadd"
              type="text"
              sizing="md"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}

            />
          </div>
          <div className="mb-6">
            <div className="mb-2 block">
              <Label htmlFor="userpwd" value="Password" className="font-semibold" />
            </div>
            <TextInput
              id="userpwd"
              type="password"
              sizing="md"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}

            />
          </div>
          <Button color={'primary'} type="submit" className="w-full rounded-md">Sign Up</Button>
        </form>
      )}
    </>
  )
}

export default AuthRegister

