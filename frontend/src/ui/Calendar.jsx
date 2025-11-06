import React from 'react';
import { DayPicker } from 'react-day-picker';
import { cn } from './utils.js';
import { buttonVariants } from './Button.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-day-picker/dist/style.css';

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  weekStartsOn = 1, // Monday as the first day
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={weekStartsOn}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'relative flex justify-between items-center pt-1', // Removed absolute positioning
        caption_label: 'text-sm font-medium',
        nav: 'absolute right-2 flex items-center space-x-2', // Adjusted spacing and layout
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: '', // Removed absolute positioning
        nav_button_next: '', // Removed absolute positioning
        table: 'w-full border-collapse space-y-1',
        head_row: 'grid grid-cols-7 gap-2',
        head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] h-8 flex items-center justify-center',
        row: 'grid grid-cols-7 w-full mt-2 gap-2', 
        day_range_start: 'rounded-l-md',
        day_range_end: 'rounded-r-md',
        day_selected: '',
        day_today: 'bg-accent text-accent-foreground',
        day_outside: 'text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50 cursor-not-allowed',
        day_range_middle: 'bg-accent text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };