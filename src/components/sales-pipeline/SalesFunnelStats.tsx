
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import NegotiationCard from "@/components/dashboard/NegotiationCard";

const SalesFunnelStats = () => {
  // Mock statistics data
  const stats = [
    {
      title: "Em negociação",
      data: {
        total: 18500,
        currency: "R$",
        count: 8
      }
    },
    {
      title: "Propostas Enviadas",
      data: {
        total: 25000,
        currency: "R$",
        count: 12
      }
    },
    {
      title: "Fechado (Mês)",
      data: {
        total: 12300,
        currency: "R$",
        count: 3
      }
    },
    {
      title: "Taxa de Conversão",
      data: {
        total: 35,
        currency: "",
        count: 23
      },
      isPercentage: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border shadow-sm">
          <CardContent className="p-4">
            <NegotiationCard
              title={stat.title}
              data={{
                total: stat.data.total,
                currency: stat.isPercentage ? "" : stat.data.currency,
                count: stat.data.count
              }}
              isHighlighted={index === 0}
            />
            {stat.isPercentage && (
              <div className="text-xs text-muted-foreground mt-1">
                {stat.data.count} leads convertidos
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SalesFunnelStats;
