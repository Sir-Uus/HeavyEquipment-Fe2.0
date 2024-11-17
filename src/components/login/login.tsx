import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLogin } from "../../hooks/loginHooks/useLogin";
import { CircularProgress } from "@mui/material";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { useFacebookLogin } from "../../hooks/facebookLoginHooks";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "../../hooks/googleLoginHooks";

library.add(faFacebook);

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { mutateAsync: login, isPending } = useLogin();
  const location = useLocation();
  const [sessionExpired, setSessionExpired] = useState(false);
  const { mutate: loginWithFacebook, isPending: facebookPending } = useFacebookLogin();
  const { mutate: googleLogin } = useGoogleLogin();

  useEffect(() => {
    if (new URLSearchParams(location.search).get("sessionExpired")) {
      setSessionExpired(true);
    }
  }, [location]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await login(formData);
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("displayName", data.displayName);
        localStorage.setItem("id", data.id);
        window.location.replace("/");
      }
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  const handleFacebookLoginSuccess = (response: any) => {
    const { accessToken } = response;
    if (accessToken) {
      loginWithFacebook(accessToken);
    } else {
      console.error("Access token not found in response");
    }
  };

  const handleFacebookLoginFail = (response: any) => {
    console.error("Login failed!", response);
  };

  return (
    <section className="h-[92vh] md:h-screen flex justify-center flex-col md:flex-row bg-yellow-400">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-8">
        <div className="w-full rounded-lg shadow dark:border sm:max-w-md xl:p-0 bg-slate-50">
          <div className="p-6 space-y-2 sm:p-8">
            <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
              Log in to your account
            </h2>
            {sessionExpired ? (
              <p className="text-red-600">Your session has expired. Please log in again.</p>
            ) : errorMessage ? (
              <p className="text-red-600">{errorMessage}</p>
            ) : null}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-900 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="border border-gray-900 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                />
              </div>
              <div className="flex justify-end">
                <p className="text-sm font-light text-gray-500">
                  <Link to="/forgot-password" className="font-medium text-blue-600 hover:underline">
                    Forgot Password?
                  </Link>
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full text-gray-900 bg-yellow-400 transition duration-300 ease-in hover:bg-yellow-300 hover:text-gray-950 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  disabled={isPending}
                >
                  {isPending ? <CircularProgress size="16px" color="inherit" /> : "Sign in"}
                </button>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex-grow border-t border-gray-500"></div>
                <span className="px-4 text-gray-500">Or</span>
                <div className="flex-grow border-t border-gray-500"></div>
              </div>
              <div className="flex justify-center">
                <FacebookLogin
                  appId="560920773058158"
                  onSuccess={handleFacebookLoginSuccess}
                  onFail={handleFacebookLoginFail}
                  className="p-[10px] w-full border border-blue-700 rounded-md text-gray-900 text-sm font-medium transition duration-300 ease-in hover:border-blue-300 hover:bg-gray-100"
                >
                  {facebookPending ? (
                    <CircularProgress size="16px" color="inherit" />
                  ) : (
                    <span className="flex justify-between">
                      <FontAwesomeIcon
                        size="lg"
                        icon={faFacebook}
                        style={{ color: "#132efb", marginTop: "1px" }}
                      />
                      <span className="mr-[17%] md:mr-[23%]">Continue with Facebook</span>
                    </span>
                  )}
                </FacebookLogin>
              </div>
              <div className="w-full flex justify-center">
                <div className="w-full align-middle max-w-[330px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      const token = credentialResponse.credential;
                      if (token) {
                        googleLogin(token);
                      }
                    }}
                    onError={() => {
                      console.log("Google login failed");
                    }}
                    logo_alignment="left"
                    width="100%"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-light text-gray-500">
                  Don’t have an account yet?{" "}
                  <Link to="/register" className="font-medium text-blue-600 hover:underline">
                    Register here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right-Side Image (Hidden on Small Screens) */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center">
        <img src="/excavator-3.png" alt="Login Animation" className="max-w-full h-auto" />
      </div>
    </section>
  );
};

export default Login;
