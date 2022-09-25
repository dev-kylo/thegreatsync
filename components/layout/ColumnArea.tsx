
type ColumnAreaProps = {
    children: React.ReactNode;
}

const ColumnArea = ({ children }: ColumnAreaProps) => (
    <div className="relative h-full" style={{ minHeight: '36rem' }}>
        <div className="absolute inset-0 rounded-lg border-2 border-dashed border-gray-200">
            {children}
        </div>
    </div>
);

export default ColumnArea;