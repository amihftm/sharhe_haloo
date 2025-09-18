import { Brain, HeartPulse, LucideProps, Stethoscope } from "lucide-react"

type Speciality = {
    code: number;
    slug: string;
    name: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}

export const Specialities: Speciality[] = [
    {code: 1, slug: 'cardiology' , name: 'قلب و عروق', icon: HeartPulse},
    {code: 2, slug: 'ems' , name: 'اورژانس',  icon: Stethoscope},
    {code: 3, slug: 'endocrine' , name: 'غدد', icon: Stethoscope},
    {code: 4, slug: 'neurology' , name: 'مغز و اعصاب', icon: Brain},
]