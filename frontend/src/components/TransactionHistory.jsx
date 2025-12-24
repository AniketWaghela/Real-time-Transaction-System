import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const TransactionHistory = ({ userId }) => {
    const [transactions, setTransactions] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

    // Fetch initial history
    useEffect(() => {
        fetch(`/api/history/${userId}`)
            .then(res => res.json())
            .then(data => setTransactions(data))
            .catch(err => console.error("Failed to fetch history", err));
    }, [userId]);

    // WebSocket connection
    useEffect(() => {
        const socket = new SockJS('http://localhost:8081/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            console.log("Connected to WebSocket");
            stompClient.subscribe(`/topic/updates/${userId}`, (message) => {
                const update = JSON.parse(message.body);
                const newTransaction = update.transaction;

                // Prepend new transaction
                setTransactions(prev => [newTransaction, ...prev]);
            });
        }, (err) => {
            console.error("WebSocket connection error:", err);
        });

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [userId]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedTransactions = [...transactions].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('timestamp')}
                            >
                                Date {sortConfig.key === 'timestamp' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('amount')}
                            >
                                Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedTransactions.map((tx) => {
                            const isIncoming = tx.receiverId === userId;
                            return (
                                <tr key={tx.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(tx.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {isIncoming ?
                                            <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">Received</span> :
                                            <span className="text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs">Sent</span>
                                        }
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
                                        {isIncoming ? '+' : '-'} {formatCurrency(tx.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {tx.status}
                                    </td>
                                </tr>
                            );
                        })}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionHistory;
