import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/loginHooks/useRegister";

const registerSchema = z.object({
  displayName: z
    .string()
    .max(30, { message: "Name cannot exceed 30 characters" })
    .nonempty({ message: "Name is required" }),
  username: z
    .string()
    .max(30, { message: "Username cannot exceed 30 characters" })
    .nonempty({ message: "Username is required" }),
  email: z.string().email({ message: "Invalid email address" }).nonempty({ message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    })
    .nonempty({ message: "Password is required" }),
  contact: z
    .string()
    .regex(/^\d{11,}$/, { message: "Contact must contain only numbers and be at least 11 digits long." })
    .max(30, { message: "Contact cannot exceed 30 characters." })
    .nonempty({ message: "Contact is required." }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { mutate: register, error } = useRegister();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      register(data);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <section className="flex flex-col md:flex-row bg-yellow-400 min-h-screen">
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
        <div className="w-full rounded-lg shadow dark:border sm:max-w-md xl:p-0 bg-slate-50">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {error && <p className="text-red-600">{error.message}</p>}
              {Object.values(errors).length > 0 && (
                <p className="text-red-600">Please fix the highlighted errors.</p>
              )}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                  <input
                    {...formRegister("displayName")}
                    className="border border-gray-900 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Bob"
                  />
                  {errors.displayName && <p className="text-red-500">{errors.displayName.message}</p>}
                </div>
                <div className="w-1/2">
                  <label className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                  <input
                    {...formRegister("username")}
                    className="border border-gray-900 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Bob"
                  />
                  {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                  <input
                    {...formRegister("email")}
                    className="border border-gray-900 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                  />
                  {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
                <div className="w-1/2">
                  <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                  <input
                    {...formRegister("password")}
                    type="password"
                    className="border border-gray-900 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Contact</label>
                <input
                  {...formRegister("contact")}
                  className="border border-gray-900 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.contact && <p className="text-red-500">{errors.contact.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full text-gray-900 bg-yellow-400 transition duration-300 ease-in hover:bg-yellow-300 hover:text-gray-950 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Create an account
              </button>
              <p className="text-sm font-light text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:underline">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 items-center justify-center">
        <img src="/bulldozer-2.png" alt="Register Animation" className="max-w-full h-auto" />
      </div>
    </section>
  );
};

export default Register;
