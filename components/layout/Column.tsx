import ColumnArea from "./ColumnArea";

type ColumnProps = {
    children: React.ReactNode;
}


const Column = ({ children }: ColumnProps) => (
    <div className=" px-2 border-gray-200  xl:border-b-0  xl:border-gray-200 ">
        <ColumnArea> {children} </ColumnArea>
    </div>
);

export default Column;