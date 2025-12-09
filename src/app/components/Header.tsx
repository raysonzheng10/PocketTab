import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const navigateToDemo = () => {
    router.push("/demo");
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 20; // adjust if
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex flex-row gap-8">
          <span
            className="text-xl font-semibold cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            PocketTab
          </span>

          <div className="ml-auto mr-auto hidden items-center gap-6 sm:flex">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("tech")}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              Tech Stack
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={navigateToLogin}>
            Log in
          </Button>
          <Button onClick={navigateToDemo}>Try Demo</Button>
        </div>
      </div>
    </header>
  );
}
