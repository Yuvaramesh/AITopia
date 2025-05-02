import React, { useContext, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UserContext } from '@/app/_context/UserContext';
import { createNewRoom } from '@/services/api';

function SelectModule({ openDialog,setOpenDialog }) {
    const router = useRouter();
    const { userData } = useContext(UserContext);
    const modules=[
        {
        topic:"lines & curves",
        icon: '/stroke.png',
        path:"/linestrokes-curves"
    },{
        topic:"alphabets",
        icon: '/abc-block.png',
        path:"/letters"
    }
]

    
    
    return (
        <div>
            <Dialog  open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="w-[30%]">
                <DialogHeader>
                    <DialogTitle>Select Module</DialogTitle>
                    <DialogDescription asChild>
                        <div className=' flex mt-3  flex-col gap-y-5'>
                        {modules.map((option,index)=>(
                                        <div onClick={()=>router.push(option.path)} key={index} className='p-5 bg-gray-200 rounded-3xl flex flex-col justify-center items-center'>
                                                <div key={index} className='flex flex-col justify-center items-center'>
                                                    <Image src={option.icon} alt={option.topic}
                                                    width={150}
                                                    height={150}
                                                    className='h-[50px] w-[50px] hover:rotate-12 cursor-pointer transition-all'
                                                    />
                                                    <h2 className='mt-2 capitalize'>{option.topic}</h2>
                                                </div>
                                        </div>
                                ))}</div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
        </div>
    )
}

export default SelectModule;