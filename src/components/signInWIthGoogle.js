import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";

function SignInWithGoogle() {
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: user.displayName,
          photo: user.photoURL,
          lastName: "",
        });
        toast.success("User logged in Successfully", {
          position: "top-center",
        });
        window.location.href = "/profile";
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      let errorMessage = "Error during sign-in. Please try again.";
      if (error.message) {
        try {
          const response = await fetch(error.message);
          if (response.headers.get("content-type")?.includes("application/json")) {
            const parsedError = await response.json();
            errorMessage = parsedError.error || errorMessage;
          } else {
            errorMessage = await response.text();
          }
        } catch (e) {
          if (error.message.includes("Unauthorized")) {
            errorMessage = "Unauthorized access. Please try again.";
          }
        }
      }
      toast.error(errorMessage, {
        position: "bottom-center",
      });
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
