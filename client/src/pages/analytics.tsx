import { Sidebar } from "@/components/sidebar-new";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  BarChart3,
  Activity,
  TrendingUp,
  Zap,
  DatabaseZap,
  FileBarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <div className="mb-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-20 animate-pulse"></div>
            <div className="relative bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold animate-float">
                  📊
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                    Analytics Dashboard
                  </h1>
                  <p className="text-lg text-gray-600 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                    Advanced insights at your fingertips
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card className="modern-card relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-90"></div>
            <div className="relative text-white p-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  Engagement Trends
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg text-white">
                  Monitor user activity patterns
                </p>
              </CardContent>
            </div>
          </Card>

          <Card className="modern-card relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-90"></div>
            <div className="relative text-white p-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  System Performance
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg text-white">
                  Keep tabs on speed & load metrics
                </p>
              </CardContent>
            </div>
          </Card>

          <Card className="modern-card relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-90"></div>
            <div className="relative text-white p-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  Financial Insights
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg text-white">
                  Track revenue, profits, and KPIs
                </p>
              </CardContent>
            </div>
          </Card>

          <Card className="modern-card relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 opacity-90"></div>
            <div className="relative text-white p-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  Customer Intelligence
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg text-white">
                  Gain deeper understanding of clients
                </p>
              </CardContent>
            </div>
          </Card>

          <Card className="modern-card relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500 to-slate-700 opacity-90"></div>
            <div className="relative text-white p-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  Reports Hub
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <FileBarChart2 className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg text-white">
                  Export key reports and summaries
                </p>
              </CardContent>
            </div>
          </Card>

          <Card className="modern-card relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 opacity-90"></div>
            <div className="relative text-white p-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  AI Forecasting
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <DatabaseZap className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg text-white">
                  Predict trends and make smarter decisions
                </p>
              </CardContent>
            </div>
          </Card>
        </div>

        <div className="mt-16 text-center py-16 border-t border-dashed border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🚀 Big Things Are Coming Soon
          </h2>
          <p className="text-gray-600 text-lg mb-6 max-w-xl mx-auto">
            We’re working hard on bringing you a fully customizable analytics
            engine — including live dashboards, data drill-downs, exportable
            visualizations, and AI-powered insights tailored to your business.
          </p>
          <Button className="btn-modern btn-gradient px-8 py-3 text-lg">
            Notify Me When It Launches
          </Button>
        </div>
      </main>
    </div>
  );
}
