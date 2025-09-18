"use client";

import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface KeywordInputProps {
  name: string;
  control: any;
}

export function KeywordInput({ name, control }: KeywordInputProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const [keyword, setKeyword] = useState("");

  const handleAddKeyword = () => {
    if (keyword.trim() !== "") {
      // react-hook-form's useFieldArray expects an object
      append({ value: keyword.trim() });
      setKeyword("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      handleAddKeyword();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex w-full items-center space-x-2 space-x-reverse">
        <Input
          placeholder="پس از نوشتن کلمه مورد نظر، از دکمه افزودن یا کلید enter استفاده کنید..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button type="button" onClick={handleAddKeyword}>
          افزودن
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {fields.map((field, index) => (
          <Badge key={field.id} variant="secondary" className="flex items-center gap-1">
            {/* The actual value is nested inside the field object */}
            {(field as unknown as { value: string }).value}
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded-full hover:bg-muted-foreground/20 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
