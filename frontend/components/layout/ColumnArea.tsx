
type ColumnAreaProps = {
    children: React.ReactNode;
}

//style={{ minHeight: '85vh' }}

const ColumnArea = ({ children }: ColumnAreaProps) => (
    // <div className=" max-h-full rounded-lg bg-[#111111] border-2 border-r-2 border-secondary_lightblue ">
    //     {children}
    // </div>
    <div className="block relative">
        {children}
    </div>
    // <div className="h-full">
    //     <div className="rounded-lg bg-white min-h-[70vh] border-4 border-r-4 border-secondary_lightblue overflow-hidden">
    //         {children}
    //     </div>
    // </div>
);

export default ColumnArea;