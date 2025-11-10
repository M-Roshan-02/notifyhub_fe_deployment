"use client"
import { Badge, Table, Button } from "flowbite-react"
import CardBox from "../../shared/CardBox"
import userimg1 from "/public/images/profile/user-3.jpg";
import userimg2 from "/public/images/profile/user-5.jpg";
import userimg3 from "/public/images/profile/user-6.jpg";
import userimg4 from "/public/images/profile/user-7.jpg";
import userimg5 from "/public/images/profile/user-8.jpg";
import Image from "next/image";
import Link from "next/link";

interface Performer {
    key: string;
    profileImg: any;
    username: string;
    designation: string;
    project: string;
    priority: string;
    color: string;
    budget: string;
}

export const TopPerformer = () => {

    const PerformersData: Performer[] = [
        {
            key:"performerData1",
            profileImg:userimg1,
            username:"Rajesh Kumar",
            designation:"Web Designer",
            project:"Review marketing plan",
            priority:"Low",
            color:"lightprimary",
            budget:"19 Sep 2025"
        },
        {
            key:"performerData2",
            profileImg:userimg2,
            username:"Priya Sharma",
            designation:"Web Developer",
            project:"Update website content",
            priority:"Medium",
            color:"lightwarning",
            budget:"25 Sep 2025"
        },
        {
            key:"performerData3",
            profileImg:userimg3,
            username:"Anil Verma",
            designation:"Web Manager",
            project:"Fix login issue",
            priority:"High",
            color:"lightwarning",
            budget:"22 Sep 2025"
        },
        {
            key:"performerData4",
            profileImg:userimg4,
            username:"Kavita Singh",
            designation:"Project Manager",
            project:"Submit timesheet",
            priority:"Low",
            color:"lightsuccess",
            budget:"20 Sep 2025"
        },
        {
            key:"performerData5",
            profileImg:userimg5,
            username:"Manoj Patel",
            designation:"Content Writer",
            project:"Client meeting preparation",
            priority:"High",
            color:"lighterror",
            budget:"18 Sep 2025"
        },
    ]

    const renderTableRows = (data: Performer[]) => (
        <Table.Body className="divide-y divide-border dark:divide-darkborder">
            {data.map((item, index) => (
                <Table.Row key={index}>
                    <Table.Cell className="whitespace-nowrap ps-0 md:min-w-auto min-w-[200px]">
                        <div className="flex gap-3 items-center">
                            <Image
                                src={item.profileImg}
                                alt="icon"
                                className="h-8 w-8 rounded-full"
                            />
                            <div>
                                <h6 className="text-sm font-semibold mb-1">{item.username}</h6>
                                <p className="text-xs font-normal text-bodytext dark:text-darklink">
                                    {item.designation}
                                </p>
                            </div>
                        </div>
                    </Table.Cell>
                    <Table.Cell>
                        <p className="text-link dark:text-darklink text-sm w-fit">
                            {item.project}
                        </p>
                    </Table.Cell>
                    <Table.Cell>
                        <Badge 
                            color={`${item.color}`} 
                            className="text-sm rounded-md py-1.1 px-2 w-11/12 justify-center" 
                        >
                            {item.priority}
                        </Badge>
                    </Table.Cell>
                    <Table.Cell>
                        <p className="dark:text-darklink text-link text-sm">
                            {item.budget}
                        </p>
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    );

    const renderTable = (data: Performer[]) => (
        <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="overflow-x-auto">
                        <Table>
                            <Table.Head>
                                <Table.HeadCell className="text-sm font-semibold ps-0">
                                    Assigned
                                </Table.HeadCell>
                                <Table.HeadCell className="text-sm font-semibold">
                                    Reminders
                                </Table.HeadCell>
                                <Table.HeadCell className="text-sm font-semibold">
                                    Priority
                                </Table.HeadCell>
                                <Table.HeadCell className="text-sm font-semibold">
                                    Due Date
                                </Table.HeadCell>
                            </Table.Head>
                            {renderTableRows(data)}
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <CardBox>
            <div className="sm:flex items-center justify-between mb-6">
                <div>
                    <h5 className="card-title">Reminder Chart</h5>
                </div>
                <div className="sm:mt-0 mt-4">
                    <Link href="/apps/invoice/list">
                        <Button color="blue" size="sm" className="flex items-center justify-center rounded-md gap-3 !text-sm text-start leading-[normal] font-normal text-link dark:text-darklink dark:hover:text-primary !text-white  hover:text-white bg-primary mb-0.5 hover:bg-primary hover:text-whit">
                            View All
                        </Button>
                    </Link>
                </div>
            </div>
            {/* Table (only a few items preview) */}
            {renderTable(PerformersData.slice(0, 3))}
        </CardBox>
    )
}