"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

interface ScoreSelectorProps {
  control: any;
  name: string; // The name will be dynamic, e.g., "objectives.0.score"
}

export function ScoreSelector({ control, name }: ScoreSelectorProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-center space-x-2 space-x-reverse">
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex items-center space-x-2 space-x-reverse"
            >
              {[1, 2, 3, 4, 5].map((score) => (
                <FormItem key={score} className="flex items-center space-x-1 space-x-reverse">
                  <FormControl>
                    <RadioGroupItem value={score.toString()} />
                  </FormControl>
                  <FormLabel className="font-normal">{score}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
