import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function SignInWithGoogle() {
  const navigate = useNavigate();

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log("Initiating sign-in with popup");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        console.log("User signed in", user);
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: user.displayName,
          photo: user.photoURL,
          lastName: "",
        });
        console.log("User data saved to Firestore");
        toast.success("User logged in successfully", {
          position: "top-center",
        });
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Sign-in popup was closed. Please try again.", {
          position: "bottom-center",
        });
      } else {
        toast.error("Error during sign-in. Please try again.", {
          position: "bottom-center",
        });
      }
    }
  };

  return (
    <div>
      <p className="continue-p">--Or continue with--</p>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={googleLogin}
      >
        <img src={require("../google.png")} width={"60%"} alt="Sign in with Google" />
      </div>
    </div>
  );
}

export default SignInWithGoogle;
