"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, DollarSign, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ListDomain = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    domain: "",
    description: "",
    startingBid: "",
    reservePrice: "",
    auctionDuration: "24",
    category: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Domain Listed Successfully",
      description: `${formData.domain} has been added to the auction queue.`,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            List Your Domain for Auction
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start a transparent English auction for your premium domain and reach serious buyers worldwide.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="auction-card">
            <h2 className="text-2xl font-bold mb-6">Auction Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="domain" className="text-base font-medium mb-2 block">
                  Domain Name
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={formData.domain}
                    onChange={(e) => handleInputChange("domain", e.target.value)}
                    className="pl-10 h-12 text-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-medium mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your domain's value, history, and potential uses..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[120px] resize-none"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startingBid" className="text-base font-medium mb-2 block">
                    Starting Bid (ETH)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="startingBid"
                      type="number"
                      step="0.01"
                      placeholder="1.0"
                      value={formData.startingBid}
                      onChange={(e) => handleInputChange("startingBid", e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reservePrice" className="text-base font-medium mb-2 block">
                    Reserve Price (ETH)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="reservePrice"
                      type="number"
                      step="0.01"
                      placeholder="5.0"
                      value={formData.reservePrice}
                      onChange={(e) => handleInputChange("reservePrice", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="auctionDuration" className="text-base font-medium mb-2 block">
                  Auction Duration (Hours)
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <select
                    id="auctionDuration"
                    value={formData.auctionDuration}
                    onChange={(e) => handleInputChange("auctionDuration", e.target.value)}
                    className="w-full pl-10 h-12 bg-input border border-border rounded-md text-foreground appearance-none"
                  >
                    <option value="12">12 Hours</option>
                    <option value="24">24 Hours</option>
                    <option value="48">48 Hours</option>
                    <option value="72">72 Hours</option>
                    <option value="168">7 Days</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full btn-hero h-12 text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Auction
              </Button>
            </form>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <div className="auction-card">
              <h3 className="text-xl font-bold mb-4">Auction Preview</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="domain-glow text-2xl mb-2">
                    {formData.domain || "example.com"}
                  </h4>
                  <p className="text-muted-foreground">
                    {formData.description || "Premium domain available for auction"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Starting Bid</div>
                    <div className="text-xl font-bold text-primary">
                      {formData.startingBid || "1.0"} ETH
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Reserve</div>
                    <div className="text-xl font-bold">
                      {formData.reservePrice || "5.0"} ETH
                    </div>
                  </div>
                </div>

                <div className="countdown">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Duration: {formData.auctionDuration}h
                </div>
              </div>
            </div>

            <div className="auction-card">
              <h3 className="text-xl font-bold mb-4">Listing Fee</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Platform Fee (2%)</span>
                  <span>0.02 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>Gas Estimate</span>
                  <span>~0.005 ETH</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold text-primary">
                  <span>Total</span>
                  <span>0.025 ETH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListDomain;