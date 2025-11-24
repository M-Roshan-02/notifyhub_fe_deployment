"use client"
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { gql } from '@apollo/client';
import * as ApolloReact from '@apollo/client/react'; // Changed import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import CardBox from "../../shared/CardBox"
import { Badge } from "flowbite-react";
import { Reminder } from "@/types/apps/invoice";

const LIST_REMINDERS_QUERY = gql`
  query Reminders($active: Boolean) {
    reminders(active: $active) {
      id
      title
      description
      reminderStartDate
      reminderEndDate
      active
    }
  }
`;

export const WeeklyStats = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [activeRemindersCount, setActiveRemindersCount] = useState<number>(0);
    const [weeklyRemindersCount, setWeeklyRemindersCount] = useState<number>(0);
    const [todaysRemindersCount, setTodaysRemindersCount] = useState<number>(0);
    const { data, loading, error } = ApolloReact.useQuery(LIST_REMINDERS_QUERY, {
        variables: { active: true }, // Pass the active variable
    });

    useEffect(() => {
        if (data) {
            const fetchedReminders = data.reminders;
            setReminders(fetchedReminders);

            // Calculate active reminders
            const active = fetchedReminders.filter((rem: Reminder) => rem.active);
            setActiveRemindersCount(active.length);

            // Calculate weekly reminders
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of current week (Sunday)
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // End of current week (Saturday)
            endOfWeek.setHours(23, 59, 59, 999);

            const weekly = fetchedReminders.filter((rem: Reminder) => {
                const reminderDate = new Date(rem.reminderStartDate);
                return reminderDate >= startOfWeek && reminderDate <= endOfWeek;
            });
            setWeeklyRemindersCount(weekly.length);

            // Calculate today's reminders
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const todays = fetchedReminders.filter((rem: Reminder) => {
                const reminderDate = new Date(rem.reminderStartDate);
                return reminderDate >= today && reminderDate < tomorrow;
            });
            setTodaysRemindersCount(todays.length);
        }
        if(error) {
            console.error("Error fetching reminders for WeeklyStats:", error);
        }
    }, [data, error]);

    const ChartData: any = {
        series: [
            {
                name: "Weekly Stats",
                color: "var(--color-primary)",
                data: [5, 15, 10, 20], // This is still hardcoded for now, focusing on reminder counts first
              },
        ],
        chart: {
            id: "sparkline3",
            type: "area",
            height: 180,
            sparkline: {
              enabled: true,
            },
            group: "sparklines",
            fontFamily: "inherit",
            foreColor: "#adb0bb",
          },
          stroke: {
            curve: "smooth",
            width: 2,
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 0,
              inverseColors: false,
              opacityFrom: 0.1,
              opacityTo: 0,
              stops: [20, 280],
            },
          },
      
          markers: {
            size: 0,
          },
          tooltip: {
            theme: "dark",
            fixed: {
              enabled: true,
              position: "right",
            },
            x: {
              show: false,
            },
          },
    };
    const SalesData = [
        {
            key:"topSales",
            title:"Active Reminders",
            subtitle:"Submit timesheet",
            badgeColor:"lightprimary",
            bgcolor:"bg-lightprimary text-primary",
            count: activeRemindersCount // Use dynamic count
        },
        {
            key:"topSeller",
            title:"Weekly Reminders",
            subtitle:"Fix login issue",
            badgeColor:"lightsuccess",
            bgcolor:"bg-lightsuccess text-success",
            count: weeklyRemindersCount // Use dynamic count
        },
        {
            key:"topCommented",
            title:"Todays Reminders",
            subtitle:"Client meeting preparation",
            badgeColor:"lighterror",
            bgcolor:"bg-lighterror text-error",
            count: todaysRemindersCount // Use dynamic count
        }
    ]
    return (
        <CardBox>
            <h5 className="card-title">Reminder Stats</h5>
            <p className="card-subtitle">Upcoming tasks this week</p>
            <div className="my-6">
            <Chart
                 options={ChartData}
                 series={ChartData.series}
                 type="area"
                 height="170px"
                 width={"100%"}
               />
            </div>

            {SalesData.map((item)=>{
                return(
                    <div key={item.key} className="flex items-center justify-between mb-7 last:mb-0">
                    <div className="flex items-center gap-3">
                        <div className={`${item.bgcolor} h-10 w-10 flex justify-center items-center rounded-md`}>
                            <Icon icon="tabler:grid-dots" className=' text-xl' />
                        </div>
                        <div>
                            <h6 className="text-base">{item.title}</h6>
                            <p className=" dark:text-darklink ">{item.subtitle}</p>
                        </div>
                    </div>
                    <Badge color={`${item.badgeColor}`} className="py-1.1 rounded-md text-sm" >+{item.count}</Badge>
                </div>
                )
            })}
        </CardBox>


    )
}