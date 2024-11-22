import { Alert, AlertTitle, CircularProgress, Collapse, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { ChangeEvent, FormEvent, useState } from "react";
import { useOtp } from "../../hooks/loginHooks/useLogin";

const otp = () => {
  const [open, setOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const navigate = useNavigate();
  const { mutateAsync: sendOtp, isPending } = useOtp();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await sendOtp(formData);
      localStorage.setItem("email", data);

      navigate("/reset-password");
    } catch (error) {
      setErrorMessage("Cannot send OTP. Please check your credentials.");
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
            <Collapse in={open}>
              <Alert
                severity="info"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                Please insert your Email to receive an OTP code!
              </Alert>
            </Collapse>
            {errorMessage && (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {errorMessage}
              </Alert>
            )}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-900 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-gray-900 bg-yellow-400 transition duration-300 ease-in hover:bg-yellow-300 hover:text-gray-950 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={isPending}
              >
                {isPending ? <CircularProgress size="16px" color="inherit" /> : "Send OTP"}
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
        <img src="/forgot-mechanic.png" alt="Login Animation" className="max-w-full h-auto" />
      </div>
    </section>
  );
};

export default otp;
