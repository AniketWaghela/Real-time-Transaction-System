import { useState } from 'react';

const TransferPortal = ({ senderId }) => {
    const [recipientId, setRecipientId] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch('/api/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderId: senderId,
                    receiverId: recipientId,
                    amount: amount
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Transfer failed');
            }

            setMessage({ type: 'success', text: 'Transfer Successful!' });
            setAmount('');
            setRecipientId('');
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Transfer Funds</h2>

            {message && (
                <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient ID</label>
                    <select
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={recipientId}
                        onChange={(e) => setRecipientId(e.target.value)}
                    >
                        <option value="">Select a recipient</option>
                        {/* Mock users - in real app fetch this list */}
                        <option value="1">Alice (ID: 1)</option>
                        <option value="2">Bob (ID: 2)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                    {loading ? 'Processing...' : 'Send Money'}
                </button>
            </form>
        </div>
    );
};

export default TransferPortal;
