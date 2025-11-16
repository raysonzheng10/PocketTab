import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border px-4 py-12">
      <div className="container mx-auto">
        <div className="flex flex-col mx-auto max-w-6xl gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xl font-semibold">PocketTab</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A personal project built by Rayson
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Connect</h3>
            <div className="flex gap-3">
              <Link
                href="https://github.com/raysonzheng10"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/rayson-zheng/"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="mailto:raysonzheng10@gmail.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
