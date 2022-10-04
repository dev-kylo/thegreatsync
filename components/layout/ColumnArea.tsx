
type ColumnAreaProps = {
    children: React.ReactNode;
}

//style={{ minHeight: '85vh' }}

const ColumnArea = ({ children }: ColumnAreaProps) => (
    <div className="h-fit">
        <div className="rounded-lg bg-[#111111]  min-h-[70vh] max-h-[90vh] scrollbar-thin scrollbar-thumb-primary_green border-2 border-r-2 border-secondary_lightblue overflow-y-scroll ">
            {children}
        </div>
    </div>
    // <div className="h-full">
    //     <div className="rounded-lg bg-white min-h-[70vh] border-4 border-r-4 border-secondary_lightblue overflow-hidden">
    //         {children}
    //     </div>
    // </div>
);

export default ColumnArea;