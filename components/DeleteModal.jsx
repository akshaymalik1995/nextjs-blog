
import { useState } from "react";

export default function DeleteModal({ onDelete }) {
    const [showModal, setShowModal] = useState(false);
    function handleDelete() {
        onDelete();
        setShowModal(false);
    }

    return (
        <>
            <button
                onClick={(e) => setShowModal(true)}
                className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
            >
                Delete
            </button>
            <div
                className={`fixed ${
                    !showModal ? "hidden" : ""
                } top-0 left-0 w-full h-screen min-w-32 bg-gray-900/70 flex justify-center items-center`}
            >
                <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
                    <h3 className="text-3xl font-bold mb-4">Are you sure?</h3>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            onClick={(e) => setShowModal(false)}
                            className="btn-light"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn-red"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}