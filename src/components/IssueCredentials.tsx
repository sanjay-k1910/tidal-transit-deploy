'use client';

import React, { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import UploadRecords from './UploadRecords/Upload'
import Stepper from './Stepper'
import SelectTemplate from './Templates/SelectTemplate';
import PreviewTemplate from './Templates/PreviewTemplate';
import IssueCreds from './Issuance/IssueCreds';
import { ToastContainer } from 'react-toastify';

interface IProps {
  token: string;
}

const IssueCredentials = ({ token }: IProps) => {
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useEffect : useEffect

  const [step, setStep] = useState(0)
  useIsomorphicLayoutEffect(() => {
    localStorage.setItem('session', token)
  }, [token])

  const showComponent = (): ReactNode => {
    switch (step) {
      case 0:
        return <UploadRecords stepChange={(value) => {
          console.log(value)
          setStep(value)
        }} />
      case 1:
        return <SelectTemplate stepChange={(value) => {
          console.log(value)
          setStep(value)
        }} />
      case 2:
        return <PreviewTemplate stepChange={(value) => {
          console.log(value)
          setStep(value)
        }} />
      case 3:
        return <IssueCreds />

      default:
        return <div>Welcome</div>
    }
  }

  return (
    <div>
      <ToastContainer />
      <Stepper step={step} stepChange={(value) => setStep(value)} />
      <div className='p-4 sm:px-8 sm:py-12 !pb-28'>
        {showComponent()}
      </div>
    </div>
  )
}

export default IssueCredentials