import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Wallet, CheckCircle2, QrCode } from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const paymentSchema = z.object({
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be greater than 0",
  }),
  walletAddress: z.string().trim().min(10, "Please enter a valid wallet address"),
  upiId: z.string().trim().optional(),
});

const Payment = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to make payments");
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error("Please login to make payments");
      navigate("/auth");
      return;
    }

    try {
      const validatedData = paymentSchema.parse({
        amount,
        walletAddress,
        upiId,
      });

      setIsProcessing(true);

      // Calculate USDT amount
      const usdtAmount = parseFloat(validatedData.amount) / 83;

      // Save payment to database
      const { data, error } = await supabase
        .from("payments")
        .insert([
          {
            user_id: userId,
            amount: parseFloat(validatedData.amount),
            currency: "INR",
            payment_method: "UPI",
            status: "processing",
            description: `Payment of ₹${validatedData.amount} for ${usdtAmount.toFixed(2)} USDT to wallet ${validatedData.walletAddress}`,
            transaction_id: `TXN${Date.now()}`,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      // Simulate payment processing
      setTimeout(async () => {
        if (data && data[0]) {
          // Update payment status to completed
          const { error: updateError } = await supabase
            .from("payments")
            .update({ status: "completed" })
            .eq("id", data[0].id);

          if (updateError) {
            console.error("Error updating payment status:", updateError);
          }
        }

        setIsProcessing(false);
        setPaymentComplete(true);
        toast.success("Payment completed successfully!");

        // Reset after showing success
        setTimeout(() => {
          setPaymentComplete(false);
          setAmount("");
          setWalletAddress("");
          setUpiId("");
        }, 3000);
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Payment failed. Please try again.");
      }
    }
  };

  const usdtAmount = amount ? (parseFloat(amount) / 83).toFixed(2) : "0.00";

  if (!userId) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Make a Payment
            </h1>
            <p className="text-muted-foreground text-lg">
              Pay in INR, receive USDT instantly
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Payment Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (INR)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="1000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      min="1"
                    />
                  </div>

                  <Tabs defaultValue="upi-id" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upi-id">UPI ID</TabsTrigger>
                      <TabsTrigger value="qr-code">
                        <QrCode className="mr-2 h-4 w-4" />
                        QR Code
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upi-id" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          type="text"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter your UPI ID to complete the payment
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="qr-code" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
                          {amount ? (
                            <QRCode
                              value={`upi://pay?pa=merchant@upi&pn=CoinPort&am=${amount}&cu=INR&tn=Payment`}
                              size={200}
                              className="border-4 border-background p-2"
                            />
                          ) : (
                            <div className="w-[200px] h-[200px] flex items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded">
                              <p className="text-sm text-muted-foreground text-center">
                                Enter amount to generate QR code
                              </p>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Scan this QR code with any UPI app to pay
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="space-y-2">
                    <Label htmlFor="wallet">Wallet Address (USDT)</Label>
                    <Input
                      id="wallet"
                      type="text"
                      placeholder="0x..."
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your crypto wallet address to receive USDT
                    </p>
                  </div>

                  {!paymentComplete ? (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        "Processing..."
                      ) : (
                        <>
                          Pay with UPI <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-green-600 font-semibold py-3">
                      <CheckCircle2 className="h-5 w-5" />
                      Payment Successful!
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <div className="space-y-6">
              <Card className="shadow-lg border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    Payment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-muted-foreground">Amount in INR</span>
                    <span className="font-semibold text-lg">₹{amount || "0"}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-muted-foreground">Exchange Rate</span>
                    <span className="text-sm">₹83 = $1</span>
                  </div>

                  <div className="flex justify-between items-center py-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg px-4">
                    <span className="font-semibold">You'll receive</span>
                    <span className="font-bold text-xl text-primary">${usdtAmount} USDT</span>
                  </div>

                  <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                      Instant conversion to USDT
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                      Secure blockchain transfer
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                      Low transaction fees
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>How it works:</strong> Pay using UPI, and the equivalent amount in USDT will be transferred to your crypto wallet within minutes. Transaction fees apply.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
