import { Badge } from "@/components/ui/badge";

const technologies = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
  backend: ["Next.js API Routes", "Supabase Auth"],
  database: ["Supabase (PostgreSQL)", "Prisma ORM"],
  deployment: ["Vercel"],
};

export default function TechStack() {
  return (
    <section
      id="tech"
      className="border-b border-border bg-muted/30 px-4 py-20"
    >
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Built With Modern Tech
          </h2>
        </div>

        <div className="mx-auto max-w-6xl space-y-8">
          {Object.entries(technologies).map(([category, techs]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {techs.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm font-medium"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
