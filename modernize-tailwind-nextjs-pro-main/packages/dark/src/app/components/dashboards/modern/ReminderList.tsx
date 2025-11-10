"use client"
import { Badge, Table, Button } from "flowbite-react"
import CardBox from "../../shared/CardBox"
import { Reminder } from "@/app/(DashboardLayout)/types/apps/reminder";
import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";
import Link from "next/link";

export const ReminderList = () => {

    const { data, error } = useSWR<Reminder[]>("/api/reminders", getFetcher);

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    const renderTableRows = (data: Reminder[]) => (
        <Table.Body className="divide-y divide-border dark:divide-darkborder">
            {data.map((item, index) => (
                <Table.Row key={index}>
                    <Table.Cell className="whitespace-nowrap ps-0 md:min-w-auto min-w-[200px]">
                        <h6 className="text-sm font-semibold mb-1">{item.title}</h6>
                    </Table.Cell>
                    <Table.Cell>
                        <p className="text-link dark:text-darklink text-sm w-fit">
                            {item.description}
                        </p>
                    </Table.Cell>
                    <Table.Cell>
                        <Badge 
                            color={`${item.active ? "success" : "failure"}`} 
                            className="text-sm rounded-md py-1.1 px-2 w-11/12 justify-center" 
                        >
                            {item.active ? "Active" : "Inactive"}
                        </Badge>
                    </Table.Cell>
                    <Table.Cell>
                        <p className="dark:text-darklink text-link text-sm">
                            {item.reminderEndDate}
                        </p>
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    );

    const renderTable = (data: Reminder[]) => (
        <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="overflow-x-auto">
                        <Table>
                            <Table.Head>
                                <Table.HeadCell className="text-sm font-semibold ps-0">
                                    Title
                                </Table.HeadCell>
                                <Table.HeadCell className="text-sm font-semibold">
                                    Description
                                </Table.HeadCell>
                                <Table.HeadCell className="text-sm font-semibold">
                                    Status
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
                    <h5 className="card-title">Reminder List</h5>
                </div>
                <div className="sm:mt-0 mt-4">
                    <Link href="/apps/invoice/list">
                        <Button color="blue" size="sm" className="flex items-center justify-center rounded-md gap-3 !text-sm text-start leading-[normal] font-normal text-link dark:text-darklink dark:hover:text-primary !text-white  hover:text-white bg-primary mb-0.5 hover:bg-primary hover:text-whit">
                            View All
                        </Button>
                    </Link>
                </div>
            </div>
            {renderTable(data.slice(0, 3))}
        </CardBox>
    )
}