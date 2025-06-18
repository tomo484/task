import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-[#CFDBE8]",
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-[#0D80F2] transition-all"
        style={{
          transform: `translateX(-${100 - (value / max) * 100}%)`,
        }}
      />
    </div>
  )
)
Progress.displayName = "Progress"

interface ProgressBarProps {
  percentage: number;
}

export function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-[#4A739C] font-lexend">Progress</span>
        <span className="text-sm font-bold text-[#0D141C] font-lexend">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

export { Progress } 