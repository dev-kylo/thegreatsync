
type ColumnAreaProps = {
    children: React.ReactNode;
}

//style={{ minHeight: '85vh' }}

const ColumnArea = ({ children }: ColumnAreaProps) => (
    <div className="h-full">
        <div className="rounded-lg bg-[#111111] min-h-[70vh] border-4 border-r-4 border-secondary_lightblue overflow-hidden">
            {children}
        </div>
    </div>
);

export default ColumnArea;