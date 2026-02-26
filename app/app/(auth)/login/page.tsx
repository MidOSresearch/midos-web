import AuthForm from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-penguin-bg">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <a href="https://midos.dev" className="inline-block">
            <h1 className="text-2xl font-bold text-white hover:text-midos-400 transition">MidOS</h1>
          </a>
          <p className="mt-1 text-sm text-gray-400">
            Sign in or create your account
          </p>
        </div>

        <div className="rounded-lg border border-penguin-border bg-penguin-surface p-6 shadow-sm">
          <AuthForm />
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          <a href="https://midos.dev" className="hover:text-gray-300 transition">
            &larr; Back to midos.dev
          </a>
        </p>
      </div>
    </div>
  );
}
