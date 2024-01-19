import React from 'react'

function RestartDemo() {
    return (
        <div className='mt-8'>
            <button className={`flex items-center px-4 py-2 rounded-md text-center border text-white bg-blue-800 hover:opacity-95 cursor-pointer hover:bg-blue-800 dark:border-blue-800`}
                onClick={() => {
                    localStorage.removeItem('request-id');
                    localStorage.removeItem('csv-data');
                    window.location.reload()
                }}
            >
                Restart Demo
            </button>
        </div>
    )
}

export default RestartDemo