import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useResetPassword } from "../../hooks/loginHooks/useLogin";
import { Alert, Backdrop, CircularProgress, Modal, Typography } from "@mui/material";

const forgotPassword = () => {
  const [formData, setFormData] = useState({
    email: localStorage.getItem("email") || "",
    token: "",
    newPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const navigate = useNavigate();
  const targetEmail = localStorage.getItem("email");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await resetPassword(formData);
      localStorage.removeItem("email");
      setSuccessModal(true);
      navigate("/");
    } catch (error) {
      setErrorMessage("Reset password failed. Please check your credentials.");
    }
  };

  return (
    <section className="h-screen flex bg-yellow-400">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-8">
        <div className="w-full rounded-lg shadow dark:border sm:max-w-md xl:p-0 bg-slate-50">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Reset Password
            </h1>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={targetEmail || ""}
                  className="border border-gray-900 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  readOnly
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">OTP</label>
                <input
                  type="text"
                  name="token"
                  id="token"
                  onChange={handleChange}
                  className="border border-gray-900 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="*****"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="border border-gray-900 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-gray-900 bg-yellow-400 transition duration-300 ease-in hover:bg-yellow-300 hover:text-gray-950 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={isPending}
              >
                {isPending ? <CircularProgress size="16px" color="inherit" /> : "Reset Password"}
              </button>
              <p className="text-sm font-light text-gray-500">
                Changing mind ?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:underline">
                  Back to Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 items-center justify-center">
        <img src="/reset-image.png" alt="Login Animation" className="max-w-full h-auto" />
      </div>
      {successModal && (
        <Modal
          open={successModal}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <div>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default forgotPassword;
