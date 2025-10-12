import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "Jan", total: 1860 },
  { name: "Feb", total: 3050 },
  { name: "Mar", total: 2370 },
  { name: "Apr", total: 3780 },
  { name: "May", total: 4220 },
  { name: "Jun", total: 3100 },
  { name: "Jul", total: 2800 },
  { name: "Aug", total: 3500 },
  { name: "Sep", total: 4200 },
  { name: "Oct", total: 3800 },
  { name: "Nov", total: 2900 },
  { name: "Dec", total: 3200 },
];

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip />
            <Bar
              dataKey="total"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
