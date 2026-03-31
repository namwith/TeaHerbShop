"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart for revenues and orders";

const chartConfig = {
  revenue: {
    label: "Doanh thu (₫)",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "Số đơn hàng",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface ChartItem {
  date: string;
  orders: number;
  revenue: number;
}

interface ChartAreaInteractiveProps {
  chartData: ChartItem[];
  filter: string;
  setFilter: (val: string) => void;
}

export function ChartAreaInteractive({ chartData, filter, setFilter }: ChartAreaInteractiveProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Biểu Đồ Danh Thu & Đơn Hàng</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Thống kê doanh số theo thời gian
          </span>
          <span className="@[540px]/card:hidden">Thống kê doanh số</span>
        </CardDescription>
        <CardAction>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Chọn thời gian"
            >
              <SelectValue placeholder="7 Ngày qua" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7days" className="rounded-lg">
                7 Ngày qua
              </SelectItem>
              <SelectItem value="30days" className="rounded-lg">
                30 Ngày qua
              </SelectItem>
              <SelectItem value="3months" className="rounded-lg">
                3 Tháng qua
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} 
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="revenue"
              type="monotone"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
