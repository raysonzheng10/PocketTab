"use client";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AllTransactionsTable from "./components/AllTransactionsTable";
import { Card, CardContent } from "@/components/ui/card";

function PageContent() {
  return (
    <div className="h-screen overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="shadow-sm  overflow-auto">
          <CardContent className="pt-0 space-y-3 ">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl lg:text-3xl font-bold">Transactions</h1>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="recurring">
                  Recurring Transactions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <AllTransactionsTable />
              </TabsContent>
              <TabsContent value="recurring"></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <PageContent />
    </Suspense>
  );
}
