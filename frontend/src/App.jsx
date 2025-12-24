import { useState } from 'react'
import TransferPortal from './components/TransferPortal'
import TransactionHistory from './components/TransactionHistory'

function App() {
    // Hardcoded current user for demo - in real app would be from auth
    const [currentUser] = useState({ id: 1, name: 'Alice' })

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Bank of Antigravity</h1>
                    <p className="text-gray-500 mt-2">Welcome back, {currentUser.name}</p>
                </header>

                <div className="grid gap-8 md:grid-cols-2">
                    <div className="md:col-span-2 lg:col-span-1">
                        <TransferPortal senderId={currentUser.id} />
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                        {/* Placeholder for future expansion or stats */}
                        <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg h-full flex flex-col justify-center items-center">
                            <h2 className="text-2xl font-bold mb-2">Secure Banking</h2>
                            <p className="opacity-90 text-center">Your transactions are secured by Spring Transaction Management.</p>
                        </div>
                    </div>
                </div>

                <TransactionHistory userId={currentUser.id} />
            </div>
        </div>
    )
}

export default App
