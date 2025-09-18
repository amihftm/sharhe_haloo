"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LEARNING_OBJECTIVES, LearningObjective } from "@/data/learningObjectivesData";
import { useFormContext } from "react-hook-form";
import { ScoreSelector } from "@/components/shared/ScoreSelector";
import React from "react";

export const Step3Content = () => {
  const { control } = useFormContext(); 
  
  const objectivesByCategory = LEARNING_OBJECTIVES.reduce((acc, objective) => {
    acc[objective.category] = acc[objective.category] || [];
    acc[objective.category].push(objective);
    return acc;
  }, {} as Record<string, LearningObjective[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>اهداف یادگیری و ارزیابی</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">گزاره ارزیابی</TableHead>
                <TableHead className="w-[250px] text-center">میزان اهمیت (۱ تا ۵)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(objectivesByCategory).map(([category, objectives]) => (
                <React.Fragment key={category}>
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={2} className="font-bold text-center bg-primary/50">
                      {category}
                    </TableCell>
                  </TableRow>
                  {objectives.map((objective) => {
                    // Find the correct index in the form array based on the unique ID
                    const formIndex = LEARNING_OBJECTIVES.findIndex(lo => lo.id === objective.id);
                    return (
                      <TableRow key={objective.id}>
                        <TableCell className="text-right whitespace-pre-wrap" aria-multiline>{objective.statement}</TableCell>
                        <TableCell>
                           {/* The name is dynamically generated for react-hook-form */}
                          <ScoreSelector control={control} name={`learningObjectives.${formIndex}.score`} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
