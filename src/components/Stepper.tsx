const Stepper = ({ step, stepChange }: { step: number, stepChange: (value: number) => void }) => {
    const completed = <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
        <svg className="w-3.5 h-3.5 text-blue-600 lg:w-4 lg:h-4 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
        </svg>
    </span>
    const changeStep = (changedStep: number) => {
        if (step !== 3 && step > changedStep) {
            stepChange(changedStep)
        }
    }
    return (
        <div className='px-12 py-4 md:px-24 lg:px-32 z-30 bg-white sticky top-[60px] border-b border-b-slate-50'>
            <ol className="flex items-center w-full">
                <button onClick={() => changeStep(0)} className={`flex w-full items-center text-blue-600 dark:text-blue-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block dark:after:border-blue-800 ${step > 0 && step >= 1 ? 'after:border-blue-100' : 'after:border-gray-100'}`}>
                    {
                        step > 0 && step >= 1 ?
                            completed :
                            <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 ${step === 0 ? 'dark:bg-blue-800 bg-blue-800 text-white' : 'dark:bg-gray-200 bg-gray-200 text-gray-500'} shrink-0`}>
                                <svg
                                    className="w-4 h-4 lg:w-5 lg:h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.25"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                    <polyline points="16 6 12 2 8 6" />
                                    <line x1="12" y1="2" x2="12" y2="15" />
                                </svg>
                            </span>
                    }
                </button>
                <button onClick={() => changeStep(1)} className={`flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block dark:after:border-gray-700 ${step > 0 && step >= 2 ? 'after:border-blue-100' : 'after:border-gray-100'}`}>
                    {
                        step > 0 && step >= 2 ?
                            completed :
                            <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 ${step === 1 ? 'dark:bg-blue-800 bg-blue-800 text-white' : 'dark:bg-gray-200 bg-gray-200 text-gray-500'} shrink-0`}>
                                <svg className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
                                </svg>
                            </span>
                    }
                </button>
                <button onClick={() => changeStep(2)} className="flex items-center w-fit">
                    {
                        step > 0 && step >= 3 ?
                            completed :
                            <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 ${step === 2 ? 'dark:bg-blue-800 bg-blue-800 text-white' : 'dark:bg-gray-200 bg-gray-200 text-gray-500'} shrink-0`}>
                                <svg className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
                                </svg>
                            </span>
                    }
                </button>
            </ol>
        </div>
    )
}

export default Stepper