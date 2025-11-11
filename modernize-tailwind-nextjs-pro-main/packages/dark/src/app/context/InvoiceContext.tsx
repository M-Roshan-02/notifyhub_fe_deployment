'use client'
import React, { createContext, useState, useEffect } from 'react';
import { Reminder } from '@/types/apps/invoice';
import useSWR, { mutate } from 'swr';
import { getFetcher, postFetcher, putFetcher, deleteFetcher } from '@/app/api/globalFetcher';

interface InvoiceContextType {
    invoices: Reminder[];
    loading: boolean;
    error: Error | null;
    addInvoice: (newInvoice: Reminder) => void;
    updateInvoice: (updatedInvoice: Reminder) => void;
    deleteInvoice: (invoiceId: string) => void;
}

export const InvoiceContext = createContext<InvoiceContextType | any>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [invoices, setInvoices] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { data: invoiceData, isLoading: isInvoiceLoading, error: invoiceError } = useSWR("/api/invoice", getFetcher);

    useEffect(() => {
        if (invoiceData) {
            setInvoices(invoiceData.data);
            setLoading(isInvoiceLoading);
        } else if (invoiceError) {
            setLoading(isInvoiceLoading);
            setError(invoiceError);
        } else {
            setLoading(isInvoiceLoading);
        }
    }, [invoiceData, invoiceError, isInvoiceLoading]);

    const addInvoice = async (newInvoice: Reminder) => {
        try {
            await mutate('/api/invoice', postFetcher('/api/invoice', newInvoice), {
                optimisticData: [...invoices, newInvoice],
                rollbackOnError: true,
            });
        } catch (error) {
            console.error('Error adding invoice:', error);
        }
    };

    const updateInvoice = async (updatedInvoice: Reminder) => {
        try {
            await mutate('/api/invoice', putFetcher('/api/invoice', updatedInvoice), {
                optimisticData: invoices.map(i => i.id === updatedInvoice.id ? updatedInvoice : i),
                rollbackOnError: true,
            });
        } catch (error) {
            console.error('Error updating invoice:', error);
        }
    };

    const deleteInvoice = async (invoiceId: string) => {
        try {
            await mutate('/api/invoice', deleteFetcher('/api/invoice', { id: invoiceId }), {
                optimisticData: invoices.filter(i => i.id !== invoiceId),
                rollbackOnError: true,
            });
        } catch (error) {
            console.error('Error deleting invoice:', error);
        }
    };

    return (
        <InvoiceContext.Provider value={{ invoices, loading, error, addInvoice, updateInvoice, deleteInvoice }}>
            {children}
        </InvoiceContext.Provider>
    );
};