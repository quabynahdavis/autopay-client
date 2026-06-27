import type { PaymentStatus } from "@/types/payment";
import { paymentStatusLabels } from "@/constants/status";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const statusVariant: Record<
  PaymentStatus,
  "success" | "warning" | "danger" | "processing" | "default"
> = {
  success: "success",
  pending: "warning",
  failed: "danger",
  processing: "processing",
  retry: "warning",
};

interface StatusBadgeProps {
  status: PaymentStatus;
  showProgress?: boolean;
}

export function StatusBadge({ status, showProgress }: StatusBadgeProps) {
  return (
    <div className="flex flex-col gap-1">
      <Badge variant={statusVariant[status]}>{paymentStatusLabels[status]}</Badge>
      {showProgress && status === "processing" && (
        <Progress value={65} className="h-1 w-20" aria-label="Processing progress" />
      )}
    </div>
  );
}
