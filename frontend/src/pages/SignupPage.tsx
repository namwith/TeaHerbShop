import { SignupForm } from "@/components/signup-form";
export default function SignupPage() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center bg-cover bg-muted p-6 md:p-10"
      style={{
        backgroundImage: "url('./src/assets/TeaField.jpg')",
      }}
    >
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  );
}
