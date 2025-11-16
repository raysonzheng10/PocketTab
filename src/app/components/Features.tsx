import { Users, Receipt, User, Smartphone, Lock, Repeat } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Users,
    title: "Group Management",
    description:
      "Create groups for any shared expenses. Invite members and track everything in one place.",
  },
  {
    icon: Receipt,
    title: "Expense Tracking",
    description:
      "Log expenses quickly and split costs evenly or customize who pays what.",
  },
  {
    icon: Repeat,
    title: "Recurring Expenses",
    description:
      "Keeps daily, weekly, or monthly expenses updated with no manual input.",
  },

  {
    icon: User,
    title: "Personalized View",
    description:
      "Shows only what you owe and what you're owed without group-level noise.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description:
      "Responsive interfaces that works on desktop, tablet, and mobile devices.",
  },
  {
    icon: Lock,
    title: "Secure & Effortless",
    description:
      "Eliminates passwords entirely using simple, secure email-based verification.",
  },
];

export default function Features() {
  return (
    <div id="features" className="border-b border-border px-4 py-20">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Key Features
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            {
              "Features that focus on what's most useful for managing your group expenses"
            }
          </p>
        </div>

        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
