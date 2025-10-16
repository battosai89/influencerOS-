"use client";

import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/navigation";
import useStore from '@/hooks/useStore';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Calendar, Clock, DollarSign, Users } from "lucide-react";

const DashboardContent = () => {
  const router = useRouter();
  const { campaigns, influencers, transactions } = useStore();

  // Calculate key metrics
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === "Live").length;
  const totalInfluencers = influencers.length;
    const totalPayments = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => router.push("/campaigns/new")}>New Campaign</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="futuristic-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCampaigns}</div>
                  <p className="text-xs text-muted-foreground">{activeCampaigns} active</p>
                </CardContent>
              </Card>
              <Card className="futuristic-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Influencers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalInfluencers}</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card className="futuristic-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalPayments.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                </CardContent>
              </Card>
              <Card className="futuristic-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">2 overdue</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 futuristic-border">
                <CardHeader>
                  <CardTitle>Recent Campaigns</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {/* <Overview /> */}
                  <p>Campaign overview chart goes here</p>
                </CardContent>
              </Card>
              <Card className="col-span-3 futuristic-border">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  {/* <CardDescription>
                    You made 265 sales this month.
                  </CardDescription> */}
                </CardHeader>
                <CardContent>
                  {/* <RecentSales /> */}
                  <p>List of quick actions</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional Sections */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="futuristic-border">
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>List of top performing influencers</p>
            </CardContent>
          </Card>
          <Card className="futuristic-border">
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <p>List of upcoming campaign deadlines</p>
            </CardContent>
          </Card>
          <Card className="futuristic-border">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Recent notifications and alerts</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export default function DashboardPage() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <DashboardContent />
    </ErrorBoundary>
  );
}
