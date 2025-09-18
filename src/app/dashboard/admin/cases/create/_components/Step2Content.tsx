"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { KeywordInput } from "@/components/shared/KeywordInput";

// This component receives the `control` object from the main form
export const Step2Content = ({ control }: { control: any }) => (
  <Card>
    <CardHeader>
      <CardTitle>شخصیت و شرح حال بیمار</CardTitle>
      <CardDescription>
        اطلاعاتی که در این بخش وارد می‌کنید، برای ساختن شخصیت هوش مصنوعی بیمار و تاریخچه پزشکی او استفاده می‌شود.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      
      {/* --- Demographic Data Section --- */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="font-semibold">اطلاعات دموگرافیک</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            name="systemPrompt.demographics.name"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام بیمار</FormLabel>
                <FormControl><Input {...field} placeholder="مثال: علی رضایی" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="systemPrompt.demographics.age"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>سن</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value, 10) || '')} 
                    placeholder="مثال: ۴۵" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="systemPrompt.demographics.gender"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>جنسیت</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="انتخاب کنید..." /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="male">مرد</SelectItem>
                    <SelectItem value="female">زن</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="systemPrompt.demographics.birthLocation"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>محل تولد</FormLabel>
                <FormControl><Input {...field} placeholder="مثال: تهران" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="systemPrompt.demographics.livingLocation"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>محل سکونت</FormLabel>
                <FormControl><Input {...field} placeholder="مثال: شیراز" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>


      {/* --- Patient Persona Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="systemPrompt.education"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>سطح تحصیلات بیمار</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="سطح تحصیلات را انتخاب کنید..." /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="illiterate">بی‌سواد</SelectItem>
                  <SelectItem value="primary">ابتدایی</SelectItem>
                  <SelectItem value="middle_school">راهنمایی</SelectItem>
                  <SelectItem value="high_school">دبیرستان</SelectItem>
                  <SelectItem value="diploma">دیپلم</SelectItem>
                  <SelectItem value="bachelors">کارشناسی</SelectItem>
                  <SelectItem value="masters">کارشناسی ارشد</SelectItem>
                  <SelectItem value="phd">دکترا</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="systemPrompt.persona"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>ویژگی‌های شخصیتی</FormLabel>
              <FormControl><Textarea {...field} placeholder="مثال: بیمار فردی مضطرب است، با لحنی آرام صحبت می‌کند..." /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* --- Medical History Section --- */}
      <FormField
        name="systemPrompt.chiefComplaint"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>شکایت اصلی (Chief Complaint)</FormLabel>
            <FormControl><Input {...field} placeholder="مثال: درد قفسه سینه از ۲ ساعت قبل" /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="systemPrompt.presentIllnessHistory"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>شرح بیماری فعلی (HPI)</FormLabel>
            <FormControl><Textarea {...field} rows={5} placeholder="شرح کامل بیماری فعلی بیمار را اینجا بنویسید..." /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="systemPrompt.pastMedicalHistory"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>سابقه پزشکی گذشته (PMH)</FormLabel>
              <FormControl><Textarea {...field} placeholder="مثال: دیابت نوع ۲ از ۱۰ سال قبل، فشار خون بالا..." /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="systemPrompt.pastSurgicalHistory"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>سابقه جراحی</FormLabel>
              <FormControl><Textarea {...field} placeholder="مثال: جراحی آپاندکتومی در سال ۱۳۸۵" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="systemPrompt.drugHistory"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>سابقه مصرف دارو</FormLabel>
              <FormControl><Textarea {...field} placeholder="مثال: متفورمین ۵۰۰ میلی‌گرم روزانه..." /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          name="systemPrompt.familyHistory"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>سابقه خانوادگی</FormLabel>
              <FormControl><Textarea {...field} placeholder="مثال: سابقه بیماری قلبی در پدر" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
       <FormField
          name="systemPrompt.socialHistory"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>سابقه اجتماعی</FormLabel>
              <FormControl><Textarea {...field} placeholder="شغل، وضعیت تاهل، مصرف سیگار و الکل..." /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      {/* --- Review of Systems Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="systemPrompt.reviewOfSystems.positive"
          control={control}
          render={() => (
            <FormItem>
              <FormLabel>مرور سیستم‌ها (یافته‌های مثبت)</FormLabel>
              <FormControl><KeywordInput name="systemPrompt.reviewOfSystems.positive" control={control} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="systemPrompt.reviewOfSystems.negative"
          control={control}
          render={() => (
            <FormItem>
              <FormLabel>مرور سیستم‌ها (یافته‌های منفی)</FormLabel>
              <FormControl><KeywordInput name="systemPrompt.reviewOfSystems.negative" control={control} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </CardContent>
  </Card>
);
