import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check } from "lucide-react";

export default function Auth({ mode }) {
  const su = mode === "signup";
  const navigate = useNavigate();

  const [f, setF] = useState({
    name: "",
    email: "",
    pw: "",
    rem: false,
  });

  const [show, setShow] = useState(false);
  const [t, setT] = useState({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState("");

  // Frontend form validation
  const e = {};

  if (su && f.name.trim().length < 2) {
    e.name = "Enter your full name.";
  }

  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(f.email.trim())) {
  e.email = "Only Gmail addresses are allowed (example@gmail.com).";
}

  if (f.pw.length < 6) {
  e.pw = "Use at least 6 characters.";
}

  // Handle input changes
  const ch = (k) => (event) => {
    const { type, checked, value } = event.target;

    setF((prev) => ({
      ...prev,
      [k]: type === "checkbox" ? checked : value,
    }));

    setApiError("");
  };

  // REAL SIGNUP / LOGIN API
  const sub = async (event) => {
    event.preventDefault();

    setT({
      name: true,
      email: true,
      pw: true,
    });

    setApiError("");

    // Stop if frontend validation fails
    if (Object.keys(e).length > 0) {
      return;
    }

    setBusy(true);

    try {
      const endpoint = su
        ? "http://localhost:5000/api/auth/signup"
        : "http://localhost:5000/api/auth/login";

      const payload = su
        ? {
            name: f.name.trim(),
            email: f.email.trim().toLowerCase(),
            password: f.pw,
          }
        : {
            email: f.email.trim().toLowerCase(),
            password: f.pw,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      // Show errors returned by the backend
      if (!response.ok) {
        setApiError(
          data.message || "Something went wrong. Please try again."
        );
        return;
      }

      if (su)
    {
        setDone(true);
    } 
    else 
        
    {
  // Save the authentication token and user details
  localStorage.setItem("cs_token", data.token);
  localStorage.setItem("cs_user", JSON.stringify(data.user));

  // Open the home page
  navigate("/home");
    }
    } catch (error) {
      console.error("Authentication error:", error);

      setApiError(
        "Cannot connect to backend. Please check whether the server is running."
      );
    } finally {
      setBusy(false);
    }
  };

  // Reusable input field
  const Fld = ({ k, label, type = "text" }) => (
    <div>
      <label htmlFor={k} className="text-xs text-slate-400">
        {label}
      </label>

      <div className="relative">
        <input
          id={k}
          type={k === "pw" && show ? "text" : type}
          value={f[k]}
          onChange={ch(k)}
          onBlur={() =>
            setT((prev) => ({
              ...prev,
              [k]: true,
            }))
          }
          aria-invalid={Boolean(t[k] && e[k])}
          className={`field mt-1 ${
            t[k] && e[k] ? "!border-red-400" : ""
          }`}
        />

        {k === "pw" && (
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-3 top-4 text-slate-400"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {t[k] && e[k] && (
        <p role="alert" className="text-xs text-red-400 mt-1">
          {e[k]}
        </p>
      )}
    </div>
  );

  return (
    <section className="grid md:grid-cols-2 items-center gap-10 min-h-[80vh]">
      {/* Left-side introduction */}
      <div>
        <h1 className="font-display text-4xl">
          {su ? (
            <>
              Join the Cinema{" "}
              <span className="text-pink">Community</span>
            </>
          ) : (
            <>
              Welcome <span className="text-pink">Back</span>
            </>
          )}
        </h1>

        <p className="mt-4 text-slate-400">
          {su
            ? "Create an account and start your journey."
            : "Sign in to continue your cinema journey."}
        </p>
      </div>

      {/* Authentication card */}
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="glass p-6 md:p-8 max-w-md w-full justify-self-center md:justify-self-end"
      >
        <AnimatePresence mode="wait">
          {done ? (
            /* Successful signup screen */
            <motion.div
              key="ok"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6"
              role="status"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="mx-auto w-16 h-16 rounded-full border border-pink grid place-items-center shadow-[0_0_30px_#ff6b8a88]"
              >
                <Check className="text-pink" />
              </motion.div>

              {[...Array(14)].map((_, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(i) * 90,
                    y: Math.sin(i) * 90 - 60,
                    opacity: 0,
                  }}
                  transition={{ duration: 1.2 }}
                  className="absolute left-1/2 top-24 w-1.5 h-1.5 rounded-full bg-pink"
                />
              ))}

              <h2 className="mt-5 text-xl">Account created!</h2>

              <p className="text-slate-400 text-sm">
                Your account has been saved successfully.
              </p>

              <Link to="/discover" className="btn inline-block mt-6">
                START EXPLORING
              </Link>

              <p className="text-slate-400 text-sm mt-4">
                Already registered?{" "}
                <Link to="/login" className="text-pink underline">
                  Sign in
                </Link>
              </p>
            </motion.div>
          ) : (
            /* Signup and login form */
            <motion.form
              key="f"
              onSubmit={sub}
              noValidate
              className="space-y-4"
            >
              {/* Form tabs */}
              <div className="flex border-b border-white/10 text-sm">
                <Link
                  to="/login"
                  className={`flex-1 pb-2 text-center ${
                    !su
                      ? "text-white border-b border-pink"
                      : "text-slate-500"
                  }`}
                >
                  Sign in
                </Link>

                <Link
                  to="/signup"
                  className={`flex-1 pb-2 text-center ${
                    su
                      ? "text-white border-b border-pink"
                      : "text-slate-500"
                  }`}
                >
                  Sign up
                </Link>
              </div>

              {/* Backend error message */}
              {apiError && (
                <p
                  role="alert"
                  className="text-sm text-red-400 border border-red-400/30 rounded-lg p-3"
                >
                  {apiError}
                </p>
              )}

              {/* Input fields */}
              {su && Fld({ k: "name", label: "Full name" })}

              {Fld({
                k: "email",
                label: "Email",
                type: "email",
              })}

              {Fld({
                k: "pw",
                label: "Password",
                type: "password",
              })}

              {/* Login-only options */}
              {!su && (
                <div className="flex justify-between text-xs">
                  <label className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={f.rem}
                      onChange={ch("rem")}
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Password reset is not implemented yet."
                      )
                    }
                    className="text-slate-400 underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={busy}
                className="btn w-full active:scale-95 disabled:opacity-60"
              >
                {busy
                  ? "Please wait..."
                  : su
                  ? "CREATE ACCOUNT"
                  : "SIGN IN"}
              </button>

              {/* Social login placeholders */}
              <div className="grid grid-cols-3 gap-2">
                {["Google", "Apple", "Discord"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      alert(
                        "Social login has not been connected yet."
                      )
                    }
                    className="btn2 !px-2"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}