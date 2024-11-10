import React from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { BsCircleHalf } from "react-icons/bs";

const vocabSets = [
    { name: 'A0 - Từ Vựng Cho Người Mất Gốc', learned: 2, total: 166, needPractice: 0 },
    { name: 'Xin chào và tạm biệt', learned: 2, total: 16, needPractice: 0 },
    { name: 'Bộ từ vựng số 3', learned: 5, total: 20, needPractice: 3 },
    { name: 'Bộ từ vựng số 4', learned: 10, total: 50, needPractice: 5 },
    { name: 'Bộ từ vựng số 5', learned: 7, total: 25, needPractice: 1 },
    { name: 'Bộ từ vựng số 6', learned: 8, total: 30, needPractice: 2 },
    { name: 'Bộ từ vựng số 7', learned: 15, total: 40, needPractice: 4 },
    { name: 'Bộ từ vựng số 8', learned: 20, total: 45, needPractice: 5 },
    { name: 'Bộ từ vựng số 9', learned: 3, total: 10, needPractice: 1 },
    { name: 'Bộ từ vựng số 10', learned: 12, total: 30, needPractice: 6 },
    { name: 'Bộ từ vựng số 5', learned: 7, total: 25, needPractice: 1 },
    { name: 'Bộ từ vựng số 6', learned: 8, total: 30, needPractice: 2 },
    { name: 'Bộ từ vựng số 7', learned: 15, total: 40, needPractice: 4 },
    { name: 'Bộ từ vựng số 8', learned: 20, total: 45, needPractice: 5 },
    { name: 'Bộ từ vựng số 9', learned: 3, total: 10, needPractice: 1 },
    { name: 'Bộ từ vựng số 10', learned: 12, total: 30, needPractice: 6 },
];

function Page() {
    return (
        <div className='font-Poppins h-screen flex flex-col relative'>
            {/* Header */}
            <header className='bg-[#149043] flex items-center gap-6 py-3 pl-4'>
                <IoIosArrowBack className='text-white' size={30} />
                <div className='flex gap-4 items-center'>
                    <div className="relative flex items-center justify-center w-[4.5rem] h-[4.5rem]">
                        <div className="absolute w-full h-full rounded-full flex items-center justify-center bg-[conic-gradient(rgb(34,197,94)_0%,rgb(34,197,94)_30%,rgb(26,161,76)_30%,rgb(26,161,76)_100%)]">
                            <div className="bg-[#149043] w-[85%] h-[85%] rounded-full flex items-center justify-center">
                                <img className='rounded-full w-12 h-12' src="https://voca-land.sgp1.cdn.digitaloceanspaces.com/-1/1653745932435/515e21703794949d1d790a8e9c71bbf6339d05276fe6c6f49b1507f0d693f572.png" alt="User avatar" />
                            </div>
                        </div>
                    </div>
                    <div className='text-xs font-medium space-y-3'>
                        <div className='text-white text-lg font-medium'>A0 - Từ Vựng Cho Người Mất Gốc</div>
                        <div className='bg-white px-2 py-2 rounded-3xl inline-flex gap-3 text-[#048AE6]'>
                            <div className='flex gap-1'><span className='rounded-[50%] w-4 h-4 bg-[#048AE6] flex items-center justify-center text-white'><FaCheck /></span> 2/166 đã học</div>
                            <span className='text-[#41c46f]'>0 cần luyện tập</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Vocabulary List */}
            <section className='flex-grow overflow-y-auto p-4 px-20'>
                <div className='grid grid-cols-5 gap-16'>
                    {vocabSets.map((set, index) => (
                        <div key={index} className='flex flex-col items-center gap-2 p-3 rounded-lg transform transition duration-200 hover:scale-105 hover:bg-gray-100'>
                            <div className="relative flex items-center justify-center w-[4.9rem] h-[4.9rem]">
                                <div className="absolute w-full h-full rounded-full flex items-center justify-center bg-[conic-gradient(rgb(34,197,94)_0%,rgb(34,197,94)_30%,rgb(165,227,187)_30%,rgb(165,227,187)_100%)]">
                                    <div className="bg-[#149043] w-[85%] h-[85%] rounded-full flex items-center justify-center">
                                        <img className='rounded-full w-16 h-16' src="https://voca-land.sgp1.cdn.digitaloceanspaces.com/-1/1653745932435/515e21703794949d1d790a8e9c71bbf6339d05276fe6c6f49b1507f0d693f572.png" alt="User avatar" />
                                    </div>
                                </div>
                            </div>
                            <div className='text-center'>
                                <div className='font-medium'>{set.name}</div>
                                <div className='text-xs font-medium bg-white px-2 py-1 rounded-3xl inline-flex gap-3 text-[#048AE6]'>
                                    <div className='flex gap-1'><span className='rounded-full w-4 h-4 bg-[#048AE6] flex items-center justify-center text-white'><FaCheck /></span> {set.learned}/{set.total}</div>
                                    <div className='flex gap-1 text-[#FF9900]'><span className='rounded-full w-4 h-4 bg-[#FF9900] flex items-center justify-center text-white'><BsCircleHalf /></span> {set.needPractice} cần luyện tập</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Floating Buttons */}
            <button className='absolute bottom-6 left-1/4 bg-[#149043] text-white px-6 py-2 rounded-full text-sm font-medium'>Học từ mới</button>
            <button className='absolute bottom-6 right-1/4 bg-[#FF9900] text-white px-6 py-2 rounded-full text-sm font-medium'>Luyện tập</button>
        </div>
    );
}

export default Page;
