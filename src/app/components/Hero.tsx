import { Button } from "@/components/ui/button";
import { ArrowRight, Code2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const navigateToDemo = () => {
    router.push("/demo");
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-accent/20 px-4 py-20 lg:py-28 xl:py-42">
      <div className="mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
            <Code2 className="size-4 text-primary" />
            <span className="text-muted-foreground">
              A fullstack development showcase
            </span>
          </div>

          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Split Expenses, <span className="text-primary">Share Costs</span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            PocketTab is an expense sharing webapp built to demonstrate
            fullstack development. Track shared expenses, settle debts, and
            manage group finances effortlessly.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={navigateToDemo}
            >
              Try Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
              onClick={navigateToLogin}
            >
              Log In
            </Button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </div>
    </div>
  );
}
