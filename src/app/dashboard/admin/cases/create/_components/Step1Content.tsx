import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SpecialtyCombobox } from "@/components/shared/SpecialtyCombobox";
import { KeywordInput } from "@/components/shared/KeywordInput";
import { RiveFileInput } from "@/components/shared/RiveFileInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Step1Content = ({ control }: { control: any }) => (
  <Card>
    <CardHeader>
      <CardTitle>اطلاعات اولیه کیس</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormField
        name="title"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>عنوان</FormLabel>
            <FormControl>
              <Input {...field} placeholder="مثال: بیمار با درد قفسه سینه" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="description"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>توضیحات کوتاه</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="یک خلاصه کوتاه از سناریوی بالینی بنویسید..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-row justify-evenly">
        <FormField
          name="specialty"
          control={control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>تخصص</FormLabel>
              <FormControl>
                <SpecialtyCombobox field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="emotional_state"
          control={control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>وضعیت روحی روانی اولیه</FormLabel>
              <FormControl>
                <Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ANXIOUS">مضطرب</SelectItem>
                    <SelectItem value="CALM">آرام</SelectItem>
                    <SelectItem value="IRRITATED">آژیته</SelectItem>
                    <SelectItem value="CONFUSED">گیج</SelectItem>
                    <SelectItem value="GRATEFUL">راضی</SelectItem>
                    <SelectItem value="SAD">غمگین</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        name="riveFileUrl"
        control={control}
        render={() => <RiveFileInput name="riveFileUrl" />}
      />

      <FormField
        name="keywords"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>کلمات کلیدی</FormLabel>
            <FormControl>
              <KeywordInput {...field} control={control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
);