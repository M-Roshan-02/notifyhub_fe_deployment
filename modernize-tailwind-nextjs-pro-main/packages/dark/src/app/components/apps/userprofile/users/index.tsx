"use client"
import UsersCard from '@/app/components/apps/userprofile/users/UsersCard';
import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner'
import React from 'react'
import { UserDataProvider } from '@/app/context/UserDataContext/index';

const UsersApp = () => {
  return (
    <>
      <UserDataProvider>
        <div className="grid grid-cols-12 gap-6">
          {/* Banner */}
          <div className="col-span-12">
            <ProfileBanner />
          </div>
          {/* UsersCard */}
          <div className="col-span-12">
            <UsersCard />
          </div>
        </div>
      </UserDataProvider>
    </>
  )
}

export default UsersApp
