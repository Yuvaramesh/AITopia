'use client'
import { UserContext } from '@/app/_context/UserContext'; // adjust your import
import { Button } from '@/components/ui/button';
import { getAllDiscussionRooms } from '@/services/api';
import { CoachingOptions } from '@/services/Options';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'

function Feedback() {
  const { userData } = useContext(UserContext);
  const [discussionRoomList, setDiscussionRoomList] = useState([]);

  useEffect(() => {
    if (userData) {
      getAllDiscussionRooms(userData._id)
        .then(result => {
          console.log('Discussion Rooms', result);
          setDiscussionRoomList(result);
        })
        .catch(err => console.error(err));
    }
  }, [userData]);

  const GetAbstractImages = (option)=>{
    const coachingOption = CoachingOptions.find((item) => item.name == option);
    return coachingOption?.abstract??"/ab1.png";
  
  }
    return (
      <div>
          <h2 className='font-bold text-xl'>Feedback</h2>
  
          {discussionRoomList?.length==0&&<h2 className='text-gray-400'>You don't have any Previous Feedback</h2>}
          <div className='mt-5'>
            {discussionRoomList.map((item, index) =>(item.coachingOptions=='Mock Interview'||item.coachingOptions=='Ques Ans Prep')&&
             (
              <div key={index} className='border-b-[1px] pb-3 mb-4 group flex justify-between items-center cursor-pointer'>
                <div className='flex gap-7 items-center'>
                  <Image src={GetAbstractImages(item.coachingOptions)} alt='abstract'
                  width={50} height={50} className='rounded-full h-[50px] w-[50px] '/>
                  <div>
                    <h2 className='font-bold'>{item.topic}</h2>
                    <h2 className='text-gray-400'>{item.coachingOptions}</h2>
                    <h2 className='text-gray-400 text-sm'>{moment( item._creationTime).fromNow()}</h2>
                  </div>
                </div>
                <Link href={'/view-summery/' + item._id}>
                <Button variant ='outline' className=' invisible group-hover:visible' >View Feedback</Button>
                </Link>
              </div>
            ))}
          </div>
      </div>
    )
}
export default Feedback
