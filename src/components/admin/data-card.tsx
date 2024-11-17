import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataItem {
  label: string;
  value: string;
}

interface DataCardProps {
  title: string;
  data: DataItem[];
}

export function DataCard({ title, data }: DataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {data.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{item.label}</span>
              <span className="font-semibold">{item.value}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
