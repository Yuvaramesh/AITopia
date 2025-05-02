'use client'
import { UserContext } from '@/app/_context/UserContext';
import { Button } from '@/components/ui/button';
import { CoachingOptions } from '@/services/Options';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { getAllDiscussionRooms } from '@/services/api';

function History() {
  const { userData } = useContext(UserContext);
  const [discussionRoomList, setDiscussionRoomList] = useState([]);

  useEffect(() => {
    console.log("User data:", userData);
    if (userData && userData._id) {
      GetDiscussionRooms();
    }
  }, [userData]);

  const GetDiscussionRooms = async () => {
    try {
      const result = await getAllDiscussionRooms(userData._id);
      console.log("Discussion Rooms", result);
      setDiscussionRoomList(result);
    } catch (error) {
      console.error("Error fetching discussion rooms:", error);
    }
  }

  const GetAbstractImages = (option) => {
    const coachingOption = CoachingOptions.find((item) => item.name === option);
    return coachingOption?.abstract ?? "/ab1.png";
  }

  return (
    <div>
        <h2 className='font-bold text-xl'>Your Previous Lectures</h2>
        {discussionRoomList?.length === 0 && <h2 className='text-gray-400'>You don't have any Previous lectures</h2>}
        <div className='mt-5'>
          {discussionRoomList.map((item, index) => (
            (item.coachingOptions === 'Topic Base Lecture' || item.coachingOptions === 'Learn Language') && (
              <div key={index} className='border-b-[1px] pb-3 mb-4 group flex justify-between items-center cursor-pointer'>
                <div className='flex gap-7 items-center'>
                  <Image 
                    src={GetAbstractImages(item.coachingOptions)} 
                    alt='abstract'
                    width={50} 
                    height={50} 
                    className='rounded-full h-[50px] w-[50px]' 
                  />
                  <div>
                    <h2 className='font-bold'>{item.topic}</h2>
                    <h2 className='text-gray-400'>{item.coachingOptions}</h2>
                    <h2 className='text-gray-400 text-sm'>{moment(item._creationTime).fromNow()}</h2>
                  </div>
                </div>
                <Link href={'/view-summery/' + item._id}>
                  <Button variant='outline' className='invisible group-hover:visible'>View Notes</Button>
                </Link>
              </div>
            )
          ))}
        </div>
    </div>
  )
}

export default History;
