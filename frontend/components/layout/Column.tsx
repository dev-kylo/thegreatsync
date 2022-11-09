import ColumnArea from "./ColumnArea";

type ColumnProps = {
    children: React.ReactNode;
}


//USED FOR GRID
const Column = ({ children }: ColumnProps) => (
    <div className="px-2 block relative">
        {children}
    </div>
);

export default Column;