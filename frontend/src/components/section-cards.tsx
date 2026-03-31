"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ShoppingBagIcon,
  UsersIcon,
  TrendingUpIcon,
} from "lucide-react";

interface SectionCardsProps {
  data: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
  };
}

export function SectionCards({ data }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
      {/* Total Revenue */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tổng Doanh Thu</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {Number(data.totalRevenue || 0).toLocaleString('vi-VN')}đ
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600 border-green-200">
              <TrendingUpIcon className="mr-1 h-3 w-3" />
              Tăng trưởng
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium text-green-700">
            Kinh doanh ổn định <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Chỉ số tính từ trước tới nay</div>
        </CardFooter>
      </Card>

      {/* Orders */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tổng Đơn Hàng</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.totalOrders || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <ShoppingBagIcon className="mr-1 h-3 w-3" />
              Bán chạy
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium text-blue-700">
            Nhiều đơn hàng mới <ShoppingBagIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Các sản phẩm trà được yêu thích
          </div>
        </CardFooter>
      </Card>

      {/* Normal Users */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tổng Khách Hàng</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.totalUsers || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              <UsersIcon className="mr-1 h-3 w-3" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium text-purple-700">
            Khách hàng tăng đều <UsersIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Sự uy tín làm nên thương hiệu
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

