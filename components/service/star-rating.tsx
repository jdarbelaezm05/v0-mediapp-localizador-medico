'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  interactive?: boolean
  onChange?: (rating: number) => void
}

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onChange
}: StarRatingProps) {
  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, index) => {
          const filled = index < Math.floor(rating)
          const partial = index === Math.floor(rating) && rating % 1 > 0
          const fillPercentage = partial ? (rating % 1) * 100 : 0

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(index)}
              className={cn(
                "relative transition-transform",
                interactive && "hover:scale-110 cursor-pointer disabled:cursor-default"
              )}
            >
              {/* Background star (empty) */}
              <Star className={cn(sizeClasses[size], "text-muted-foreground/30")} />
              
              {/* Filled star overlay */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : `${fillPercentage}%` }}
              >
                <Star 
                  className={cn(
                    sizeClasses[size], 
                    "fill-yellow-400 text-yellow-400"
                  )} 
                />
              </div>
            </button>
          )
        })}
      </div>
      {showValue && (
        <span className="ml-1 text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
