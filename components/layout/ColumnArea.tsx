
type ColumnAreaProps = {
    children: React.ReactNode;
}

const ColumnArea = ({ children }: ColumnAreaProps) => (
    <div className="h-full" style={{ minHeight: '86vh' }}>
        <div className="rounded-lg h-full border-2 border-dashed border-gray-200">
            {children}
        </div>
    </div>
);

export default ColumnArea;