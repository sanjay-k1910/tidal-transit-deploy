import React, { useState } from 'react'

interface ITemplates {
    id: string;
    name: string;
    poster: string;
    active: boolean;
    selected: boolean;
}

interface IProps {
    stepChange: (value: number) => void
}

function SelectTemplate({ stepChange }: IProps) {
    const templateData = [
        {
            id: '1',
            name: 'Test 1',
            poster: '/theme1.png',
            active: true,
            selected: true
        },
        {
            id: '2',
            name: 'Test 2',
            poster: '/theme2.png',
            active: false,
            selected: false
        }
    ]
    const [templates, setTemplates] = useState<ITemplates[]>(templateData);

    const selectTemplate = (id: string) => {
        const updated = templates && templates?.length > 0 && templates?.map(item => {
            if (id === item.id) {
                return {
                    ...item,
                    selected: true
                }
            }
            return {
                ...item,
                selected: false
            }
        })
        if (updated) {
            setTemplates(updated)
        }
    }

   const isSelected =  templates && templates?.length > 0 && templates.some(item => item.selected)

    return (
        <div>
            <div className={`section-from-right flex flex-wrap justify-center gap-4 md:gap-6`}>
                {
                    templates?.length > 0 && templates.map(item => (
                        <button key={item.id} className={`p-1 w-[400px] relative bg-white border-2 ${item.selected ? 'border-blue-800' : 'border-gray-200'} rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 overflow-hidden ${item.selected && item.active ? 'opacity-100' : 'opacity-75'} ${item.active ? 'hover:opacity-100' : 'cursor-not-allowed'} group`}
                            onClick={() => item.active && selectTemplate(item.id)}>
                            <img className="object-cover overflow-hidden w-full h-[550px] md:rounded" src={item.poster} alt={item.name} />
                            <div className='absolute top-2 right-2'>
                                {
                                    item.selected ?
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-800">
                                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                        </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-8 h-8 hidden group-hover:block text-blue-800 ${!item.active ? 'hidden group-hover:hidden' : ''}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                }
                            </div>
                        </button>
                    ))
                }
            </div>
            <div className='mt-6 flex justify-end fixed bottom-8 right-4'>
                <button className={`flex items-center px-4 py-2 rounded-md text-center border text-white bg-blue-800 cursor-pointer ${!isSelected
                    ? 'opacity-50 bg-gray-400 dark:bg-transparent dark:text-gray-400 border-gray-400'
                    : 'bg-blue-800 hover:bg-blue-800 dark:border-blue-800'
                    }`}
                    disabled={!isSelected}
                    onClick={() => stepChange(2)}
                >
                    Next
                    <svg className='ml-2 shrink-0' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 30 20" fill="none"><path d="M29.8369 10.763C29.9991 10.3984 30.0415 9.99721 29.9588 9.61015C29.876 9.22309 29.6717 8.86759 29.3719 8.58861L20.7999 0.609018C20.6022 0.418485 20.3657 0.26651 20.1043 0.161959C19.8428 0.0574089 19.5616 0.00237707 19.2771 7.53215e-05C18.9925 -0.00222642 18.7103 0.0482475 18.447 0.148553C18.1836 0.248858 17.9443 0.396985 17.7431 0.584292C17.5419 0.771598 17.3828 0.994332 17.275 1.2395C17.1673 1.48466 17.1131 1.74735 17.1155 2.01223C17.118 2.27711 17.1771 2.53888 17.2894 2.78227C17.4018 3.02566 17.565 3.24578 17.7697 3.4298L22.6857 8.0061H2.14299C1.57464 8.0061 1.02956 8.21628 0.627668 8.59039C0.225779 8.96451 0 9.47192 0 10.001C0 10.5301 0.225779 11.0375 0.627668 11.4116C1.02956 11.7857 1.57464 11.9959 2.14299 11.9959H22.6857L17.7718 16.5702C17.5672 16.7542 17.4039 16.9743 17.2916 17.2177C17.1793 17.4611 17.1202 17.7229 17.1177 17.9878C17.1152 18.2526 17.1694 18.5153 17.2772 18.7605C17.3849 19.0057 17.5441 19.2284 17.7453 19.4157C17.9465 19.603 18.1858 19.7511 18.4491 19.8514C18.7125 19.9518 18.9947 20.0022 19.2792 19.9999C19.5638 19.9976 19.845 19.9426 20.1064 19.838C20.3679 19.7335 20.6043 19.5815 20.802 19.391L29.374 11.4114C29.5725 11.2257 29.7298 11.0054 29.8369 10.763Z" fill="white"></path></svg>
                </button>
            </div>
        </div>
    )
}

export default SelectTemplate