type BlockProps = {
    children: React.ReactNode;
    outerClasses?: string;
    innerClasses?: string
    enableScroll?: boolean
    image?: boolean
    showBorder?: boolean;
    id?: string
}


const Block = ({ children, outerClasses, innerClasses, enableScroll, showBorder, id }: BlockProps) => (
    <div id={id} className={`relative overflow-hidden rounded-lg ${showBorder ? '' : 'border-2 border-r-2 border-secondary_lightblue'} ${enableScroll ? 'scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll' : ''} ${outerClasses}`}>
        {enableScroll ? (
            <div className={`absolute top-0 left-0 w-full h-auto ${innerClasses}`}>
                <div className="px-2 block relative">
                    {children}
                </div>
            </div>)
            : <div>{children}</div>}
    </div>
)

export default Block;