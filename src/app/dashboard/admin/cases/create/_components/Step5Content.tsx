import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeywordInput } from '@/components/shared/KeywordInput';

export const Step5Content = ({ control }: { control: any }) => (
    <Card>
        <CardHeader><CardTitle>تشخیص و جزئیات نهایی</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <FormField
              name="differentialDiagnosis"
              control={control}
              render={() => (
                <FormItem>
                  <FormLabel>تشخیص‌های افتراقی (DDx)</FormLabel>
                  <FormControl>
                    <KeywordInput name="differentialDiagnosis" control={control} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              name="finalDiagnosis" 
              control={control} 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تشخیص نهایی</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="تشخیص قطعی بیمار را وارد کنید..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
        </CardContent>
    </Card>
);
