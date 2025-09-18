"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Specialities } from "@/data/specialties";

// The field object from react-hook-form's FormField render prop
interface SpecialtyComboboxProps {
  field: {
    onChange: (value: string) => void;
    value: string;
  };
}

export function SpecialtyCombobox({ field }: SpecialtyComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size={'lg'}
        >
          {field.value
            ? Specialities.find((specialty) => specialty.slug === field.value)?.name
            : "یک تخصص انتخاب کنید..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="جستجوی تخصص..." />
          <CommandList>
            <CommandEmpty>تخصصی یافت نشد.</CommandEmpty>
            <CommandGroup>
              {Specialities.map((specialty) => (
                <CommandItem
                  key={specialty.slug}
                  value={specialty.name} // Search is based on name
                  onSelect={() => {
                    field.onChange(specialty.slug); // Form value is the slug
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      field.value === specialty.slug ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {specialty.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
