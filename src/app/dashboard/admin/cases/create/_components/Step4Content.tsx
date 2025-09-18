import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Step4Content = ({ control }: { control: any }) => (
  <Card>
    <CardHeader>
      <CardTitle>یافته‌های معاینه بالینی</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Add component for differentialDiagnosis array */}
      <FormField
        name="physicalExamFindings.raw"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>یافته های بالینی</FormLabel>
            <FormDescription>فعلا یه متنی بنویس تا بعد ارتقا بدمش</FormDescription>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
);
