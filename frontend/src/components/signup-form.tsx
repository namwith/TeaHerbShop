import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { useState } from "react";
import { register as registerApi } from "@/services/authService";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await registerApi({
        username,
        password,
        fullName,
        phone: Number(phone),
        address,
      });

      toast.success("Signup success!");
      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Signup fail!");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your information below to create your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input
                  id="phone"
                  type="number"
                  placeholder="0123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Main St"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Field>
              <Field className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Field>
              </Field>
              <Field>
                <Button type="submit">Create Account</Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>{" "}
              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Sign up with Apple</span>
                </Button>
                <Button variant="outline" type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.6 20.5H42V20H24v8h11.3A11.9 11.9 0 0112 24 12 12 0 0136 15l5.7-5.7A19.9 19.9 0 0024 4 20 20 0 1044 24c0-1.2-.1-2.2-.4-3.5z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.3 14.7A20 20 0 0124 4v8a11.9 11.9 0 00-12 12c0 2.6.8 5 2.3 7l-6 6A20 20 0 014 24c0-3.4.8-6.6 2.3-9.3z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44a20 20 0 0013.9-5.5l-6-6A11.9 11.9 0 0112 24H4a20 20 0 0020 20z"
                    />
                    <path
                      fill="#1976D2"
                      d="M44 24c0-1.2-.1-2.2-.4-3.5H24v8h11.3a12 12 0 01-4.2 6.1l6 6A20 20 0 0044 24z"
                    />
                  </svg>

                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button variant="outline" type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="#0866FF"
                      d="M178.3 32c-37.5 0-56.7 33.1-69.2 55.4C96.6 65.1 80 32 48.7 32 16.1 32 0 61.9 0 104.3 0 177.5 48.9 224 88.7 224c24.2 0 40.3-15.5 54.3-38.2C160.5 208.5 176.6 224 200.7 224 240.6 224 256 177.5 256 104.3 256 61.7 239.5 32 206.9 32c-22.7 0-40.1 13.7-54.5 35.8C139 45.4 123.8 32 98.7 32zM88.7 200c-25 0-56-35.4-56-95.7 0-27.2 11.1-47.3 28-47.3 22.4 0 39.1 31.6 49.5 52-12.2 22.9-28.9 91-21.5 91zm112 0c7.4 0-9.3-68.1-21.5-91 10.4-20.4 27.1-52 49.5-52 16.9 0 28 20.1 28 47.3 0 60.3-31 95.7-56 95.7z"
                    />
                  </svg>

                  <span className="sr-only">Login with Meta</span>
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link to="/" className="text-blue-500 hover:underline">
                  Sign in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="./src/assets/Banner.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-white">
        By clicking continue, you agree to our{" "}
        <a className="cursor-pointer">Terms of Service</a> and{" "}
        <a className="cursor-pointer">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
