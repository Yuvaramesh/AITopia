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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UserContext } from '@/app/_context/UserContext';
import { createNewRoom } from '@/services/api';

function UserInputDialog({ children, CoachingOptions }) {
    const [topic, setTopic] = useState();
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const router = useRouter();
    const { userData } = useContext(UserContext);

    const languageOptions = [
        { code: 'en-US', label: 'English' },
        { code: 'ta-IN', label: 'தமிழ்' }
    ];

    const onClickNext = async () => {
        setLoading(true);
        try {
            const result = await createNewRoom({
                topic: topic,
                coachingOptions: CoachingOptions?.name,
                expertName: "kore",
                uid: userData?._id,
                language: selectedLanguage
            });
            router.push('/discussion-room/' + result._id);
        } catch (error) {
            console.error("Error creating discussion room:", error);
        }
        setLoading(false);
        setOpenDialog(false);
    }
    
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{CoachingOptions.name}</DialogTitle>
                    <DialogDescription asChild>
                        <div className='mt-3'>
                            <h2 className='text-black'>Enter a Topic to master your skills in {CoachingOptions.name}</h2>
                            <Textarea 
                              placeholder="Enter your Topic here..." 
                              className="mt-2" 
                              onChange={(e) => setTopic(e.target.value)} 
                            />
                            <div className='space-y-3 mt-5'>
                                <h2 className='text-black'>Select Language</h2>
                                <div className='flex gap-2'>
                                    {languageOptions.map((lang) => (
                                        <Button
                                            key={lang.code}
                                            variant={selectedLanguage === lang.code ? 'default' : 'outline'}
                                            onClick={() => setSelectedLanguage(lang.code)}
                                            className='rounded-full'
                                        >
                                            {lang.label}
                                        </Button>
                                    ))}
                                </div>
                                <h2 className='text-black'>Coaching Assistant</h2>
                                <div className='flex flex-col items-center justify-center mt-3'>
                                    <Image 
                                      src="/ai.gif" 
                                      alt="Kore AI"
                                      width={100}
                                      height={100}
                                      className="h-[80px] w-[80px] object-cover rounded-full"
                                    />
                                    <h2 className='text-center font-bold mt-2'>Kore AI</h2>
                                </div>
                                <div className='flex gap-5 justify-end mt-5'>
                                    <DialogClose asChild>
                                        <Button variant={'ghost'}>Cancel</Button>
                                    </DialogClose>
                                    <Button disabled={!topic || loading} onClick={onClickNext}>
                                        {loading && <LoaderCircle className='animate-spin' />}
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default UserInputDialog;