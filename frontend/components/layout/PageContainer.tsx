type PageContainerProps = {
    children: React.ReactNode;
};

const PageContainer = ({ children }: PageContainerProps) => (
    <div className="w-full scrollbar-thin scrollbar-thumb-secondary_lightblue overflow-y-scroll">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
);

export default PageContainer;
