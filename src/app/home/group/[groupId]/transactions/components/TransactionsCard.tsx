import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import AllTransactionsTable from "./AllTransactionsTable";
import RecurringTransactionsTable from "./RecurringTransactionsTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TransactionsCardProps {
  setIsCreateTransactionModalOpen: (open: boolean) => void;
}

export default function TransactionsCard({
  setIsCreateTransactionModalOpen,
}: TransactionsCardProps) {
  return (
    <Card className="shadow-sm overflow-auto">
      <CardContent className="pt-0 space-y-3">
        {/* Header  */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl lg:text-3xl font-bold">Transactions</h1>
          <Button
            size={"sm"}
            onClick={() => setIsCreateTransactionModalOpen(true)}
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Actual Tab Content */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 w-full flex overflow-hidden">
            <TabsTrigger value="all" className="flex-1 truncate text-ellipsis">
              <span className="hidden sm:inline">All Transactions</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger
              value="recurring"
              className="flex-1 truncate text-ellipsis"
            >
              <span className="hidden sm:inline">Recurring Transactions</span>
              <span className="sm:hidden">Recurring</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <AllTransactionsTable />
          </TabsContent>
          <TabsContent value="recurring">
            <RecurringTransactionsTable />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
