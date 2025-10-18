import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, TrendingUp, Wallet, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Merchant = () => {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const totalAmount = payments.reduce((sum, payment) => sum + parseFloat(String(payment.amount || 0)), 0);
  const completedCount = payments.filter(payment => payment.status === "completed").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Merchant Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your transactions and earnings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Received
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                {payments.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Transaction
              </CardTitle>
              <Wallet className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${payments.length > 0 ? (totalAmount / payments.length).toFixed(2) : '0.00'}
              </div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                Per payment
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Transactions
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {payments.length} total transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>All your payment transactions in one place</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">Loading payments...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">No payments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Card Details</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium font-mono text-xs">
                          {payment.transaction_id || payment.id.slice(0, 8)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(payment.created_at), 'yyyy-MM-dd HH:mm')}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{payment.profiles?.full_name || 'N/A'}</div>
                            <div className="text-xs text-muted-foreground">{payment.profiles?.email || ''}</div>
                          </div>
                        </TableCell>
                        <TableCell>{payment.payment_method || 'N/A'}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {payment.currency === 'USD' ? '$' : ''}
                          {parseFloat(String(payment.amount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          {payment.card_number_last4 ? (
                            <div className="text-xs">
                              <div className="font-mono">**** {payment.card_number_last4}</div>
                              <div className="text-muted-foreground">{payment.card_holder_name}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {payment.description || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={payment.status === "completed" ? "default" : "secondary"}
                            className={payment.status === "completed" ? "bg-green-600" : ""}
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Merchant;
