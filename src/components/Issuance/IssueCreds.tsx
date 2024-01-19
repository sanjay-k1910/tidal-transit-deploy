'use client';

import React, { useEffect, useLayoutEffect, useState } from 'react'
import { issueBulkCredential } from '../../api/bulkIissuance'
import SOCKET from '../../config/SocketConfig';
import RestartDemo from '../RestartDemo';

const IssueCreds = () => {
    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useEffect : useEffect

    const [progress, setProgress] = useState(0)
    const issueCredential = async () => {
        const requestId = localStorage.getItem('request-id') || "";
        const token = localStorage.getItem('session') || "";
        const clientId = SOCKET.id || '';
        try {
            const response = await issueBulkCredential(token, requestId, clientId)
            console.log(35465722, response);
        } catch (err) {
            console.log(err)
        }
    }
    useIsomorphicLayoutEffect(() => {
        issueCredential()

        SOCKET.emit('bulk-connection')
        SOCKET.on('bulk-issuance-process-completed', () => {
            setTimeout(() => {
                console.log(32121, 'bulk-issuance-process-completed')
                setProgress(1)
            }, 3000);
        });

        SOCKET.on('error-in-bulk-issuance-process', () => {
            setTimeout(() => {
                console.log(32121, 'bulk-issuance-process-completed')
                setProgress(-1)
            }, 3000);
        });
    }, [])

    const sf = {
        schemaId: "abc",
        credDefId: "xyz",
        attributes: ["name", "id", "age"],
        connectionInvitation: "https://google.com"
    }

    return (
        <div className='section-from-right flex flex-col items-center py-12'>
            <h2 className='text-3xl font-semibold text-blue-800'>
                {progress === 1 ? "Issuance Completed" : progress === 0 ? "Issuance is in progress" : "Issuance interrupted"}
            </h2>
            <div className='relative w-fit mt-8'>
                <div role="status" className={progress === 0 ? '' : 'invisible'}>
                    <svg aria-hidden="true" className="w-44 h-44 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="none" viewBox="0 0 27 18" className="p-4 border-[5px] border-blue-800 rounded-full mr-1 text-blue-800 absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]"><path fill="currentColor" strokeWidth={2} d="M26.82 6.288 20.469.173a.632.632 0 0 0-.87 0l-2.256 2.172H9.728c-1.754 0-3.424.77-4.53 2.073h-1.2V3.53a.604.604 0 0 0-.614-.592H.615A.604.604 0 0 0 0 3.53c0 .327.275.592.615.592h2.153v8.293H.615a.604.604 0 0 0-.615.592c0 .327.275.592.615.592h2.769c.34 0 .615-.265.615-.592v-1.481h1.2c1.105 1.304 2.775 2.073 4.53 2.073h.715l4.391 4.227c.12.116.278.174.435.174a.626.626 0 0 0 .435-.174l11.115-10.7a.581.581 0 0 0 .18-.419.581.581 0 0 0-.18-.419ZM5.998 10.585a.623.623 0 0 0-.498-.244H4V5.603h1.5c.197 0 .382-.09.498-.243.867-1.146 2.262-1.83 3.73-1.83h6.384l-3.65 3.514a6.103 6.103 0 0 1-1.355-1.31.63.63 0 0 0-.86-.131.578.578 0 0 0-.135.827c1.167 1.545 2.89 2.56 4.85 2.857a.67.67 0 0 1 .575.762.69.69 0 0 1-.791.555 8.905 8.905 0 0 1-4.534-2.08.632.632 0 0 0-.869.04.577.577 0 0 0 .043.837c.11.096.223.19.337.28l-1.24 1.193a.582.582 0 0 0-.18.419c0 .157.066.308.18.419l.698.67a4.675 4.675 0 0 1-3.183-1.797Zm9.272 5.985-5.48-5.277.942-.907a10.27 10.27 0 0 0 3.823 1.388c.101.015.201.022.3.022.93 0 1.75-.651 1.899-1.562.165-1.009-.553-1.958-1.6-2.117a6.411 6.411 0 0 1-1.592-.456l6.473-6.231 5.48 5.277L15.27 16.57Z"></path></svg>
                    {
                        progress === 1 &&
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="checked-anim w-16 h-16 absolute top-0 right-0 bg-white text-green-500 rounded-full">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                        </svg>
                    }
                </div>
            </div>
            {
                progress !== 0 &&
                <RestartDemo />
            }
        </div>
    )
}

export default IssueCreds