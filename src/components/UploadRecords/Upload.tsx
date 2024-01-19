'use client';

import { useEffect, useLayoutEffect, useState, type ChangeEvent, type DragEventHandler } from 'react';
import Select from 'react-select';
import { fetchCredentialOption } from '../../api/IssueCredential';
import { DownloadCsvTemplate, getCsvFileData, uploadCsvFile } from '../../api/bulkIissuance';
import { toast, type TypeOptions } from 'react-toastify';
import RestartDemo from '../RestartDemo';

interface IProps {
    stepChange: (value: number) => void
}


const UploadRecords = ({ stepChange }: IProps): JSX.Element => {
    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useEffect : useEffect

    const [credentialSelected, setCredentialSelected] = useState('');
    const [credentialOptions, setCredentialOptions] = useState([]);
    const [csvData, setCsvData] = useState<string[][]>([]);
    const [requestId, setRequestId] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [process, setProcess] = useState<boolean>(false);
    const [message, setMessage] = useState({ type: 'success', message: '' })

    const getCredentialOptions = async () => {
        const token = localStorage.getItem("session") || "";
        try {
            const res = await fetchCredentialOption(token)
            const options = res && res.length > 0 && res.map((item: { schemaName: any; schemaVersion: any; credentialDefinition: any; credentialDefinitionId: any; }) => {
                const label = `${item.credentialDefinition}`
                return {
                    ...item,
                    label,
                    value: item.credentialDefinitionId
                }
            })
            setCredentialOptions(options)
        } catch (error) {
            console.error("credentialOptions", error)
        }
    }

    useIsomorphicLayoutEffect(() => {
        getCredentialOptions()
    }, [])

    const downloadFile = (url: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const DownloadSchemaTemplate = async () => {
        setProcess(true);
        if (credentialSelected) {
            try {
                setProcess(true);

                const response = await DownloadCsvTemplate(credentialSelected);
                console.log(34211, response);

                if (response) {
                    const splitFile = credentialSelected.split(":")
                    const fileName = splitFile[splitFile.length - 1]
                    console.log(345435, credentialSelected, fileName);

                    const fileUrl = response;
                    if (fileUrl) {
                        downloadFile(fileUrl, 'downloadedFile.csv');
                        setMessage({ type: 'success', message: 'File downloaded successfully' });
                        setProcess(false);
                    } else {
                        setMessage({ message: 'File URL is missing in the response', type: "failure" });
                    }
                } else {
                    setMessage({ message: 'API request was not successful', type: "failure" });
                }
            } catch (error) {
                console.log('Download Template ERROR', error)
                setMessage({ message: error as string, type: "failure" });
            }
        }
    };

    const readFileAsBinary = (file: File): Promise<Uint8Array> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                if (event.target?.result) {
                    const binaryData = new Uint8Array(event.target.result as ArrayBuffer);
                    resolve(binaryData);
                } else {
                    reject(new Error('Failed to read file as binary.'));
                }
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsArrayBuffer(file);
        });
    };

    const wait = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleDiscardFile = () => {
        setCsvData([]);
        setIsFileUploaded(false);
        setUploadedFileName('');
        setUploadedFile(null);
        setMessage({ type: 'success', message: '' })
    };

    const handleFileUpload = async (file: any) => {
        setLoading(true);
        const token = localStorage.getItem("session") || "";

        console.log(24234, file);

        if (file.type !== 'text/csv') {
            setMessage({ message: 'Invalid file type. Please select only CSV files.', type: "failure" });
            return;
        }
        try {

            const binaryData = await readFileAsBinary(file);

            // console.log(234234, binaryData, credentialSelected);

            // const clientId = SOCKET.id || '';

            // await setToLocalStorage(storageKeys.SOCKET_ID, clientId)
            const fileLabel = file?.name || "Not available"
            const payload = {
                file: binaryData,
                fileName: fileLabel
            };


            setUploadedFileName(fileLabel);
            setUploadedFile(file);
            await wait(500);
            const response = await uploadCsvFile(token, payload, credentialSelected);
            setLoading(false);
            console.log(23423427, response, credentialSelected)
            if (response?.data) {
                setMessage({ type: 'success', message: 'File uploaded successfully' });
                localStorage.setItem('request-id', response?.data)
                window.location.href = '/#data-table-step1'
                await handleCsvFileData(response.data)
            }
            setLoading(false);
        } catch (err) {
            const error = err as Error
            setLoading(false);
            console.log('ERROR - bulk issuance::', err);
            setMessage({ message: error.message, type: 'failure' })

        }
    };

    const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        if (credentialSelected) {
            const file = e.dataTransfer.files[0];
            if (file) {
                handleFileUpload(file);
            }
        }
    };

    const handleCsvFileData = async (requestId: any) => {
        const token = localStorage.getItem("session") || "";
        setLoading(true);
        if (requestId) {
            try {
                const response = await getCsvFileData(
                    token,
                    requestId
                );
                console.log(324234, response);
                if (response?.statusCode === 200) {
                    setLoading(false);
                    setCsvData(response?.data?.response?.data);
                }
            } catch (err) {
                const error = err as Error
                setLoading(false);
                setMessage({ message: error.message, type: 'failure' })
            }
        }
        setLoading(false);
    };

    const handleDragOver = (e: { preventDefault: () => void }) => {
        e.preventDefault();
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files.length > 0 && e.target.files[0];

        if (file) {
            handleFileUpload(file);
        }
    };

    useIsomorphicLayoutEffect(() => {
        console.log(876876, message);
        if (message?.message) {
            const option: {type: TypeOptions} = {
                type: message.type === "failure" ? 'error' : 'success'
            }
            toast(message.message, option)
        }
    }, [message])

    const afterFirstStepComplete = () => {
        localStorage.setItem('csv-data', JSON.stringify(csvData))
        stepChange(1);
        window.location.href = '/#'
    }

    const selectedCred: any = credentialOptions && credentialOptions.length > 0 && credentialOptions.find(
        (item: { value: string }) =>
            item.value &&
            item.value === credentialSelected,
    );

    const selectedCredAttributes = selectedCred?.schemaAttributes && JSON.parse(selectedCred?.schemaAttributes)

    console.log("credentialOptions", credentialOptions);
    return (
        <div className="section-from-right ">
            <div className='flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'>
                <div className='w-full'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-6">
                        <div className="">
                            <div className=''>
                                <div className="search-dropdown text-blue-800 dark:text-blue-800">
                                    <Select placeholder="Select Certificate"
                                        className="basic-single "
                                        classNamePrefix="select"
                                        isDisabled={false}
                                        isClearable={true}
                                        isRtl={false}
                                        isSearchable={true}
                                        name="color"
                                        options={credentialOptions}
                                        onChange={(value: any) => {
                                            console.log(23423423, value)
                                            setCredentialSelected(value?.value ?? "");
                                        }}
                                    />
                                </div>
                                {
                                    credentialOptions?.length === 0 && <RestartDemo />
                                }
                            </div>
                            <div className="mt-4">
                                {credentialSelected && (
                                    <div className='flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 p-4'>
                                        <div>
                                            <p className="text-black dark:text-white">
                                                {' '}
                                                <span className="font-semibold">
                                                    Certificate:
                                                </span>{' '}
                                                {selectedCred?.credentialDefinition}
                                            </p>
                                            <span className='text-black dark:text-white font-semibold'>Attributes:</span>
                                            <div className="flex flex-wrap overflow-hidden">
                                                {selectedCredAttributes?.length > 0 && selectedCredAttributes.map(
                                                    (element: any) => (
                                                        <div key={element.attributeName}>
                                                            <span className="m-1 bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                                                {element.attributeName}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-center items-center pb-6">
                                <button
                                    id="signinsubmit"
                                    type="submit"
                                    className={`py-2 px-4 rounded-md inline-flex items-center border text-2xl ${!credentialSelected
                                        ? 'opacity-50 text-gray-700 dark:text-gray-400 border-gray-700'
                                        : 'text-blue-800 dark:text-white border-blue-800 bg-white-700'
                                        }`}
                                    style={{ height: '2.4rem', minWidth: '2rem' }}
                                    disabled={!credentialSelected}
                                    onClick={DownloadSchemaTemplate}
                                >
                                    <svg
                                        className={`h-6 w-6 pr-2 ${!credentialSelected
                                            ? 'text-gray-700 dark:text-gray-400'
                                            : 'text-blue-800 hover:text-white'
                                            }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                    <span className='text-sm'>Download Template</span>
                                </button>
                            </div>
                            <div role="input" onDrop= {handleDrop} onDragOver={handleDragOver}>
                                <div className="flex justify-center items-center h-full ">
                                    <div>
                                        <label
                                            htmlFor="csv-file"
                                            className={`flex flex-col items-center justify-center w-40 h-36 border-2  border-dashed rounded-md cursor-pointer bg-white dark:bg-gray-700 dark-border-gray-600 ${!credentialSelected
                                                ? 'border-gray-200'
                                                : 'border-blue-800 dark:border-white'
                                                }`}
                                        >
                                            <div
                                                className={`flex flex-col items-center justify-center pt-5 pb-6 ${!credentialSelected
                                                    ? 'opacity-50 text-gray-700 dark:text-gray-700 border-gray-700'
                                                    : 'text-blue-800 dark:text-white dark:border-white border-blue-800'
                                                    }`}
                                            >
                                                <svg
                                                    className={`h-12 w-12 ${!credentialSelected
                                                        ? 'text-gray-700 dark:text-gray-400'
                                                        : 'dark:text-white text-blue-800'
                                                        }`}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                                    <polyline points="16 6 12 2 8 6" />
                                                    <line x1="12" y1="2" x2="12" y2="15" />
                                                </svg>
                                                <p
                                                    className={`mb-2 mt-2 text-sm ${!credentialSelected
                                                        ? ' text-gray-500 dark:text-gray-400'
                                                        : 'text-blue-800 dark:text-white'
                                                        }`}
                                                >
                                                    Drag file here
                                                </p>
                                            </div>
                                        </label>
                                        <div className="flex justify-center">
                                            <div className="w-fit">
                                                <label htmlFor="organizationlogo">
                                                    <div
                                                        className={`px-4 py-2 mt-4 rounded-md text-center border text-white bg-blue-800 cursor-pointer ${!credentialSelected
                                                            ? 'opacity-50 bg-gray-400 dark:bg-transparent dark:text-gray-400 border-gray-400'
                                                            : 'bg-blue-800 hover:bg-blue-800 dark:border-blue-800'
                                                            }`}
                                                    >
                                                        Choose file
                                                    </div>
                                                    <input
                                                        disabled={!credentialSelected}
                                                        type="file"
                                                        accept=".csv"
                                                        name="file"
                                                        className="hidden"
                                                        id="organizationlogo"
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
                                                        title=""
                                                        onClick={(event: any) => {
                                                            event.target.value = null
                                                        }} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between pb-8 lg:pl-6 lg:pb-12 w-full">
                                    {uploadedFileName && (
                                        <div
                                            className={`${!credentialSelected ? 'opacity-50' : ''
                                                } flex justify-between items-center bg-gray-100 dark:bg-gray-700 gap-2 p-4 text-sm rounded-lg mt-4`}
                                        >
                                            <p className="text-gray-700 dark:text-white px-2 word-break-word truncate">
                                                {uploadedFileName}
                                            </p>
                                            <button
                                                onClick={handleDiscardFile}
                                                className="dark:text-white cursor-pointer shrink-0"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                    {/* {uploadMessage !== null && (
                                        <AlertComponent
                                            message={uploadMessage.message}
                                            type={uploadMessage?.type || "success"}
                                            onAlertClose={clearError}
                                        />
                                    )} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="data-table-step1">
                {(csvData && csvData.length > 0 || loading) && (
                    <div className='min-h-[250px] mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow md:flex-row dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'>
                        <div className="overflow-x-auto rounded-lg">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden shadow sm:rounded-lg">
                                    {csvData && csvData.length > 0 ?
                                        (
                                            <div className="pb-4 mb-2">

                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                                        <tr>
                                                            {csvData.length > 0 &&
                                                                Object.keys(csvData[0]).map((header, index) => (
                                                                    <th
                                                                        key={index}
                                                                        className={`p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white`}
                                                                    >
                                                                        {header}
                                                                    </th>
                                                                ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-800">
                                                        {csvData &&
                                                            csvData.length > 0 &&
                                                            csvData.map((row, rowIndex) => (
                                                                <tr
                                                                    key={rowIndex}
                                                                    className={`${rowIndex % 2 !== 0
                                                                        ? 'bg-gray-50 dark:bg-gray-700'
                                                                        : ''
                                                                        }`}
                                                                >
                                                                    {Object.values(row).map((cell, cellIndex) => (
                                                                        <td
                                                                            key={cellIndex}
                                                                            className={`p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white align-middle	`}
                                                                        >
                                                                            {cell}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )
                                        :
                                        loading && (csvData && csvData.length <= 0) ?
                                            <div role="status" className='flex justify-center items-center h-full w-full'>
                                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            :
                                            <></>
                                    }
                                </div>
                            </div>
                        </div>
                        {/* {currentPage.total > 1 && (
                        <div className="flex items-center justify-end mb-4">
                            <Pagination
                                currentPage={currentPage.pageNumber}
                                onPageChange={onPageChange}
                                totalPages={currentPage.total}
                            />
                        </div>
                    )} */}
                    </div>
                )}
            </div>

            <div className='mt-6 flex justify-end fixed bottom-8 right-4'>
                <button className={`flex items-center px-4 py-2 rounded-md text-center border text-white bg-blue-800 cursor-pointer ${!credentialSelected
                    ? 'opacity-50 bg-gray-400 dark:bg-transparent dark:text-gray-400 border-gray-400'
                    : 'bg-blue-800 hover:bg-blue-800 dark:border-blue-800'
                    }`}
                    disabled={!(credentialSelected && (csvData && csvData?.length > 0))}
                    onClick={() => afterFirstStepComplete()}
                >
                    Next
                    <svg className='ml-2 shrink-0' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 30 20" fill="none"><path d="M29.8369 10.763C29.9991 10.3984 30.0415 9.99721 29.9588 9.61015C29.876 9.22309 29.6717 8.86759 29.3719 8.58861L20.7999 0.609018C20.6022 0.418485 20.3657 0.26651 20.1043 0.161959C19.8428 0.0574089 19.5616 0.00237707 19.2771 7.53215e-05C18.9925 -0.00222642 18.7103 0.0482475 18.447 0.148553C18.1836 0.248858 17.9443 0.396985 17.7431 0.584292C17.5419 0.771598 17.3828 0.994332 17.275 1.2395C17.1673 1.48466 17.1131 1.74735 17.1155 2.01223C17.118 2.27711 17.1771 2.53888 17.2894 2.78227C17.4018 3.02566 17.565 3.24578 17.7697 3.4298L22.6857 8.0061H2.14299C1.57464 8.0061 1.02956 8.21628 0.627668 8.59039C0.225779 8.96451 0 9.47192 0 10.001C0 10.5301 0.225779 11.0375 0.627668 11.4116C1.02956 11.7857 1.57464 11.9959 2.14299 11.9959H22.6857L17.7718 16.5702C17.5672 16.7542 17.4039 16.9743 17.2916 17.2177C17.1793 17.4611 17.1202 17.7229 17.1177 17.9878C17.1152 18.2526 17.1694 18.5153 17.2772 18.7605C17.3849 19.0057 17.5441 19.2284 17.7453 19.4157C17.9465 19.603 18.1858 19.7511 18.4491 19.8514C18.7125 19.9518 18.9947 20.0022 19.2792 19.9999C19.5638 19.9976 19.845 19.9426 20.1064 19.838C20.3679 19.7335 20.6043 19.5815 20.802 19.391L29.374 11.4114C29.5725 11.2257 29.7298 11.0054 29.8369 10.763Z" fill="white"></path></svg>
                </button>
            </div>
        </div>
    )
}

export default UploadRecords