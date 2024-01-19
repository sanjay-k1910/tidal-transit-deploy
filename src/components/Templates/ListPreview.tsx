import React from 'react'
import ThemeOne from './themes/ThemeOne'

export interface ITemplateData {
    sl_no: string;
    date: string;
    student_name: string;
    programme: string;
    current_semester_performance_credits_earned: string;
    current_semester_performance_SGA: string;
    cummulative_semester_performance_credits_earned: string;
    cummulative_semester_performance_SGA: string;
    university_name: string;
    type: string;
    university_address: string;
    semester: string;
    academic_year: string;
    registration_no: string;
    year: string;
    course_details: string;
}

interface IProps {
    data: ITemplateData[]
}

function ListPreview({ data }: IProps) {
    return (
        <div>
            {
                data && data.length > 0 && data.map((item, index) => (
                    <div key={item.sl_no} className="mt-8 duration-700 ease-in-out flex justify-center">
                        <ThemeOne data={item} />
                    </div>
                ))
            }
        </div>
    )
}

export default ListPreview