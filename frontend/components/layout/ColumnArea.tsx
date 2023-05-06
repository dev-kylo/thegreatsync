type ColumnAreaProps = {
    children: React.ReactNode;
};

// style={{ minHeight: '85vh' }}

const ColumnArea = ({ children }: ColumnAreaProps) => <div className="block relative">{children}</div>;

export default ColumnArea;
