"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Globe, 
  Users, 
  TrendingUp,
  Calendar,
  DollarSign
} from "lucide-react";

type SortField = "domain" | "floorPrice" | "volume" | "startDate" | "endDate" | "owners" | "supply";
type SortDirection = "asc" | "desc";

const DomainsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("floorPrice");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const domains = [
    {
      domain: "crypto.com",
      floorPrice: 125.5,
      volume: 2847.3,
      startDate: "2024-01-15",
      endDate: "2024-01-17",
      owners: 1,
      supply: 1,
      status: "sold",
      category: "Finance"
    },
    {
      domain: "ai.io",
      floorPrice: 89.2,
      volume: 1234.7,
      startDate: "2024-02-01",
      endDate: "2024-02-03",
      owners: 1,
      supply: 1,
      status: "live",
      category: "Technology"
    },
    {
      domain: "web3.org",
      floorPrice: 156.8,
      volume: 3421.9,
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      owners: 1,
      supply: 1,
      status: "sold",
      category: "Technology"
    },
    {
      domain: "blockchain.app",
      floorPrice: 73.4,
      volume: 987.2,
      startDate: "2024-02-05",
      endDate: "2024-02-07",
      owners: 1,
      supply: 1,
      status: "live",
      category: "Technology"
    },
    {
      domain: "defi.world",
      floorPrice: 198.1,
      volume: 4123.6,
      startDate: "2024-01-10",
      endDate: "2024-01-12",
      owners: 1,
      supply: 1,
      status: "sold",
      category: "Finance"
    },
    {
      domain: "nft.space",
      floorPrice: 45.7,
      volume: 567.8,
      startDate: "2024-02-10",
      endDate: "2024-02-12",
      owners: 1,
      supply: 1,
      status: "live",
      category: "Art"
    },
    {
      domain: "gaming.xyz",
      floorPrice: 67.3,
      volume: 789.4,
      startDate: "2024-02-08",
      endDate: "2024-02-10",
      owners: 1,
      supply: 1,
      status: "upcoming",
      category: "Gaming"
    },
    {
      domain: "meta.tech",
      floorPrice: 112.9,
      volume: 1876.5,
      startDate: "2024-01-25",
      endDate: "2024-01-27",
      owners: 1,
      supply: 1,
      status: "sold",
      category: "Technology"
    },
    {
      domain: "finance.global",
      floorPrice: 234.7,
      volume: 5234.8,
      startDate: "2024-01-05",
      endDate: "2024-01-07",
      owners: 1,
      supply: 1,
      status: "sold",
      category: "Finance"
    },
    {
      domain: "social.app",
      floorPrice: 87.6,
      volume: 1432.1,
      startDate: "2024-02-15",
      endDate: "2024-02-17",
      owners: 1,
      supply: 1,
      status: "upcoming",
      category: "Social"
    }
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const filteredDomains = domains
    .filter(domain => 
      domain.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      
      if (sortField === "startDate" || sortField === "endDate") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-primary text-primary-foreground">Live</Badge>;
      case "sold":
        return <Badge variant="secondary">Sold</Badge>;
      case "upcoming":
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalVolume = domains.reduce((sum, domain) => sum + domain.volume, 0);
  const averagePrice = domains.reduce((sum, domain) => sum + domain.floorPrice, 0) / domains.length;

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Domain Marketplace
          </h1>
          <p className="text-xl text-muted-foreground">
            Complete overview of all domain auctions with detailed analytics
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="auction-card text-center">
            <div className="flex items-center justify-center mb-2">
              <Globe className="w-5 h-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{domains.length}</span>
            </div>
            <div className="text-sm text-muted-foreground">Total Domains</div>
          </div>
          <div className="auction-card text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{totalVolume.toFixed(1)}</span>
            </div>
            <div className="text-sm text-muted-foreground">Total Volume (ETH)</div>
          </div>
          <div className="auction-card text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{averagePrice.toFixed(1)}</span>
            </div>
            <div className="text-sm text-muted-foreground">Avg Price (ETH)</div>
          </div>
          <div className="auction-card text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{domains.filter(d => d.status === "live").length}</span>
            </div>
            <div className="text-sm text-muted-foreground">Live Auctions</div>
          </div>
        </div>

        {/* Search */}
        <div className="auction-card mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search domains or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Table */}
        <div className="auction-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("domain")}
                      className="flex items-center gap-2 p-0 h-auto font-bold"
                    >
                      Domain
                      {getSortIcon("domain")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("floorPrice")}
                      className="flex items-center gap-2 p-0 h-auto font-bold"
                    >
                      Floor Price (ETH)
                      {getSortIcon("floorPrice")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("volume")}
                      className="flex items-center gap-2 p-0 h-auto font-bold"
                    >
                      Volume (ETH)
                      {getSortIcon("volume")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("startDate")}
                      className="flex items-center gap-2 p-0 h-auto font-bold"
                    >
                      Start Date
                      {getSortIcon("startDate")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("endDate")}
                      className="flex items-center gap-2 p-0 h-auto font-bold"
                    >
                      End Date
                      {getSortIcon("endDate")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("owners")}
                      className="flex items-center gap-2 p-0 h-auto font-bold"
                    >
                      Owners
                      {getSortIcon("owners")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("supply")}
                      className="flex items-center gap-2 p-0 h-auto font-bold"
                    >
                      Supply
                      {getSortIcon("supply")}
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDomains.map((domain, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-primary" />
                        <span className="font-bold domain-glow">{domain.domain}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-primary">{domain.floorPrice} ETH</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">{domain.volume.toFixed(1)} ETH</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{domain.startDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{domain.endDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{domain.owners}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span>{domain.supply}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(domain.status)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {domain.category}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDomains.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No domains found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DomainsTable;