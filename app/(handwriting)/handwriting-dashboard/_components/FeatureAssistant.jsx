"use client"
import { useUser } from '@stackframe/stack'
import React ,{useState} from 'react'
import { Button } from '@/components/ui/button';
import { CoachingOptions, HandWritten } from '@/services/Options';
import  Image  from 'next/image';
import { BlurFade } from '@/components/magicui/blur-fade';
import { useRouter } from 'next/navigation';
import SelectModule from './SelectModule';


function FeatureAssistant() {
    const user = useUser();
    const [openDialog, setOpenDialog] = useState(false);
    const router=useRouter();
    const handleCardClick=(path)=>{
        if(path){
            router.push(path)
        }else{
setOpenDialog(!openDialog)
        }
    }
return (
    <div>
        <div className='flex justify-around mt-2 items-center'>
            <div className=''>
                <h2 className='font-medium text-gray-500'>My Workspace</h2>
                <h2 className='text-3xl font-bold'>Welcome back, {user?.displayName}</h2>
            </div>
            <Button className='text-white'>Profile</Button>
        </div>
        <div className='grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-10 m-10'>
            <div></div>
        {HandWritten.map((option,index)=>(
            <BlurFade key ={option.icon} delay={0.25 + index * 0.05} inView>
                <div onClick={()=>handleCardClick(option.path)} key={index} className='p-3 bg-gray-200 rounded-3xl flex flex-col justify-center items-center'>
                        <div key={index} className='flex flex-col justify-center items-center'>
                            <Image src={option.icon} alt={option.name}
                            width={150}
                            height={150}
                            className='h-[50px] w-[50px] hover:rotate-12 cursor-pointer transition-all'
                            />
                            <h2 className='mt-2'>{option.name}</h2>
                        </div>
                    
                </div>
            </BlurFade>
        ))}
        <div></div>
        </div>
        <SelectModule  openDialog={openDialog} setOpenDialog={setOpenDialog}/>
    </div>
)
}

export default FeatureAssistant
