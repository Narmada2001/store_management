import { MdClose } from 'react-icons/md';

export default function Modal({ title, onClose, children, size = 'md' }) {
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-3xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(2,6,23,0.8)', backdropFilter: 'blur(4px)' }}>
            <div className={`bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full ${sizes[size]} flex flex-col max-h-[90vh]`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 shrink-0">
                    <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg p-1 transition-colors">
                        <MdClose className="text-xl" />
                    </button>
                </div>
                {/* Body */}
                <div className="overflow-y-auto px-6 py-5 flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
